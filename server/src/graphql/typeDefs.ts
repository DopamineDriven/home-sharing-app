import { gql } from "apollo-server-express";
export const typeDefs = gql`
	type Listing {
		id: ID!
		title: String!
		image: String!
		address: String!
		price: Int!
		numOfGuests: Int!
		numOfBeds: Int!
		numOfBaths: Int!
		rating: Float!
	}

	type Mutation {
		deleteListing(id: ID!): Listing!
	}

	type Query {
		listings: [Listing!]!
	}
`;

/*
Installed GraphQL extension 

gql tag parses the string created into a GraphQL Abstract Syntax Tree
    Apollo Server requires its use to wrap the schema

Note
    gql is a function that takes a string as an argument
    string arg must be constructed with template literals
        ES6 feature known as "tagged template literals"

Takeaway
    gql is a tag(function) where the argument is derived from
    the template literal applied alongisde it
        takes the string -> returns a GraphQL Tree
*/