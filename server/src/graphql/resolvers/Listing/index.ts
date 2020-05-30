import { IResolvers } from 'apollo-server-express';
import { ObjectId } from "mongodb";
import { Database, Listing, User, ListingType } from "../../../lib/types";
import { 
    ListingArgs, 
    ListingBookingsArgs, 
    ListingBookingsData,
    ListingsArgs,
    ListingsData,
    ListingsFilter,
    ListingsQuery,
    HostListingArgs,
    HostListingInput
} from "./types";
import { Request } from "express";
import { authorize } from "../../../lib/utils";
import { Cloudinary, Google } from "../../../lib/api";

const verifyHostListingInput = ({
    title,
    description,
    type,
    price
}: HostListingInput) => {
    const { Apartment, House } = ListingType;
    if (title.length > 100) {
        throw new Error("listing title must be under 100 characters");
    }
    if (description.length > 5000) {
        throw new Error("listing description must be under 5000 characters")
    }
    if (type !== Apartment && type !== House) {
        throw new Error("listing type must be either an apartment or house");
    }
    if (price <= 0) {
        throw new Error("price must be greater than 0");
    }
};


// host field w/in listing doc obj -> id of user who owns the listing
export const listingResolvers: IResolvers = {
    Query: {
        listing: async (
            _root: undefined,
            { id }: ListingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Listing> => {
            try {
                const listing = await db.listings.findOne({ _id: new ObjectId(id) });
                if (!listing) {
                    throw new Error("listing cannot be found");
                }

                const viewer = await authorize(db, req);
                if (viewer && viewer._id === listing.host) {
                    listing.authorized = true;
                }

                return listing;
            } catch (error) {
                throw new Error(`failed to query listing: ${error}`);
            }
        },
        listings: async (
            _root: undefined,
            { location, filter, limit, page }: ListingsArgs,
            { db }: { db: Database }
        ): Promise<ListingsData> => {
            try {
                const query: ListingsQuery = {};
                const data: ListingsData = {
                    region: null,
                    total: 0,
                    result: []
                };

                if (location) {
                    const { country, admin, city } = await Google.geocode(location);
                    if (city) query.city = city;
                    if (admin) query.admin = admin;
                    if (country) {
                        query.country = country;
                    } else {
                        throw new Error("no country found");
                    }

                    const cityText = city ? `${city}, ` : "";
                    const adminText = admin ? `${admin}, ` : "";
                    data.region = `${cityText}${adminText}${country}`; 
                }

                let cursor = await db.listings.find(query);

                if (filter && filter === ListingsFilter.PRICE_LOW_TO_HIGH) {
                    cursor = cursor.sort({ price: 1 });
                }

                if (filter && filter === ListingsFilter.PRICE_HIGH_TO_LOW) {
                    cursor = cursor.sort({ price: -1 });
                }

                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return data;
            } catch (error) {
                throw new Error(`failed to query listings: ${error}`);
            }
        }
    },
    Mutation: {
        hostListing: async (
            _root: undefined,
            { input }: HostListingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Listing> => {
            verifyHostListingInput(input);

            const viewer = await authorize(db, req);
            if (!viewer) {
                throw new Error("viewer cannot be found");
            }

            const { country, admin, city } = await Google.geocode(input.address);
            if (!country || !admin || !city) {
                throw new Error("invalid address input");
            }

            const imageURL = await Cloudinary.upload(input.image);

            const insertResult = await db.listings.insertOne({
                _id: new ObjectId(),
                ...input,
                image: imageURL,
                bookings: [],
                bookingsIndex: {},
                country,
                admin,
                city,
                host: viewer._id
            });

            const insertedListing: Listing = insertResult.ops[0];

            await db.users.updateOne(
                { _id: viewer._id },
                { $push: { listings: insertedListing._id } }
            );

            return insertedListing
        }
    },
    Listing: {
        id: (listing: Listing): string => {
            return listing._id.toHexString();
        },
        host: async (
            listing: Listing,
            _args: {},
            { db }: { db: Database }
        ): Promise<User> => {
            const host = await db.users.findOne({ _id: listing.host });
            if (!host) {
                throw new Error("host cannot be found");
            }
            return host;
        },
        bookingsIndex: (listing: Listing): string => {
            return JSON.stringify(listing.bookingsIndex);
        },
        bookings: async (
            listing: Listing,
            { limit, page }: ListingBookingsArgs,
            { db }: { db: Database }
        ): Promise<ListingBookingsData | null> => {
            try {
                if (!listing.authorized) {
                    return null;
                }

                const data: ListingBookingsData = {
                    total: 0,
                    result: []
                };

                let cursor = await db.bookings.find({
                    _id: { $in: listing.bookings }
                });

                cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return data;

            } catch (error) {
                throw new Error(`failed to query listing bookings: ${error}`);
            }
        }
    }
};

/*
 As a reminder, the _id field for the user document in the 
 Mongo database is of type string and not of type ObjectID. 
 MongoDB natively creates an ObjectID type for the _id fields 
 but the user's _id field is a string since it simply captures 
 whatever id Google OAuth returns. The host in a listing document 
 is the same string representation of this ID.
*/

/*
Listing booking resolver explained
    - root obj passed in is listing of type Listing
    - shape of arguments passed in is ListingBookingsArgs
    - upon resolving function successfully it should return a
        Promise that when resolved will be an obj of shape
        ListingBookingsData or null
    - in the resolver func, check for authorized field from listing obj
    - $in operator used within MongoDB find() method references
        the listing.bookings array
    

*/