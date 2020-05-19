require("dotenv").config();
import express, { Application } from "express";
import cors from "cors";
import Helmet from "helmet";
import { typeDefs, resolvers } from "./graphql";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database/index";

// instantiate apollo server
const mount = async (app: Application) => {
	try {
		const db = await connectDatabase();
		const server = new ApolloServer({
			typeDefs,
			resolvers,
			context: () => ({ db }),
		});

		server.applyMiddleware({ app, path: "/api" });
		// invoke server
		app.listen(process.env.PORT);
		console.log(`[app]: http://localhost:${process.env.PORT}/api`);
	} catch (error) {
		throw new Error(`error in server ${error}`);
	}
};

mount(express().use(
	cors(), 
	Helmet())
);

/*
Context argument is third positional arg
    Object shared by all resolvers 
Apollo Server is called with every request
    db available as context in api


Can use curl to delete a listing 
curl -X POST http://localhost:3002/api \
    -H 'Content-Type: application/json' \
    -d '{"id":"001"}'

- X specifies which HTTP method to use followed by url
- H sets Header for http request
- d sets data to pass (body)
*/
