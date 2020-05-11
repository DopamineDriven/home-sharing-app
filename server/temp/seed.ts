require("dotenv").config();
import { connectDatabase } from "../src/database/index";

const seed = async () => {
    try {
        console.log(`[seed]: running...`);

        const db = await connectDatabase();
    } catch (error) {
        throw new Error("failed to seed database")
    }
};

seed();