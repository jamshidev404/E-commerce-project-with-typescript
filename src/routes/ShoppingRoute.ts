import express, { Request, Response, NextFunction } from "express";
import {
  GetAvailableOffers,
  GetFoodAvialability,
  GetFoodIn30Min,
  GetTopRestaurants,
  RestaurantById,
  SearchFoods,
} from "../controllers/ShoppingController";

const router = express.Router();

/*  ================== Food Availability   ==================== */

router.get("/:pincode", GetFoodAvialability);

/*  ================== Top Restaurant   ==================== */

router.get("/top-restaurant/:pincode", GetTopRestaurants);

/*  ================== Food Availabilable in 30 minuts   ==================== */

router.get("/foodsin30mins/:pincode", GetFoodIn30Min);

/*  ================== Search Foods   ==================== */

router.get("/search/:pincode", SearchFoods);

/*  ================== Find Offers   ==================== */
router.get('/offers/:pincode', GetAvailableOffers)

/*  ================== Find Restaurant ByID   ==================== */

router.get("/restaurant/:id", RestaurantById);

module.exports = router;
