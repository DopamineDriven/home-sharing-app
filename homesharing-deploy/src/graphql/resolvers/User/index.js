"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const utils_1 = require("../../../lib/utils");
// when userResolvers func complete -> resolves to a Promise of a User
exports.userResolvers = {
    Query: {
        user: async (_root, { id }, { db, req }) => {
            try {
                const user = await db.users.findOne({ _id: id });
                if (!user) {
                    throw new Error("user not found");
                }
                const viewer = await utils_1.authorize(db, req);
                // check authorized = true before resolving data requested
                if (viewer && viewer._id === user._id) {
                    user.authorized = true;
                }
                return user;
            }
            catch (error) {
                throw new Error(`failed to query user - ${error}`);
            }
        }
    },
    User: {
        id: (user) => {
            return user._id;
        },
        // returns bool indicating if user has connected to Stripe for payments
        hasWallet: (user) => {
            return Boolean(user.walletId);
        },
        // protected resolver func; return user.income if true, else null
        income: (user) => {
            return user.authorized ? user.income : null;
        },
        bookings: async (user, { limit, page }, { db }) => {
            try {
                if (!user.authorized) {
                    return null;
                }
                // data obj initializes data to be updated and returned
                const data = {
                    total: 0,
                    result: []
                };
                let cursor = await db.bookings.find({
                    _id: { $in: user.bookings }
                });
                // P = page=1; L = limit=10; cursor starts at doc [0]
                //     (P-1)L = (1-1)10 = [0]
                // P = page=2; L = limit=10; cursor starts at doc [10]
                //     (P-1)L = (2-1)10 = [10]
                // P = page=3; L = limit=10; cursor starts at doc [20]
                //     (P-1)L = (3-1)10 = [20]
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);
                // cursor.count() -> Mongo gets total count of 
                // initial query while ignoring limit modifier
                data.total = await cursor.count();
                data.result = await cursor.toArray();
                return data;
            }
            catch (error) {
                throw new Error(`failed to query user bookings - ${error}`);
            }
        },
        listings: async (user, { limit, page }, { db }) => {
            try {
                const data = {
                    total: 0,
                    result: []
                };
                let cursor = await db.listings.find({
                    _id: { $in: user.listings }
                });
                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);
                data.total = await cursor.count();
                data.result = await cursor.toArray();
                return data;
            }
            catch (error) {
                throw new Error(`failed to query user listings - ${error}`);
            }
        }
    }
};
//# sourceMappingURL=index.js.map