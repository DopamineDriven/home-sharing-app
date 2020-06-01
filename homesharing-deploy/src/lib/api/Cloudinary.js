"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cloudinary = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.Cloudinary = {
    upload: async (image) => {
        /* eslint-disable @typescript-eslint/camelcase */
        const res = await cloudinary_1.default.v2.uploader.upload(image, {
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            cloud_name: process.env.CLOUDINARY_NAME,
            folder: "ASR_Assets/"
        });
        return res.secure_url;
        /* eslint-enable @typescript-eslint/camelcase */
    }
};
// https://cloudinary.com/documentation/image_upload_api_reference#upload_method
//# sourceMappingURL=Cloudinary.js.map