import { gql } from "apollo-server-express";
export const typeDefs = gql`
	type Booking {
		id: ID!
		listing: Listing!
		tenant: User!
		checkIn: String!
		checkOut: String!
	}

	type Bookings {
		total: Int!
		result: [Booking!]!
	}

	enum ListingType {
		APARTMENT
		HOUSE
	}

	type Listing {
		id: ID!
		title: String!
		description: String!
		image: String!
		host: User!
		type: ListingType!
		address: String!
		city: String!
		bookings(limit: Int!, page: Int!): Bookings
		bookingsIndex: String!
		price: Int!
		numOfGuests: Int!
	}

	type Listings {
		total: Int!
		result: [Listing!]!
	}

	type User {
		id: ID!
		name: String!
		avatar: String!
		contact: String!
		hasWallet: Boolean!
		income: Int
		bookings(limit: Int!, page: Int!): Bookings
		listings(limit: Int!, page: Int!): Listings!
	}
	
	type Viewer {
		id: ID
		token: String
		avatar: String
		hasWallet: Boolean
		didRequest: Boolean!
	}

	input LogInInput {
		code: String!
	}

	type Query {
		authUrl: String!
		user(id: ID!): User!
		listing: String!
	}

	type Mutation {
		logIn(input: LogInInput): Viewer!
		logOut: Viewer!
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
