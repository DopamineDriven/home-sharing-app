import { IResolvers } from "apollo-server-express";
import { UserArgs } from "./types";
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
        bookings: () => {},
        listings: () => {}
    }
};