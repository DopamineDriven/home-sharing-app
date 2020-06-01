"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongodb_1 = require("mongodb");
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`;
exports.connectDatabase = async () => {
    const client = await mongodb_1.MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = client.db("main");
    // return map of collections in database
    return {
        bookings: db.collection("bookings"),
        listings: db.collection("listings"),
        viewer: db.collection("viewer"),
        users: db.collection("users")
    };
};
// ts natively provides promise interface which accepts a type variable
// connectDatabase async returns a promise that when resolved will be an obj of type Database
// listing field in obj to be returned will now be inferred as a Collection<Listing>
//# sourceMappingURL=index.js.map