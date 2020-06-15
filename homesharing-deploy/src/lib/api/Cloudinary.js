"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cloudinary = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
exports.Cloudinary = {
    upload: (image) => __awaiter(void 0, void 0, void 0, function* () {
        /* eslint-disable @typescript-eslint/camelcase */
        const res = yield cloudinary_1.default.v2.uploader.upload(image, {
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            cloud_name: process.env.CLOUDINARY_NAME,
            folder: "ASR_Assets/"
        });
        return res.secure_url;
        /* eslint-enable @typescript-eslint/camelcase */
    })
};
// https://cloudinary.com/documentation/image_upload_api_reference#upload_method
//# sourceMappingURL=Cloudinary.js.map