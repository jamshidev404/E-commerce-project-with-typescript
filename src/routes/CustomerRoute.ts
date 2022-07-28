import express, { Request, Response, NextFunction, Router } from "express";
import {
  CustomerSignUp,
  CustomerLogin,
  CustomerVerify,
  RequestOtp,
  GetCustomerProfile,
  EditCustomerProfile,
  addToCart,
  getCart,
  deleteCart,
} from "../controllers/CustomerContr";
import { GetOrders, CreateOrder, GetOrder } from "../controllers/CustomerContr";

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

router.post("cart", addToCart),
  router.get("/cart", getCart),
  router.delete("/cart", deleteCart);

// Order

router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrder);

// Payment

module.exports = router;
