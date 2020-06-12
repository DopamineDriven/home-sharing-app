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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Google = void 0;
var googleapis_1 = require("googleapis");
var maps_1 = require("@google/maps");
var auth = new googleapis_1.google.auth.OAuth2(process.env.G_CLIENT_ID, process.env.G_CLIENT_SECRET, process.env.PUBLIC_URL + "/login");
var maps = maps_1.createClient({
    key: "" + process.env.G_GEOCODE_KEY,
    Promise: Promise // object shorthand notation, key === value
});
var parseAddress = function (addressComponents) {
    var country = null;
    var admin = null;
    var city = null;
    for (var _i = 0, addressComponents_1 = addressComponents; _i < addressComponents_1.length; _i++) {
        var component = addressComponents_1[_i];
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
    return { country: country, admin: admin, city: city };
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
    logIn: function (code) { return __awaiter(void 0, void 0, void 0, function () {
        var tokens, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, auth.getToken(code)];
                case 1:
                    tokens = (_a.sent()).tokens;
                    auth.setCredentials(tokens);
                    return [4 /*yield*/, googleapis_1.google.people({ version: "v1", auth: auth }).people.get({
                            resourceName: "people/me",
                            personFields: "emailAddresses,names,photos"
                        })];
                case 2:
                    data = (_a.sent()).data;
                    return [2 /*return*/, { user: data }];
            }
        });
    }); },
    geocode: function (address) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, maps.geocode({ address: address }).asPromise()];
                case 1:
                    res = _a.sent();
                    if (res.status < 200 || res.status > 299) {
                        throw new Error("failed to geocode address");
                    }
                    return [2 /*return*/, parseAddress(res.json.results[0].address_components)];
            }
        });
    }); }
};
//# sourceMappingURL=Google.js.map