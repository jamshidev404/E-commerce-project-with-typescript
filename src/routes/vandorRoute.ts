import express from "express";
import {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  VandorLogin,
  AddFood,
  GetFoods,
  UpdateVandorCoverImage,
  GetCurrentOrders,
  GetOrderDetails,
  ProcessOrder,
  GetOffers,
  AddOffer,
  EditOffer,
} from "../controllers/vandorController";

import { Authenticate } from "../middleware/commonAuth";
import multer from "multer";

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

const router = express.Router();

router.post("/login", VandorLogin);

router.use(Authenticate);
router.get("/profile", GetVandorProfile);
router.put("/profile", UpdateVandorProfile);
router.put("/service", UpdateVandorService);
router.put("/coverimage", images, UpdateVandorCoverImage);

router.post("/post", AddFood);
router.get("/get", GetFoods);

//Orders
router.get("/orders", GetCurrentOrders);
router.get("/order/:id", GetOrderDetails);
router.put("/order/:id/process", ProcessOrder);

// Offers
router.get("/offers", GetOffers);
router.post("/create", AddOffer);
router.put("/offers/:id", EditOffer);
// DeleteOffer

module.exports = router; //Authenticate
