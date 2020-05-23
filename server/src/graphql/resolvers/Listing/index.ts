import { IResolvers } from 'apollo-server-express';
import { ObjectId } from "mongodb";
import { Database, Listing, User } from "../../../lib/types";
import { ListingArgs } from "./types";
import { Request } from "express";
import { authorize } from "../../../lib/utils";


// host field within listing doc obj is an id of user who owns the listing
export const listingResolvers: IResolvers = {
    Query: {
        listing: async (
            _root: undefined,
            { id }: ListingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Listing> => {
            try {
                const listing = await db.listings.findOne({ _id: new ObjectId(id) });
                if (!listing) {
                    throw new Error("listing cannot be found");
                }

                const viewer = await authorize(db, req);
                if (viewer && viewer._id === listing.host) {
                    listing.authorized = true;
                }

                return listing;
            } catch (error) {
                throw new Error(`failed to query listing: ${error}`);
            }
        }
    },
    Listing: {
        id: (listing: Listing): string => {
            return listing._id.toHexString();
        },
        host: async (
            listing: Listing,
            _args: {},
            { db }: { db: Database }
        ): Promise<User> => {
            const host = await db.users.findOne({ _id: listing.host });
            if (!host) {
                throw new Error("host cannot be found");
            }
            return host;
        },
        bookingsIndex: (listing: Listing): string => {
            return JSON.stringify(listing.bookingsIndex);
        }
    }
};

/*
 As a reminder, the _id field for the user document in the 
 Mongo database is of type string and not of type ObjectID. 
 MongoDB natively creates an ObjectID type for the _id fields 
 but the user's _id field is a string since it simply captures 
 whatever id Google OAuth returns. The host in a listing document 
 is the same string representation of this ID.
*/