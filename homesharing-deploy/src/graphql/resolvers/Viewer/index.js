"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewerResolvers = void 0;
const crypto_1 = __importDefault(require("crypto"));
const api_1 = require("../../../lib/api");
const utils_1 = require("../../../lib/utils");
const isDev = process.env.NODE_ENV === "development";
// options object https://www.npmjs.com/package/cookie-parser
const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: isDev ? false : true
};
const logInViaGoogle = async (code, token, db, res) => {
    // destruct user data upon successfully resolving
    try {
        const { user } = await api_1.Google.logIn(code);
        if (!user) {
            throw new Error("Google login error");
        }
        // Names/Photos/Email Lists
        const userNamesList = user.names && user.names.length ? user.names : null;
        const userPhotosList = user.photos && user.photos.length ? user.photos : null;
        const userEmailsList = user.emailAddresses && user.emailAddresses.length
            ? user.emailAddresses
            : null;
        // User Display Name
        const userName = userNamesList ? userNamesList[0].displayName : null;
        // get user id of the first username
        const userId = userNamesList &&
            userNamesList[0].metadata &&
            userNamesList[0].metadata.source
            ? userNamesList[0].metadata.source.id
            : null;
        // get user avatar from the url field from first item in photos list
        const userAvatar = userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;
        // get user email from first email in emails list
        const userEmail = userEmailsList && userEmailsList[0].value
            ? userEmailsList[0].value
            : null;
        if (!userId || !userName || !userAvatar || !userEmail) {
            throw new Error("Google login error");
        }
        const updateRes = await db.users.findOneAndUpdate({ _id: userId }, {
            $set: {
                name: userName,
                avatar: userAvatar,
                contact: userEmail,
                token,
            },
        }, { returnOriginal: false });
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
            maxAge: 24 * 60 * 60 * 1000,
        });
        return viewer;
    }
    catch (error) {
        throw new Error(`There was an error ${error}`);
    }
};
// find doc in user collection where user _id = viewer cookie value
const logInViaCookie = async (token, db, req, res) => {
    const updateRes = await db.users.findOneAndUpdate({ _id: req.signedCookies.viewer }, { $set: { token } }, { returnOriginal: false });
    const viewer = updateRes.value;
    if (!viewer) {
        res.clearCookie("viewer", cookieOptions);
    }
    return viewer;
};
exports.viewerResolvers = {
    Query: {
        authUrl: () => {
            try {
                return api_1.Google.authUrl;
            }
            catch (error) {
                throw new Error(`Failed to query Google Auth Url ${error}`);
            }
        },
    },
    Mutation: {
        logIn: async (_root, { input }, { db, req, res }) => {
            try {
                const code = input ? input.code : null;
                const token = crypto_1.default.randomBytes(16).toString("hex");
                const viewer = code
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
            }
            catch (error) {
                throw new Error(`Failed to log in ${error}`);
            }
        },
        logOut: (_root, _args, { res }) => {
            try {
                res.clearCookie("viewer", cookieOptions);
                return { didRequest: true };
            }
            catch (error) {
                throw new Error(`Failed to log out ${error}`);
            }
        },
        connectStripe: async (_root, { input }, { db, req }) => {
            try {
                const { code } = input;
                let viewer = await utils_1.authorize(db, req);
                if (!viewer) {
                    throw new Error("viewer not found");
                }
                // (a)
                const wallet = await api_1.Stripe.connect(code);
                if (!wallet) {
                    throw new Error("stripe grant error (originating in ./api/Stripe.ts)");
                }
                const updateRes = await db.users.findOneAndUpdate({ _id: viewer._id }, { $set: { walletId: wallet.stripe_user_id } }, 
                // returnOriginal -> false -> return updated response
                { returnOriginal: false });
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
            }
            catch (error) {
                throw new Error(`Failed to connect with Stripe - ${error}`);
            }
        },
        disconnectStripe: async (_root, _args, { db, req }) => {
            try {
                let viewer = await utils_1.authorize(db, req);
                if (!viewer) {
                    throw new Error("viewer not found");
                }
                const updateRes = await db.users.findOneAndUpdate({ _id: viewer._id }, { $set: { walletId: undefined } }, { returnOriginal: false });
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
            }
            catch (error) {
                throw new Error(`Failed to disconnect with Stripe - ${error}`);
            }
        }
    },
    Viewer: {
        id: (viewer) => {
            return viewer._id;
        },
        hasWallet: (viewer) => {
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
//# sourceMappingURL=index.js.map