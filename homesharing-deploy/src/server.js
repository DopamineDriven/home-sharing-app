"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const graphql_1 = require("./graphql");
const apollo_server_express_1 = require("apollo-server-express");
const index_1 = require("./database/index");
// instantiate apollo server
const mount = async (app) => {
    const db = await index_1.connectDatabase();
    app.use(compression_1.default(), express_1.default.json({ limit: "2mb" }), express_1.default.static(`${__dirname}/client`), cookie_parser_1.default(process.env.SECRET), cors_1.default(), helmet_1.default());
    app.get("/*", (_req, res) => {
        res.sendFile(`${__dirname}/client/index.html`);
    });
    // context func prop of Apollo is run with req res objects
    // pass req and res props as part of context obj for all resolvers
    const server = new apollo_server_express_1.ApolloServer({
        typeDefs: graphql_1.typeDefs,
        resolvers: graphql_1.resolvers,
        context: ({ req, res }) => ({ db, req, res })
    });
    server.applyMiddleware({ app, path: "/api" });
    // invoke server
    app.listen(process.env.PORT);
    console.log(`[app]: http://localhost:${process.env.PORT}/api`);
};
mount(express_1.default());
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
//# sourceMappingURL=server.js.map