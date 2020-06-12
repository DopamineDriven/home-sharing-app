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
exports.userResolvers = void 0;
var utils_1 = require("../../../lib/utils");
// when userResolvers func complete -> resolves to a Promise of a User
exports.userResolvers = {
    Query: {
        user: function (_root, _a, _b) {
            var id = _a.id;
            var db = _b.db, req = _b.req;
            return __awaiter(void 0, void 0, void 0, function () {
                var user, viewer, error_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, db.users.findOne({ _id: id })];
                        case 1:
                            user = _c.sent();
                            if (!user) {
                                throw new Error("user not found");
                            }
                            return [4 /*yield*/, utils_1.authorize(db, req)];
                        case 2:
                            viewer = _c.sent();
                            // check authorized = true before resolving data requested
                            if (viewer && viewer._id === user._id) {
                                user.authorized = true;
                            }
                            return [2 /*return*/, user];
                        case 3:
                            error_1 = _c.sent();
                            throw new Error("failed to query user - " + error_1);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    },
    User: {
        id: function (user) {
            return user._id;
        },
        // returns bool indicating if user has connected to Stripe for payments
        hasWallet: function (user) {
            return Boolean(user.walletId);
        },
        // protected resolver func; return user.income if true, else null
        income: function (user) {
            return user.authorized ? user.income : null;
        },
        bookings: function (user, _a, _b) {
            var limit = _a.limit, page = _a.page;
            var db = _b.db;
            return __awaiter(void 0, void 0, void 0, function () {
                var data, cursor, _c, _d, error_2;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 4, , 5]);
                            if (!user.authorized) {
                                return [2 /*return*/, null];
                            }
                            data = {
                                total: 0,
                                result: []
                            };
                            return [4 /*yield*/, db.bookings.find({
                                    _id: { $in: user.bookings }
                                })];
                        case 1:
                            cursor = _e.sent();
                            // P = page=1; L = limit=10; cursor starts at doc [0]
                            //     (P-1)L = (1-1)10 = [0]
                            // P = page=2; L = limit=10; cursor starts at doc [10]
                            //     (P-1)L = (2-1)10 = [10]
                            // P = page=3; L = limit=10; cursor starts at doc [20]
                            //     (P-1)L = (3-1)10 = [20]
                            cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                            cursor = cursor.limit(limit);
                            // cursor.count() -> Mongo gets total count of 
                            // initial query while ignoring limit modifier
                            _c = data;
                            return [4 /*yield*/, cursor.count()];
                        case 2:
                            // cursor.count() -> Mongo gets total count of 
                            // initial query while ignoring limit modifier
                            _c.total = _e.sent();
                            _d = data;
                            return [4 /*yield*/, cursor.toArray()];
                        case 3:
                            _d.result = _e.sent();
                            return [2 /*return*/, data];
                        case 4:
                            error_2 = _e.sent();
                            throw new Error("failed to query user bookings - " + error_2);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        listings: function (user, _a, _b) {
            var limit = _a.limit, page = _a.page;
            var db = _b.db;
            return __awaiter(void 0, void 0, void 0, function () {
                var data, cursor, _c, _d, error_3;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 4, , 5]);
                            data = {
                                total: 0,
                                result: []
                            };
                            return [4 /*yield*/, db.listings.find({
                                    _id: { $in: user.listings }
                                })];
                        case 1:
                            cursor = _e.sent();
                            cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
                            cursor = cursor.limit(limit);
                            _c = data;
                            return [4 /*yield*/, cursor.count()];
                        case 2:
                            _c.total = _e.sent();
                            _d = data;
                            return [4 /*yield*/, cursor.toArray()];
                        case 3:
                            _d.result = _e.sent();
                            return [2 /*return*/, data];
                        case 4:
                            error_3 = _e.sent();
                            throw new Error("failed to query user listings - " + error_3);
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    }
};
//# sourceMappingURL=index.js.map