import crypto from "crypto";
import { IResolvers } from "apollo-server-express";
import { Viewer, Database, User } from "../../../lib/types";
import { Google, Stripe } from "../../../lib/api";
import { ConnectStripeArgs, LogInArgs } from "./types";
import { Request, Response } from "express";
import { authorize } from "../../../lib/utils";

const isDev = process.env.NODE_ENV === "development";

// options object https://www.npmjs.com/package/cookie-parser
const cookieOptions = {
	httpOnly: true,
	sameSite: true,
	signed: true,
	secure: isDev ? false : true
};

const logInViaGoogle = async (
	code: string,
	token: string,
	db: Database,
	res: Response
): Promise<User | undefined> => {
	// destruct user data upon successfully resolving
	try {
		const { user } = await Google.logIn(code);
		if (!user) {
			throw new Error("Google login error");
		}

		// Names/Photos/Email Lists
		const userNamesList = user.names && user.names.length ? user.names : null;
		const userPhotosList =
			user.photos && user.photos.length ? user.photos : null;
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
			userEmailsList && userEmailsList[0].value
				? userEmailsList[0].value
				: null;

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
					token,
				},
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
				listings: [],
			});
			// ops: WithId<User>[]
			viewer = insertResult.ops[0];
		}

		res.cookie("viewer", userId, {
			...cookieOptions,
			maxAge: 24*60*60*1000, // one day
		});

		return viewer;
	} catch (error) {
		throw new Error(`There was an error ${error}`);
	}
};

// find doc in user collection where user _id = viewer cookie value
const logInViaCookie = async (
	token: string,
	db: Database,
	req: Request,
	res: Response
): Promise<User | undefined> => {
	const updateRes = await db.users.findOneAndUpdate(
		{ _id: req.signedCookies.viewer },
		{ $set: { token } },
		{ returnOriginal: false }
	);
	
	const viewer = updateRes.value;

	if (!viewer) {
		res.clearCookie("viewer", cookieOptions);
	}

	return viewer

};

export const viewerResolvers: IResolvers = {
	Query: {
		authUrl: (): string => {
			try {
				return Google.authUrl;
			} catch (error) {
				throw new Error(`Failed to query Google Auth Url ${error}`);
			}
		},
	},
	Mutation: {
		logIn: async (
			_root: undefined,
			{ input }: LogInArgs,
			{ db, req, res }: { db: Database; req: Request; res: Response }
		): Promise<Viewer> => {
			try {
				const code = input ? input.code : null;
				const token = crypto.randomBytes(16).toString("hex");
				const viewer: User | undefined = code
					? await logInViaGoogle(code, token, db, res)
					// if login fired and !code -> client is logging in via a cookie
					: await logInViaCookie(token, db, req, res);
				if (!viewer) {
					return { didRequest: true };
				}
				return {
					_id: viewer._id,
					token: viewer.token,
					avatar: viewer.avatar,
					walletId: viewer.walletId,
					didRequest: true,
				};
			} catch (error) {
				throw new Error(`Failed to log in ${error}`);
			}
		},
		logOut: (
			_root: undefined,
			_args: {},
			{ res }: { res: Response }
		): Viewer => {
			try {
				res.clearCookie("viewer", cookieOptions)
				return { didRequest: true };
			} catch (error) {
				throw new Error(`Failed to log out ${error}`);
			}
		}, 
		connectStripe: async (
			_root: undefined,
			{ input }: ConnectStripeArgs,
			{ db, req }: { db: Database; req: Request }
		): Promise<Viewer | undefined> => {
			try {
				const { code } = input;
				
				let viewer = await authorize(db, req);
				if (!viewer) {
					throw new Error("viewer not found");
				}
				
				// (a)
				const wallet = await Stripe.connect(code);
				if (!wallet) {
					throw new Error("stripe grant error (originating in ./api/Stripe.ts)");
				}


				const updateRes = await db.users.findOneAndUpdate(
					{ _id: viewer._id },
					{ $set: { walletId: wallet.stripe_user_id } },
					// returnOriginal -> false -> return updated response
					{ returnOriginal: false }
				);

				if (!updateRes.value) {
					throw new Error("viewer could not be updated");
				}

				viewer = updateRes.lastErrorObject;

				return {
					_id: viewer?._id,
					token: viewer?.token,
					avatar: viewer?.avatar,
					walletId: viewer?.walletId,
					didRequest: true
				};

			} catch (error) {
				throw new Error(`Failed to connect with Stripe - ${error}`);
			}
		},
		disconnectStripe: async (
			_root: undefined,
			_args: {},
			{ db, req }: { db: Database; req: Request }
		): Promise<Viewer | undefined> => {
			try {
				let viewer = await authorize(db, req);
				if (!viewer) {
					throw new Error("viewer not found");
				}

				const wallet = await Stripe.disconnect(viewer._id);
				if (!wallet) {
					throw new Error("stripe disconnect error");
				}


				const updateRes = await db.users.findOneAndUpdate(
					{ _id: viewer._id },
					{ $set: { walletId: undefined } },
					{ returnOriginal: false }
				);

				if (!updateRes.value) {
					throw new Error("viewer could not be updated");
				}

				viewer = updateRes.value;

				return {
					_id: viewer._id,
					token: viewer.token,
					avatar: viewer.avatar,
					walletId: viewer.walletId,
					didRequest: true
				};

			} catch (error) {
				throw new Error(`Failed to disconnect with Stripe - ${error}`);
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
(a)
	if the preceding code (snippet below) -> success
		let viewer = await authorize(db, req)
	then the viewer is authorized so proceed with connecting to Stripe
*/

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
