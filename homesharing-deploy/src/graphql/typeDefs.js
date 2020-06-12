"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
var apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\ttype Booking {\n\t\tid: ID!\n\t\tlisting: Listing!\n\t\ttenant: User!\n\t\tcheckIn: String!\n\t\tcheckOut: String!\n\t}\n\n\ttype Bookings {\n\t\ttotal: Int!\n\t\tresult: [Booking!]!\n\t}\n\n\tenum ListingType {\n\t\tAPARTMENT\n\t\tHOUSE\n\t}\n\n\tenum ListingsFilter {\n\t\tPRICE_LOW_TO_HIGH\n\t\tPRICE_HIGH_TO_LOW\n\t}\n\n\ttype Listing {\n\t\tid: ID!\n\t\ttitle: String!\n\t\tdescription: String!\n\t\timage: String!\n\t\thost: User!\n\t\ttype: ListingType!\n\t\taddress: String!\n\t\tcountry: String!\n\t\tadmin: String!\n\t\tcity: String!\n\t\tbookings(limit: Int!, page: Int!): Bookings\n\t\tbookingsIndex: String!\n\t\tprice: Int!\n\t\tnumOfGuests: Int!\n\t}\n\n\ttype Listings {\n\t\tregion: String\n\t\ttotal: Int!\n\t\tresult: [Listing!]!\n\t}\n\n\ttype User {\n\t\tid: ID!\n\t\tname: String!\n\t\tavatar: String!\n\t\tcontact: String!\n\t\thasWallet: Boolean!\n\t\tincome: Int\n\t\tbookings(limit: Int!, page: Int!): Bookings\n\t\tlistings(limit: Int!, page: Int!): Listings!\n\t}\n\t\n\ttype Viewer {\n\t\tid: ID\n\t\ttoken: String\n\t\tavatar: String\n\t\thasWallet: Boolean\n\t\tdidRequest: Boolean!\n\t}\n\n\tinput ConnectStripeInput {\n\t\tcode: String!\n\t}\n\n\tinput CreateBookingInput {\n\t\tid: ID!\n\t\tsource: String!\n\t\tcheckIn: String!\n\t\tcheckOut: String!\n\t}\n\n\tinput HostListingInput {\n\t\ttitle: String!\n\t\tdescription: String!\n\t\timage: String!\n\t\ttype: ListingType!\n\t\taddress: String!\n\t\tprice: Int!\n\t\tnumOfGuests: Int!\n\t}\n\t\n\tinput LogInInput {\n\t\tcode: String!\n\t}\n\n\ttype Query {\n\t\tauthUrl: String!\n\t\tuser(id: ID!): User!\n\t\tlisting(id: ID!): Listing!\n\t\tlistings(\n\t\t\tlocation: String\n\t\t\tfilter: ListingsFilter! \n\t\t\tlimit: Int! \n\t\t\tpage: Int!\n\t\t\t): Listings!\n\t}\n\n\ttype Mutation {\n\t\tlogIn(input: LogInInput): Viewer!\n\t\tlogOut: Viewer!\n\t\tconnectStripe(input: ConnectStripeInput!): Viewer!\n\t\tdisconnectStripe: Viewer!\n\t\thostListing(input: HostListingInput!): Listing!\n\t\tcreateBooking(input: CreateBookingInput!): Booking!\n\t}\n"], ["\n\ttype Booking {\n\t\tid: ID!\n\t\tlisting: Listing!\n\t\ttenant: User!\n\t\tcheckIn: String!\n\t\tcheckOut: String!\n\t}\n\n\ttype Bookings {\n\t\ttotal: Int!\n\t\tresult: [Booking!]!\n\t}\n\n\tenum ListingType {\n\t\tAPARTMENT\n\t\tHOUSE\n\t}\n\n\tenum ListingsFilter {\n\t\tPRICE_LOW_TO_HIGH\n\t\tPRICE_HIGH_TO_LOW\n\t}\n\n\ttype Listing {\n\t\tid: ID!\n\t\ttitle: String!\n\t\tdescription: String!\n\t\timage: String!\n\t\thost: User!\n\t\ttype: ListingType!\n\t\taddress: String!\n\t\tcountry: String!\n\t\tadmin: String!\n\t\tcity: String!\n\t\tbookings(limit: Int!, page: Int!): Bookings\n\t\tbookingsIndex: String!\n\t\tprice: Int!\n\t\tnumOfGuests: Int!\n\t}\n\n\ttype Listings {\n\t\tregion: String\n\t\ttotal: Int!\n\t\tresult: [Listing!]!\n\t}\n\n\ttype User {\n\t\tid: ID!\n\t\tname: String!\n\t\tavatar: String!\n\t\tcontact: String!\n\t\thasWallet: Boolean!\n\t\tincome: Int\n\t\tbookings(limit: Int!, page: Int!): Bookings\n\t\tlistings(limit: Int!, page: Int!): Listings!\n\t}\n\t\n\ttype Viewer {\n\t\tid: ID\n\t\ttoken: String\n\t\tavatar: String\n\t\thasWallet: Boolean\n\t\tdidRequest: Boolean!\n\t}\n\n\tinput ConnectStripeInput {\n\t\tcode: String!\n\t}\n\n\tinput CreateBookingInput {\n\t\tid: ID!\n\t\tsource: String!\n\t\tcheckIn: String!\n\t\tcheckOut: String!\n\t}\n\n\tinput HostListingInput {\n\t\ttitle: String!\n\t\tdescription: String!\n\t\timage: String!\n\t\ttype: ListingType!\n\t\taddress: String!\n\t\tprice: Int!\n\t\tnumOfGuests: Int!\n\t}\n\t\n\tinput LogInInput {\n\t\tcode: String!\n\t}\n\n\ttype Query {\n\t\tauthUrl: String!\n\t\tuser(id: ID!): User!\n\t\tlisting(id: ID!): Listing!\n\t\tlistings(\n\t\t\tlocation: String\n\t\t\tfilter: ListingsFilter! \n\t\t\tlimit: Int! \n\t\t\tpage: Int!\n\t\t\t): Listings!\n\t}\n\n\ttype Mutation {\n\t\tlogIn(input: LogInInput): Viewer!\n\t\tlogOut: Viewer!\n\t\tconnectStripe(input: ConnectStripeInput!): Viewer!\n\t\tdisconnectStripe: Viewer!\n\t\thostListing(input: HostListingInput!): Listing!\n\t\tcreateBooking(input: CreateBookingInput!): Booking!\n\t}\n"])));
var templateObject_1;
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
//# sourceMappingURL=typeDefs.js.map