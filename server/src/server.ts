import express from "express";
import cors from "cors";
import { listings } from './listings';
const app = express();
const PORT = process.env.PORT || 3002;

app.use(
    cors(),
    express.json(),
    express.urlencoded({ extended: true })    
);

const a = 1.5;
const b = 3.14;

// req param though unused must be called for res param to be called
// to indicate to tslint that it is okay, prepend an underscore
app.get("/", (_req, res) => res.send(`1.5*3.14=${a*b}`));

// listings route
app.get("/listings", (_req, res) => {
    res.send(listings)
});

// delete-listings route

// invoke server
app.listen(PORT);

console.log(`[app]: http://localhost:${PORT}`);
console.log(`[listings]: http://localhost:${PORT}/listings`);


/*
Can use curl to delete a listing 
    curl -X POST http://localhost:9000/delete-listing \
        -H 'Content-Type: application/json' \
        -d '{"id":"001"}'
*/