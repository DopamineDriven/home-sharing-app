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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Google = void 0;
const googleapis_1 = require("googleapis");
const maps_1 = require("@google/maps");
const auth = new googleapis_1.google.auth.OAuth2(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET, `${process.env.PUBLIC_URL}/login`);
const maps = maps_1.createClient({
    key: `${process.env.G_GEOCODE_KEY}`,
    Promise // object shorthand notation, key === value
});
const parseAddress = (addressComponents) => {
    let country = null;
    let admin = null;
    let city = null;
    for (const component of addressComponents) {
        if (component.types.includes("country")) {
            country = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
            admin = component.long_name;
        }
        if (component.types.includes("locality" || component.types.includes("postal_town"))) {
            city = component.long_name;
        }
    }
    return { country, admin, city };
};
exports.Google = {
    authUrl: auth.generateAuthUrl({
        // eslint-disable-next-line @typescript-eslint/camelcase
        access_type: "online",
        scope: [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"
        ]
    }),
    logIn: (code) => __awaiter(void 0, void 0, void 0, function* () {
        const { tokens } = yield auth.getToken(code);
        auth.setCredentials(tokens);
        const { data } = yield googleapis_1.google.people({ version: "v1", auth }).people.get({
            resourceName: "people/me",
            personFields: "emailAddresses,names,photos"
        });
        return { user: data };
    }),
    geocode: (address) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield maps.geocode({ address }).asPromise();
        if (res.status < 200 || res.status > 299) {
            throw new Error("failed to geocode address");
        }
        return parseAddress(res.json.results[0].address_components);
    })
};
//# sourceMappingURL=Google.js.map