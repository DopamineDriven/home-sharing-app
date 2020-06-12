"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingResolvers = exports.resolveBookingsIndex = void 0;
var mongodb_1 = require("mongodb");
var utils_1 = require("../../../lib/utils");
var api_1 = require("../../../lib/api");
exports.resolveBookingsIndex = function (bookingsIndex, checkInDate, checkOutDate) {
    var dateCursor = new Date(checkInDate);
    var checkOut = new Date(checkOutDate);
    var newBookingsIndex = __assign({}, bookingsIndex);
    while (dateCursor <= checkOut) {
        var y = dateCursor.getUTCFullYear(); // 2020 (UTC-5)
        var m = dateCursor.getUTCMonth(); // 04 -> May
        var d = dateCursor.getUTCDate(); // 30
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
        createBooking: function (_root, _a, _b) {
            var input = _a.input;
            var db = _b.db, req = _b.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var id, source, checkIn, checkOut, viewer, listing, today, checkInDate, checkOutDate, bookingsIndex, totalPrice, host, insertRes, insertedBooking, err_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 9, , 10]);
                            id = input.id, source = input.source, checkIn = input.checkIn, checkOut = input.checkOut;
                            return [4 /*yield*/, utils_1.authorize(db, req)];
                        case 1:
                            viewer = _c.sent();
                            if (!viewer) {
                                throw new Error("viewer cannot be found");
                            }
                            return [4 /*yield*/, db.listings.findOne({
                                    _id: new mongodb_1.ObjectId(id)
                                })];
                        case 2:
                            listing = _c.sent();
                            if (!listing) {
                                throw new Error("listing cannot be found");
                            }
                            if (listing.host === viewer._id) {
                                throw new Error("viewer cannot book their own listing");
                            }
                            today = new Date();
                            checkInDate = new Date(checkIn);
                            checkOutDate = new Date(checkOut);
                            // checkin date cannot exceed one year from the current date
                            if (checkInDate.getTime() > today.getTime() + 365 * 86400000) {
                                throw new Error("check in date cannot exceed year-to-date");
                            }
                            // assume average booking is 7 days, make checkout 372 days
                            if (checkOutDate.getTime() > today.getTime() + 372 * 86400000) {
                                throw new Error("check out date cannot exceed year-to-date plus one week");
                            }
                            if (checkOutDate < checkInDate) {
                                throw new Error("check out date cannot be before check in date");
                            }
                            bookingsIndex = exports.resolveBookingsIndex(listing.bookingsIndex, checkIn, checkOut);
                            totalPrice = listing.price * (((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1));
                            return [4 /*yield*/, db.users.findOne({
                                    _id: listing.host
                                })];
                        case 3:
                            host = _c.sent();
                            if (!host || !host.walletId) {
                                throw new Error("the host either cannot be found or is not connected with Stripe");
                            }
                            return [4 /*yield*/, api_1.Stripe.charge(totalPrice, source, host.walletId)];
                        case 4:
                            _c.sent();
                            return [4 /*yield*/, db.bookings.insertOne({
                                    _id: new mongodb_1.ObjectId(),
                                    listing: listing._id,
                                    tenant: viewer._id,
                                    checkIn: checkIn,
                                    checkOut: checkOut
                                })];
                        case 5:
                            insertRes = _c.sent();
                            insertedBooking = insertRes.ops[0];
                            // update user doc of host to increment income
                            return [4 /*yield*/, db.users.updateOne({ _id: host._id }, { $inc: { income: totalPrice } })];
                        case 6:
                            // update user doc of host to increment income
                            _c.sent();
                            // update user doc of viewer
                            return [4 /*yield*/, db.users.updateOne({ _id: viewer._id }, { $push: { bookings: insertedBooking._id } })];
                        case 7:
                            // update user doc of viewer
                            _c.sent();
                            // update bookings field of listing document being booked
                            return [4 /*yield*/, db.listings.updateOne({ _id: listing._id }, {
                                    $set: { bookingsIndex: bookingsIndex },
                                    $push: { bookings: insertedBooking._id }
                                })];
                        case 8:
                            // update bookings field of listing document being booked
                            _c.sent();
                            // return newly inserted booking
                            return [2 /*return*/, insertedBooking];
                        case 9:
                            err_1 = _c.sent();
                            throw new Error("Failed to create booking - " + err_1);
                        case 10: return [2 /*return*/];
                    }
                });
            });
        }
    },
    Booking: {
        id: function (booking) {
            return booking._id.toHexString();
        },
        // (a)
        listing: function (booking, _args, _a) {
            var db = _a.db;
            return db.listings.findOne({ _id: booking.listing });
        },
        tenant: function (booking, _args, _a) {
            var db = _a.db;
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