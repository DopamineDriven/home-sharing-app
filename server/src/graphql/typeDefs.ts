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

	enum ListingsFilter {
		PRICE_LOW_TO_HIGH
		PRICE_HIGH_TO_LOW
	}

	type Listing {
		id: ID!
		title: String!
		description: String!
		image: String!
		host: User!
		type: ListingType!
		address: String!
		country: String!
		admin: String!
		city: String!
		bookings(limit: Int!, page: Int!): Bookings
		bookingsIndex: String!
		price: Int!
		numOfGuests: Int!
	}

	type Listings {
		region: String
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

	input ConnectStripeInput {
		code: String!
	}

	input CreateBookingInput {
		id: ID!
		source: String!
		checkIn: String!
		checkOut: String!
	}

	input HostListingInput {
		title: String!
		description: String!
		image: String!
		type: ListingType!
		address: String!
		price: Int!
		numOfGuests: Int!
	}
	
	input LogInInput {
		code: String!
	}

	type Query {
		authUrl: String!
		user(id: ID!): User!
		listing(id: ID!): Listing!
		listings(
			location: String
			filter: ListingsFilter! 
			limit: Int! 
			page: Int!
			): Listings!
	}

	type Mutation {
		logIn(input: LogInInput): Viewer!
		logOut: Viewer!
		connectStripe(input: ConnectStripeInput!): Viewer!
		disconnectStripe: Viewer!
		hostListing(input: HostListingInput!): Listing!
		createBooking(input: CreateBookingInput!): Booking!
	}
`;

/*
note: LogInInput isn't a required argument since user can be logged in
	one of two ways
		(1) where client app provides a code
		(2) where the client provides a viewer cookie
	That said with ConnectStripeInput! it is indeed required
	Why?
		expect capability to connect to only happen in presence of
		valid authorization code 
		this is why input for connectStripe mutation is a required arg


type Viewer {
	id: ID
	token: String
	avatar: String
	hasWallet: Boolean
	didRequest: Boolean!
}

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
