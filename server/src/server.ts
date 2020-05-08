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

// req param though unused must be called for res param to be called
// to indicate to tslint that it is okay, prepend an underscore
app.get("/listings", (_req, res) => {
    res.send(listings)
});

// delete-listings route
app.post('/delete-listing', (req, res) => {
    const id: string = req.body.id;
    for (let i=0; i < listings.length; i++) {
        if (listings[i].id === id) {
            return res.send(listings.splice(i, 1)[0])
        }
    }
    return res.send("failed to delete listing")
});

// invoke server
app.listen(PORT);

console.log(`[app]: http://localhost:${PORT}`);
console.log(`[listings]: http://localhost:${PORT}/listings`);
console.log(`[delete-listing]: http://localhost:${PORT}/delete-listing`);


/*
Can use curl to delete a listing 
    curl -X POST http://localhost:9000/delete-listing \
        -H 'Content-Type: application/json' \
        -d '{"id":"001"}'
*/