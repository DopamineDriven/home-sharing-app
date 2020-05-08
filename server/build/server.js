"use strict";
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
const PORT = process.env.PORT || 3001;
app.use(
	cors_1.default(),
	express_1.default.json(),
	express_1.default.urlencoded({ extended: true })
);
const a = 1.5;
const b = 3.14;
app.get("/", (req, res) => res.send(`1.5*3.14=${a * b}`));
// invoke server
app.listen(PORT);
console.log(`[app]: http://localhost:${PORT}`);
