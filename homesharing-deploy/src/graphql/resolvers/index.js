"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
var lodash_merge_1 = __importDefault(require("lodash.merge"));
var Booking_1 = require("./Booking");
var Listing_1 = require("./Listing");
var User_1 = require("./User");
var Viewer_1 = require("./Viewer");
exports.resolvers = lodash_merge_1.default(Booking_1.bookingResolvers, Listing_1.listingResolvers, User_1.userResolvers, Viewer_1.viewerResolvers);
//# sourceMappingURL=index.js.map