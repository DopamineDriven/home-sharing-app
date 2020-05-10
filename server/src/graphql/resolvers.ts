import { IResolvers } from "apollo-server-express";
import { listings } from "../listings";

export const resolvers: IResolvers = {
	Query: {
		listings: () => {
			return listings;
		}
	},
	Mutation: {
		deleteListing: (_root: undefined, { id }: { id: string }) => {
			for (let i = 0; i < listings.length; i++) {
				if (listings[i].id === id) {
					return listings.splice(i, 1)[0];
				}
			}
			throw new Error("failed to delete listing");
		}
	}
};

// must explicitly define _root and { id } otherwise have implicit type of any
    // pass _root the undefined type
    // pass { id } the string type as the destructed id will be a string when run