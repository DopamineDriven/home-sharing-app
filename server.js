const express = require("express")
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3001;

app.use(
    cors(),
    express.json(),
    express.urlencoded({ extended: true })    
);

// invoke server
app.listen(PORT, error => {
    if (error) throw error
    console.log(`🌎now listening on PORT http://localhost:${PORT}`);
});