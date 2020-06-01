"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
exports.authorize = async (db, req) => {
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
//# sourceMappingURL=index.js.map