import { IResolvers } from 'apollo-server-express';
import { Listing } from "../../../lib/types";

export const listingResolvers: IResolvers = {
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