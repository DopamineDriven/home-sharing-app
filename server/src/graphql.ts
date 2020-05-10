import { listings } from './listings';
import { 
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat, 
    GraphQLNonNull,
    GraphQLList
} from "graphql";

const Listing = new GraphQLObjectType({
    name: "Listing",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLNonNull(GraphQLString) },
        address: { type: GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLNonNull(GraphQLInt) },
        numOfGuests: { type: GraphQLNonNull(GraphQLInt) },
        numOfBeds: { type: GraphQLNonNull(GraphQLInt) },
        numOfBaths: { type: GraphQLNonNull(GraphQLInt) },
        rating: { type: GraphQLNonNull(GraphQLFloat) }
    }
});

const query = new GraphQLObjectType({
    name: "Query",
    fields: {
        listings: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Listing))),
            resolve: () => {
                return listings;
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        deleteListing: {
            type: GraphQLNonNull(Listing),
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            }
        }
    }
});


export const schema = new GraphQLSchema({
    query,
    mutation,
});