require("dotenv").config();
import express, { Application } from "express";
import compression from "compression";
import cors from "cors";
import Helmet from "helmet";
import cookieParser from "cookie-parser";
import { typeDefs, resolvers } from "./graphql";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database/index";

// instantiate apollo server
const mount = async (app: Application) => {
	const db = await connectDatabase();

	app.use(
		compression(),
		express.json({ limit: "2mb" }),
		express.static(`${__dirname}/client`),
		cookieParser(process.env.SECRET),
		cors(),
		Helmet()
	);

	app.get("/*", (_req, res) => {
		res.sendFile(`${__dirname}/client/index.html`)
	});

	// context func prop of Apollo is run with req res objects
	// pass req and res props as part of context obj for all resolvers
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, res }) => ({ db, req, res })
	});

	server.applyMiddleware({ app, path: "/api" });
	// invoke server
	app.listen(process.env.PORT);
	console.log(`[app]: http://localhost:${process.env.PORT}/api`);
};

mount(express());

/*
Context argument is third positional arg
    Object shared by all resolvers 
Apollo Server is called with every request
    db available as context in api


Can use curl to delete a listing 
curl -X POST http://localhost:PORT/api \
    -H 'Content-Type: application/json' \
    -d '{"id":"001"}'

- X specifies which HTTP method to use followed by url
- H sets Header for http request
- d sets data to pass (body)
*/
