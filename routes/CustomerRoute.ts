import express, { Request, Response, NextFunction, Router } from "express";
import {
  CustomerSignUp,
  CustomerLogin,
  CustomerVerify,
  RequestOtp,
  GetCustomerProfile,
  EditCustomerProfile,
} from "../controllers/CustomerContr";

const router = express.Router();

/*==================== SignUp / Create Customer =======================*/

router.post("/add", CustomerSignUp);

/*==================== Login =======================*/

router.post("/login", CustomerLogin);

// Authentication

/*==================== Verify Customer Account =======================*/

router.put("/verify", CustomerVerify);

/*==================== OTP / Requesting OTP =======================*/

router.get("/otp", RequestOtp);

/*==================== Profile =======================*/

router.get("/profile", GetCustomerProfile);
router.put("/profile", EditCustomerProfile);

// Cart
// Order
// Payment

module.exports = router;
