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
exports.listingResolvers = void 0;
var mongodb_1 = require("mongodb");
var types_1 = require("../../../lib/types");
var types_2 = require("./types");
var utils_1 = require("../../../lib/utils");
var api_1 = require("../../../lib/api");
var verifyHostListingInput = function (_a) {
    var title = _a.title, description = _a.description, type = _a.type, price = _a.price;
    var Apartment = types_1.ListingType.Apartment, House = types_1.ListingType.House;
    if (title.length > 100) {
        throw new Error("listing title must be under 100 characters");
    }
    if (description.length > 5000) {
        throw new Error("listing description must be under 5000 characters");
    }
    if (type !== Apartment && type !== House) {
        throw new Error("listing type must be either an apartment or house");
    }
    if (price <= 0) {
        throw new Error("price must be greater than 0");
    }
};
// host field w/in listing doc obj -> id of user who owns the listing
exports.listingResolvers = {
    Query: {
        listing: function (_root, _a, _b) {
            var id = _a.id;
            var db = _b.db, req = _b.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var listing, viewer, error_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, db.listings.findOne({ _id: new mongodb_1.ObjectId(id) })];
                        case 1:
                            listing = _c.sent();
                            if (!listing) {
                                throw new Error("listing cannot be found");
                            }
                            return [4 /*yield*/, utils_1.authorize(db, req)];
                        case 2:
                            viewer = _c.sent();
                            if (viewer && viewer._id === listing.host) {
                                listing.authorized = true;
                            }
                            return [2 /*return*/, listing];
                        case 3:
                            error_1 = _c.sent();
                            throw new Error("failed to query listing: " + error_1);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        listings: function (_root, _a, _b) {
            var location = _a.location, filter = _a.filter, limit = _a.limit, page = _a.page;
            var db = _b.db;
            return __awaiter(void 0, void 0, void 0, function () {
                var query, data, _c, country, admin, city, cityText, adminText, cursor, _d, _e, error_2;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 6, , 7]);
                            query = {};
                            data = {
                                region: null,
                                total: 0,
                                result: []
                            };
                            if (!location) return [3 /*break*/, 2];
                            return [4 /*yield*/, api_1.Google.geocode(location)];
                        case 1:
                            _c = _f.sent(), country = _c.country, admin = _c.admin, city = _c.city;
                            if (city)
                                query.city = city;
                            if (admin)
                                query.admin = admin;
                            if (country) {
                                query.country = country;
                            }
                            else {
                                throw new Error("no country found");
                            }
                            cityText = city ? city + ", " : "";
                            adminText = admin ? admin + ", " : "";
                            data.region = "" + cityText + adminText + country;
                            _f.label = 2;
                        case 2: return [4 /*yield*/, db.listings.find(query)];
                        case 3:
                            cursor = _f.sent();
                            if (filter && filter === types_2.ListingsFilter.PRICE_LOW_TO_HIGH) {
                                cursor = cursor.sort({ price: 1 });
                            }
                            if (filter && filter === types_2.ListingsFilter.PRICE_HIGH_TO_LOW) {
                                cursor = cursor.sort({ price: -1 });
                            }
                            cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                            cursor = cursor.limit(limit);
                            _d = data;
                            return [4 /*yield*/, cursor.count()];
                        case 4:
                            _d.total = _f.sent();
                            _e = data;
                            return [4 /*yield*/, cursor.toArray()];
                        case 5:
                            _e.result = _f.sent();
                            return [2 /*return*/, data];
                        case 6:
                            error_2 = _f.sent();
                            throw new Error("failed to query listings: " + error_2);
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
    },
    Mutation: {
        hostListing: function (_root, _a, _b) {
            var input = _a.input;
            var db = _b.db, req = _b.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var viewer, _c, country, admin, city, imageURL, insertResult, insertedListing;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            verifyHostListingInput(input);
                            return [4 /*yield*/, utils_1.authorize(db, req)];
                        case 1:
                            viewer = _d.sent();
                            if (!viewer) {
                                throw new Error("viewer cannot be found");
                            }
                            return [4 /*yield*/, api_1.Google.geocode(input.address)];
                        case 2:
                            _c = _d.sent(), country = _c.country, admin = _c.admin, city = _c.city;
                            if (!country || !admin || !city) {
                                throw new Error("invalid address input");
                            }
                            return [4 /*yield*/, api_1.Cloudinary.upload(input.image)];
                        case 3:
                            imageURL = _d.sent();
                            return [4 /*yield*/, db.listings.insertOne(__assign(__assign({ _id: new mongodb_1.ObjectId() }, input), { image: imageURL, bookings: [], bookingsIndex: {}, country: country,
                                    admin: admin,
                                    city: city, host: viewer._id }))];
                        case 4:
                            insertResult = _d.sent();
                            insertedListing = insertResult.ops[0];
                            return [4 /*yield*/, db.users.updateOne({ _id: viewer._id }, { $push: { listings: insertedListing._id } })];
                        case 5:
                            _d.sent();
                            return [2 /*return*/, insertedListing];
                    }
                });
            });
        }
    },
    Listing: {
        id: function (listing) {
            return listing._id.toHexString();
        },
        host: function (listing, _args, _a) {
            var db = _a.db;
            return __awaiter(void 0, void 0, void 0, function () {
                var host;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, db.users.findOne({ _id: listing.host })];
                        case 1:
                            host = _b.sent();
                            if (!host) {
                                throw new Error("host cannot be found");
                            }
                            return [2 /*return*/, host];
                    }
                });
            });
        },
        bookingsIndex: function (listing) {
            return JSON.stringify(listing.bookingsIndex);
        },
        bookings: function (listing, _a, _b) {
            var limit = _a.limit, page = _a.page;
            var db = _b.db;
            return __awaiter(void 0, void 0, void 0, function () {
                var data, cursor, _c, _d, error_3;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 4, , 5]);
                            if (!listing.authorized) {
                                return [2 /*return*/, null];
                            }
                            data = {
                                total: 0,
                                result: []
                            };
                            return [4 /*yield*/, db.bookings.find({
                                    _id: { $in: listing.bookings }
                                })];
                        case 1:
                            cursor = _e.sent();
                            cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                            cursor = cursor.limit(limit);
                            _c = data;
                            return [4 /*yield*/, cursor.count()];
                        case 2:
                            _c.total = _e.sent();
                            _d = data;
                            return [4 /*yield*/, cursor.toArray()];
                        case 3:
                            _d.result = _e.sent();
                            return [2 /*return*/, data];
                        case 4:
                            error_3 = _e.sent();
                            throw new Error("failed to query listing bookings: " + error_3);
                        case 5: return [2 /*return*/];
                    }
                });
            });
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
//# sourceMappingURL=index.js.map