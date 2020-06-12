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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// require("dotenv").config();
var express_1 = __importDefault(require("express"));
var compression_1 = __importDefault(require("compression"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var graphql_1 = require("./graphql");
var apollo_server_express_1 = require("apollo-server-express");
var index_1 = require("./database/index");
// instantiate apollo server
var mount = function (app) { return __awaiter(void 0, void 0, void 0, function () {
    var db, server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, index_1.connectDatabase()];
            case 1:
                db = _a.sent();
                app.use(compression_1.default(), express_1.default.json({ limit: "2mb" }), express_1.default.static(__dirname + "/client"), cookie_parser_1.default(process.env.SECRET), cors_1.default(), helmet_1.default());
                app.get("/*", function (_req, res) {
                    res.sendFile(__dirname + "/client/index.html");
                });
                server = new apollo_server_express_1.ApolloServer({
                    typeDefs: graphql_1.typeDefs,
                    resolvers: graphql_1.resolvers,
                    context: function (_a) {
                        var req = _a.req, res = _a.res;
                        return ({ db: db, req: req, res: res });
                    }
                });
                server.applyMiddleware({ app: app, path: "/api" });
                // invoke server
                app.listen(process.env.PORT);
                console.log("[app]: http://localhost:" + process.env.PORT + "/api");
                return [2 /*return*/];
        }
    });
}); };
mount(express_1.default());
/*
Context argument is third positional arg
    Object shared by all resolvers
Apollo Server is called with every request
    db available as context in api


Can use curl to delete a listing
curl -X POST http://localhost:PORT/api \
    -H 'Content-Type: application/json' \
    -d '{"id":"001"}'

- X specifies which HTTP method to use followed by url
- H sets Header for http request
- d sets data to pass (body)
*/
//# sourceMappingURL=server.js.map