import { MongoClient } from "mongodb";
import { Database } from "../lib/types";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
	const client = await MongoClient.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	const db = client.db("main");
	// return map of collections in database
	return {
		listings: db.collection("listings")
	};
};


// ts natively provides promise interface which accepts a type variable
// connectDatabase async returns a promise that when resolved will be an obj of type Database
// listing field in obj to be returned will now be inferred as a Collection<Listing>