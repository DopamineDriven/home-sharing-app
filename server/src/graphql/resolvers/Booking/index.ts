import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { Booking, BookingsIndex, Database, Listing } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { CreateBookingArgs } from './types';
import { Stripe } from "../../../lib/api";

export const resolveBookingsIndex = (
    bookingsIndex: BookingsIndex,
    checkInDate: string,
    checkOutDate: string
): BookingsIndex => {
    let dateCursor = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

    while (dateCursor <= checkOut) {
        const y = dateCursor.getUTCFullYear(); // 2020 (UTC-5)
        const m = dateCursor.getUTCMonth(); // 04 -> May
        const d = dateCursor.getUTCDate(); // 30

        if (!newBookingsIndex[y]) {
            newBookingsIndex[y] = {};
        }

        if (!newBookingsIndex[y][m]) {
            newBookingsIndex[y][m] = {};
        }

        if (!newBookingsIndex[y][m][d]) {
            newBookingsIndex[y][m][d] = true;
        } else {
            throw new Error("selected dates cannot overlap dates already booked");
        }

        dateCursor = new Date(dateCursor.getTime() + 86400000);
    }

    return newBookingsIndex;
};

export const bookingResolvers: IResolvers = {
    Mutation: {
        createBooking: async (
            _root: undefined,
            { input }: CreateBookingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Booking> => {
            try {
                const { id, source, checkIn, checkOut } = input;

                const viewer = await authorize(db, req);
                
                if (!viewer) {
                    throw new Error("viewer cannot be found");
                }

                const listing = await db.listings.findOne({
                    _id: new ObjectId(id)
                });

                if (!listing) {
                    throw new Error("listing cannot be found");
                }

                if (listing.host === viewer._id) {
                    throw new Error("viewer cannot book their own listing");
                }

                const today = new Date();
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);

                // checkin date cannot exceed one year from the current date
                if (checkInDate.getTime() > today.getTime() + 365 * 86400000) {
                    throw new Error(
                        "check in date cannot exceed year-to-date"
                    );
                }

                // assume average booking is 7 days, make checkout 372 days
                if (checkOutDate.getTime() > today.getTime() + 372 * 86400000) {
                    throw new Error(
                        "check out date cannot exceed year-to-date plus one week"
                    );
                }

                if (checkOutDate < checkInDate) {
                    throw new Error(
                        "check out date cannot be before check in date"
                    );
                }

                // create new bookingsIndex as a func of checkIn and checkOut dates
                const bookingsIndex = resolveBookingsIndex(
                    listing.bookingsIndex,
                    checkIn,
                    checkOut
                );

                const totalPrice = 
                    listing.price*(
                        ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1)
                    );

                const host = await db.users.findOne({
                    _id: listing.host
                });

                if (!host || !host.walletId) {
                    throw new Error(
                        "the host either cannot be found or is not connected with Stripe"
                    );
                }

                await Stripe.charge(totalPrice, source, host.walletId);

                // update bookings collection
                const insertRes = await db.bookings.insertOne({
                    _id: new ObjectId(),
                    listing: listing._id,
                    tenant: viewer._id,
                    checkIn,
                    checkOut
                });

                const insertedBooking: Booking = insertRes.ops[0];

                // update user doc of host to increment income
                await db.users.updateOne(
                    { _id: host._id },
                    { $inc: { income: totalPrice } }
                );

                // update user doc of viewer
                await db.users.updateOne(
                    { _id: viewer._id },
                    { $push: { bookings: insertedBooking._id } }
                );

                // update bookings field of listing document being booked
                await db.listings.updateOne(
                    { _id: listing._id },
                    {
                        $set: { bookingsIndex },
                        $push: { bookings: insertedBooking._id }
                    }
                );

                // return newly inserted booking
                return insertedBooking;

            } catch (err) {
                throw new Error(`Failed to create booking - ${err}`);
            }
        }
    },
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
            return db.listings.findOne({ _id: booking.listing });
        },
        tenant: (
            booking: Booking,
            _args: {},
            { db }: { db: Database }
        ) => {
            return db.users.findOne({
                _id: booking.tenant
            });
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