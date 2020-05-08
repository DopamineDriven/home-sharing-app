import express from "express";
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3001;

app.use(
    cors(),
    express.json(),
    express.urlencoded({ extended: true })    
);

const a: number = 1.5;
const b: number = 3.14;

app.get("/", (req, res) => res.send(`1.5*3.14=${a*b}`));

// invoke server
app.listen(PORT)

console.log(`[app]: http://localhost:${PORT}`);