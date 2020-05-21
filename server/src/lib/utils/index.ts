import { Request } from "express";
import { Database, User } from "../types";

export const authorize = async (
    db: Database, 
    req: Request
): Promise<User | null> => {
    const token = req.get("X-CSRF-TOKEN");
    const viewer = await db.users.findOne({
        _id: req.signedCookies.viewer,
        token
    });

    return viewer;
};


// using instance null instead of undefined
    // why?
        // the findOne() MongoDB func returns a doc obj or a null val in this way
// get X-CSRF-TOKEN from header passed in the request (calling the header key)