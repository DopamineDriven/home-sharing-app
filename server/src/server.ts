require("dotenv").config();
import express, { Application } from "express";
import cors from "cors";
import { typeDefs, resolvers } from "./graphql/index";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database/index";
const app = express();

app.use(cors());

// instantiate apollo server
const mount = async (app: Application) => {
	const db = await connectDatabase();
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: () => ({ db })
	});

	server.applyMiddleware({ app, path: "/api" });
	// invoke server
	app.listen(process.env.PORT);
    console.log(`[app]: http://localhost:${process.env.PORT}/api`);
    const listings = await db.listings.find({}).toArray();
    console.log(listings);
};

mount(express());

/*
Can use curl to delete a listing 
curl -X POST http://localhost:3002/delete-listing \
    -H 'Content-Type: application/json' \
    -d '{"id":"001"}'

- X specifies which HTTP method to use followed by url
- H sets Header for http request
- d sets data to pass (body)
*/
