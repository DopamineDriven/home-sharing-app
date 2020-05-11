// import { listings } from './listings';
// import { 
//     GraphQLSchema, 
//     GraphQLObjectType, 
//     GraphQLString,
//     GraphQLID,
//     GraphQLInt,
//     GraphQLFloat, 
//     GraphQLNonNull,
//     GraphQLList
// } from "graphql";

// const Listing = new GraphQLObjectType({
//     name: "Listing",
//     fields: {
//         id: { type: GraphQLNonNull(GraphQLID) },
//         title: { type: GraphQLNonNull(GraphQLString) },
//         image: { type: GraphQLNonNull(GraphQLString) },
//         address: { type: GraphQLNonNull(GraphQLString) },
//         price: { type: GraphQLNonNull(GraphQLInt) },
//         numOfGuests: { type: GraphQLNonNull(GraphQLInt) },
//         numOfBeds: { type: GraphQLNonNull(GraphQLInt) },
//         numOfBaths: { type: GraphQLNonNull(GraphQLInt) },
//         rating: { type: GraphQLNonNull(GraphQLFloat) }
//     }
// });

// const query = new GraphQLObjectType({
//     name: "Query",
//     fields: {
//         listings: {
//             type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Listing))),
//             resolve: () => {
//                 return listings;
//             }
//         }
//     }
// });

// const mutation = new GraphQLObjectType({
//     name: "Mutation",
//     fields: {
//         deleteListing: {
//             type: GraphQLNonNull(Listing),
//             args: {
//                 id: { type: GraphQLNonNull(GraphQLID) }
//             },
//             // root type unused -> prefix with underscore
//             // destructuring id type and removing targeted listing via splice
//             resolve: (_root, { id }) => {
//                 for (let i=0; i<listings.length; i++) {
//                     if (listings[i].id === id) {
//                         return listings.splice(i, 1)[0];
//                     }
//                 }
//                 throw new Error("failed to delete listing")
//             }
//         }
//     }
// });


// export const schema = new GraphQLSchema({
//     query,
//     mutation
// });


// /*
// How to create GraphQL schemas without using schema definition language (long way)

// const Listing = new GraphQLObjectType({
//     name: "Listing",
//     fields: {
//         id: { type: GraphQLNonNull(GraphQLID) },
//         title: { type: GraphQLNonNull(GraphQLString) },
//         image: { type: GraphQLNonNull(GraphQLString) },
//         address: { type: GraphQLNonNull(GraphQLString) },
//         price: { type: GraphQLNonNull(GraphQLInt) },
//         numOfGuests: { type: GraphQLNonNull(GraphQLInt) },
//         numOfBeds: { type: GraphQLNonNull(GraphQLInt) },
//         numOfBaths: { type: GraphQLNonNull(GraphQLInt) },
//         rating: { type: GraphQLNonNull(GraphQLFloat) }
//     }
// });

// const query = new GraphQLObjectType({
//     name: "Query",
//     fields: {
//         listings: {
//             type: GraphQLNonNull(GraphQLList(GraphQLNonNull(Listing))),
//             resolve: () => {
//                 return listings;
//             }
//         }
//     }
// });

// const mutation = new GraphQLObjectType({
//     name: "Mutation",
//     fields: {
//         deleteListing: {
//             type: GraphQLNonNull(Listing),
//             args: {
//                 id: { type: GraphQLNonNull(GraphQLID) }
//             },
//             // root type unused -> prefix with underscore
//             // destructuring id type and removing targeted listing via splice
//             resolve: (_root, { id }) => {
//                 for (let i=0; i<listings.length; i++) {
//                     if (listings[i].id === id) {
//                         return listings.splice(i, 1)[0];
//                     }
//                 }
//                 throw new Error("failed to delete listing")
//             }
//         }
//     }
// });
// ---------------------------------------------------------------
// using the graphQL schema definition language

// type Listing {
//   id: ID!
//   title: String!
//   image: String!
//   address: String!
//   price: Int!
//   numOfGuests: Int!
//   numOfBeds: Int!
//   numOfBaths: Int!
//   rating: Float!
// }

// type Mutation {
//   deleteListing(id: ID!): Listing!
// }

// type Query {
//   listings: [Listing!]!
// }

// */