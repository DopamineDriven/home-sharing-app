import { GraphQLString } from 'graphql';
import { 
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat 
} from "graphql";

const query = new GraphQLObjectType({
    name: "Query",
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => "Hello from the Query!"
        }
    }
});

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => "Hello from the Mutation!"
        }
    }
});

const Listing = new GraphQLObjectType({
    name: "Listing",
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        image: { type: GraphQLString },
        address: { type: GraphQLString },
    }
})

export const schema = new GraphQLSchema({
    query,
    mutation
});