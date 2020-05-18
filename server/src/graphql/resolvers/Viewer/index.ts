import crypto from "crypto";
import { IResolvers } from "apollo-server-express";
import { Viewer, Database, User } from "../../../lib/types";
import { Google } from "../../../lib/api";
import { LogInArgs } from "./types";

const logInViaGoogle = async (
	code: string,
	token: string,
	db: Database
): Promise<User | undefined> => {
	// destruct user data upon successfully resolving
	const { user } = await Google.logIn(code);
	if (!user) {
		throw new Error("Google login error");
	}

	// Names/Photos/Email Lists
	const userNamesList = user.names && user.names.length ? user.names : null;
	const userPhotosList = user.photos && user.photos.length ? user.photos : null;
	const userEmailsList =
		user.emailAddresses && user.emailAddresses.length
			? user.emailAddresses
			: null;

	// User Display Name
	const userName = userNamesList ? userNamesList[0].displayName : null;

	// get user id of the first username
	const userId =
		userNamesList &&
		userNamesList[0].metadata &&
		userNamesList[0].metadata.source
			? userNamesList[0].metadata.source.id
			: null;

	// get user avatar from the url field from first item in photos list
	const userAvatar =
		userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

	// get user email from first email in emails list
	const userEmail =
		userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

	if (!userId || !userName || !userAvatar || !userEmail) {
		throw new Error("Google login error");
	}

	const updateRes = await db.users.findOneAndUpdate(
		{ _id: userId },
		{
			$set: {
				name: userName,
				avatar: userAvatar,
				contact: userEmail,
				token
			}
		},
		{ returnOriginal: false }
	);

	let viewer = updateRes.value;

	if (!viewer) {
		// insert new user
		const insertResult = await db.users.insertOne({
			_id: userId,
			token,
			name: userName,
			avatar: userAvatar,
			contact: userEmail,
			income: 0,
			bookings: [],
			listings: []
		});
		viewer = insertResult.ops[0];
	}

	return viewer;
};

export const viewerResolvers: IResolvers = {
	Query: {
		authUrl: (): string => {
			try {
				return Google.authUrl;
			} catch (error) {
				throw new Error(`Failed to query Google Auth Url ${error}`);
			}
		}
	},
	Mutation: {
		logIn: async (
			_root: undefined,
			{ input }: LogInArgs,
			{ db }: { db: Database }
		): Promise<Viewer> => {
			const code = input ? input.code : null;
			const token = crypto.randomBytes(16).toString("hex");
			const viewer: User | undefined = code
				? await logInViaGoogle(code, token, db)
				: undefined;
			if (!viewer) {
				return { didRequest: true };
			}
			return {
				_id: viewer._id,
				token: viewer.token,
				avatar: viewer.avatar,
				walletId: viewer.walletId,
				didRequest: true
			};
		},
		logOut: (): Viewer => {
			try {
                return { didRequest: true }
            } catch (error) {
                throw new Error(`Failed to log out ${error}`)
            }
		}
	},
	Viewer: {
		id: (viewer: Viewer): string | undefined => {
			return viewer._id;
		},
		hasWallet: (viewer: Viewer): boolean | undefined => {
			return viewer.walletId ? true : undefined;
		}
	}
};

/*
- LogIn mutation fired in one of two cases
    - (1) viewer signs-in w/ google authentication url and consent screen
    - (2) viewer signs-in w/ their cookie session
- First, check presence of code prop with input arg
    - if present, set a const of the same name
    - else, set the val of the const to null
- Next, create a random string to use as a session token
    - randomly generated each time user logs in
    - will be used on each request it intends to make
        - requests authorized to ensure valid viewer -> prevent CSRF attacks
        - randomly generated 16-byte hexadecimal string stored in database 
*/
