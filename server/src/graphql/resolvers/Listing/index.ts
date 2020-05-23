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
            }catch (error) {
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
        }
    }
};

/*
There will be other resolvers we'll eventually need to create for the Listing object but 
for the fields we're attempting to access for the /user/:id page in our client, the id() 
resolver is the only one we'll explicitly need to create. The other fields being queried 
for the Listing object in the /user/:id are being handled as trivial resolvers.
*/