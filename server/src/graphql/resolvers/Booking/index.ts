import { IResolvers } from "apollo-server-express";
import { Booking, Database, Listing } from "../../../lib/types";

export const bookingResolvers: IResolvers = {
    Booking: {
        id: (booking: Booking): string => {
            return booking._id.toHexString();
        },
        // (a)
        listing: (
            booking: Booking,
            _args: {},
            { db }: { db: Database }
        ): Promise<Listing | null> => {
            return db.listings.findOne({ _id: booking.listing })
        }
    }
};

/*
(a)
additional explicit resolver function required
    in the /user/:id page -> upon querying for a booking object 
    it is expected that a listing field is also queried; that is,
    a listing obj summarizing the listing details of a booking
        in booking doc of db, listing is stored as an id value
        in the client, however, a listing obj is expected
    Therefore, a resolver for the listing field is required as
    the additional explicit resolver
        this will find a single listing document from the listings
        collection where the val of listing._id === id value of 
        the booking.listing field 
*/