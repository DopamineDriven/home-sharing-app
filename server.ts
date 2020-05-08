import express from "express";
import cors from 'cors';
const app = express();
const PORT = process.env.PORT || 3001;

app.use(
    cors(),
    express.json(),
    express.urlencoded({ extended: true })    
);

// invoke server
app.listen(PORT)