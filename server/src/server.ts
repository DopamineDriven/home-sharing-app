import express from "express";
import cors from "cors";
import { typeDefs, resolvers } from "./graphql/index";
import { ApolloServer } from "apollo-server-express";
const app = express();
const server = new ApolloServer({ typeDefs, resolvers });
const PORT = process.env.PORT || 3002;

server.applyMiddleware({ app, path: "/api" })

app.use(
    cors()
);

// invoke server
app.listen(PORT);

console.log(`[app]: http://localhost:${PORT}/api`);


/*
Can use curl to delete a listing 
curl -X POST http://localhost:3002/delete-listing \
    -H 'Content-Type: application/json' \
    -d '{"id":"001"}'

- X specifies which HTTP method to use followed by url
- H sets Header for http request
- d sets data to pass (body)
*/