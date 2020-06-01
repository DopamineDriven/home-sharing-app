"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingResolvers = exports.resolveBookingsIndex = void 0;
const mongodb_1 = require("mongodb");
const utils_1 = require("../../../lib/utils");
const api_1 = require("../../../lib/api");
exports.resolveBookingsIndex = (bookingsIndex, checkInDate, checkOutDate) => {
    let dateCursor = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const newBookingsIndex = { ...bookingsIndex };
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
        }
        else {
            throw new Error("selected dates cannot overlap dates already booked");
        }
        dateCursor = new Date(dateCursor.getTime() + 86400000);
    }
    return newBookingsIndex;
};
exports.bookingResolvers = {
    Mutation: {
        createBooking: async (_root, { input }, { db, req }) => {
            try {
                const { id, source, checkIn, checkOut } = input;
                const viewer = await utils_1.authorize(db, req);
                if (!viewer) {
                    throw new Error("viewer cannot be found");
                }
                const listing = await db.listings.findOne({
                    _id: new mongodb_1.ObjectId(id)
                });
                if (!listing) {
                    throw new Error("listing cannot be found");
                }
                if (listing.host === viewer._id) {
                    throw new Error("viewer cannot book their own listing");
                }
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);
                if (checkOutDate < checkInDate) {
                    throw new Error("check out date cannot be before check in date");
                }
                // create new bookingsIndex as a func of checkIn and checkOut dates
                const bookingsIndex = exports.resolveBookingsIndex(listing.bookingsIndex, checkIn, checkOut);
                const totalPrice = listing.price * (((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1));
                const host = await db.users.findOne({
                    _id: listing.host
                });
                if (!host || !host.walletId) {
                    throw new Error("the host either cannot be found or is not connected with Stripe");
                }
                await api_1.Stripe.charge(totalPrice, source, host.walletId);
                // update bookings collection
                const insertRes = await db.bookings.insertOne({
                    _id: new mongodb_1.ObjectId(),
                    listing: listing._id,
                    tenant: viewer._id,
                    checkIn,
                    checkOut
                });
                const insertedBooking = insertRes.ops[0];
                // update user doc of host to increment income
                await db.users.updateOne({ _id: host._id }, { $inc: { income: totalPrice } });
                // update user doc of viewer
                await db.users.updateOne({ _id: viewer._id }, { $push: { bookings: insertedBooking._id } });
                // update bookings field of listing document being booked
                await db.listings.updateOne({ _id: listing._id }, {
                    $set: { bookingsIndex },
                    $push: { bookings: insertedBooking._id }
                });
                // return newly inserted booking
                return insertedBooking;
            }
            catch (err) {
                throw new Error(`Failed to create booking - ${err}`);
            }
        }
    },
    Booking: {
        id: (booking) => {
            return booking._id.toHexString();
        },
        // (a)
        listing: (booking, _args, { db }) => {
            return db.listings.findOne({ _id: booking.listing });
        },
        tenant: (booking, _args, { db }) => {
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
//# sourceMappingURL=index.js.map