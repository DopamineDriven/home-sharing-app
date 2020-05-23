import { IResolvers } from 'apollo-server-express';
import { ObjectId } from "mongodb";
import { Database, Listing } from "../../../lib/types";
import { ListingArgs } from "./types";

export const listingResolvers: IResolvers = {
    Query: {
        listing: async (
            _root: undefined,
            { id }: ListingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Listing> => {
            try {
                const listing = await db.listings.findOne({ _id: new ObjectId });
                if (!listing) {
                    throw new Error("listing cannot be found");
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
        }
    }
};

/*
There will be other resolvers we'll eventually need to create for the Listing object but 
for the fields we're attempting to access for the /user/:id page in our client, the id() 
resolver is the only one we'll explicitly need to create. The other fields being queried 
for the Listing object in the /user/:id are being handled as trivial resolvers.
*/