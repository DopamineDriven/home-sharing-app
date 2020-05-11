import { IResolvers } from "apollo-server-express";
import { Database, Listing } from "../lib/types";
import { ObjectId } from 'mongodb';

export const resolvers: IResolvers = {
	Query: {
		listings: async (
			_root: undefined, 
			_args: {}, 
			{ db }: { db: Database }
		): Promise<Listing[]> => {
			return await db.listings.find({}).toArray();
		}
	},
	Mutation: {
		deleteListing: async (
			_root: undefined, 
			{ id }: { id: string },
			{ db }: { db: Database }
		): Promise<Listing> => {
			const deleteRes = await db.listings.findOneAndDelete({
				// _id: new ObjectId(id) accepts string class (id)
				_id: new ObjectId(id)
			});
			if (!deleteRes.value) {
				throw new Error("failed to delete listing");
			}
			return deleteRes.value;
		}
	},
	// in Listing obj type, first positional obj arg is listing obj returned from parent fields
	Listing: {
		id: (listing: Listing): string => listing._id.toHexString()
	}
};


// these are trivial resolvers https://graphql.org/learn/execution/#trivial-resolvers
// trivial resolvers 
	// return a val from the obj using the same key specified in the Obj type
	// title -> listing.title
	// title: (listing: Listing) => listing.title,
	// image: (listing: Listing) => listing.image
// no need to explicitly specify trivial resolvers;
	// these fields are being resolved in the background by GraphQL

// must explicitly define _root and { id } otherwise have implicit type of any
    // pass _root the undefined type
    // pass { id } the string type as the destructed id will be a string when run