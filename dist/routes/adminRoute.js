"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_Controller_1 = require("../controllers/admin.Controller");
const router = express_1.default.Router();
router.post('/add', admin_Controller_1.createVandor);
router.get("/all", admin_Controller_1.getVandors);
router.get("/vandor/:id", admin_Controller_1.getVandorById);
module.exports = router;
//# sourceMappingURL=adminRoute.js.map