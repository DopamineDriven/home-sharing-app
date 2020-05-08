import express from "express";
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3001;

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

// invoke server
app.listen(PORT);

console.log(`[app]: http://localhost:${PORT}`);


/*
Can use curl to delete a listing 
    curl -X POST http://localhost:9000/delete-listing \
        -H 'Content-Type: application/json' \
        -d '{"id":"001"}'
*/