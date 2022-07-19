"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CustomerContr_1 = require("../controllers/CustomerContr");
const router = express_1.default.Router();
/*==================== SignUp / Create Customer =======================*/
router.post("/add", CustomerContr_1.CustomerSignUp);
/*==================== Login =======================*/
router.post("/login", CustomerContr_1.CustomerLogin);
// Authentication
/*==================== Verify Customer Account =======================*/
router.put("/verify", CustomerContr_1.CustomerVerify);
/*==================== OTP / Requesting OTP =======================*/
router.get("/otp", CustomerContr_1.RequestOtp);
/*==================== Profile =======================*/
router.get("/profile", CustomerContr_1.GetCustomerProfile);
router.put("/profile", CustomerContr_1.EditCustomerProfile);
// Cart
// Order
// Payment
module.exports = router;
//# sourceMappingURL=CustomerRoute.js.map