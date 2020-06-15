"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const Booking_1 = require("./Booking");
const Listing_1 = require("./Listing");
const User_1 = require("./User");
const Viewer_1 = require("./Viewer");
exports.resolvers = lodash_merge_1.default(Booking_1.bookingResolvers, Listing_1.listingResolvers, User_1.userResolvers, Viewer_1.viewerResolvers);
//# sourceMappingURL=index.js.map