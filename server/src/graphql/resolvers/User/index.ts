import { IResolvers } from "apollo-server-express";
import { 
    UserArgs, 
    UserBookingsArgs, 
    UserBookingsData, 
    UserListingsArgs, 
    UserListingsData 
} from './types';
import { Database, User } from "../../../lib/types";
import { Request } from "express";
import { authorize } from "../../../lib/utils";

// when userResolvers func complete -> resolves to a Promise of a User

export const userResolvers: IResolvers = {
    Query: {
        user: async (
            _root: undefined,
            { id }: UserArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<User> => {
            try {
                const user = await db.users.findOne({ _id: id });
                
                if (!user) {
                    throw new Error("user not found");
                }

                const viewer = await authorize(db, req);

                // check authorized = true before resolving data requested
                if (viewer && viewer._id === user._id) {
                    user.authorized = true;
                }

                return user;

            } catch (error) {
                throw new Error(`failed to query user - ${error}`)
            }
        }
    },
    User: {
        id: (user: User): string => {
            return user._id;
        },
        // returns bool indicating if user has connected to Stripe for payments
        hasWallet: (user: User): boolean => {
            return Boolean(user.walletId);
        },
        // protected resolver func; return user.income if true, else null
        income: (user: User): number | null => {
            return user.authorized ? user.income : null;
        },
        bookings: async (
            user: User,
            { limit, page }: UserBookingsArgs,
            { db }: { db: Database }
        ): Promise<UserBookingsData | null> => {
            try {
                if (!user.authorized) {
                    return null;
                }

                // data obj initializes data to be updated and returned
                const data: UserBookingsData = {
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

            } catch (error) {
                throw new Error(`failed to query user bookings - ${error}`);
            }
        },
        listings: async (
            user: User,
            { limit, page }: UserListingsArgs,
            { db }: { db: Database }
        ): Promise<UserListingsData | null> => {
            try {
                const data: UserListingsData = {
                    total: 0,
                    result: []
                };

                let cursor = await db.listings.find({
                    _id: { $in: user.listings }
                });

                cursor = cursor.skip(page > 0 ? (page-1) * limit: 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return data;

            } catch (error) {
                throw new Error(`failed to query user listings - ${error}`);
            }
        }
    }
};