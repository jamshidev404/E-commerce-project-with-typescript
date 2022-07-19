"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ShoppingController_1 = require("../controllers/ShoppingController");
const router = express_1.default.Router();
/*  ================== Food Availability   ==================== */
router.get("/:pincode", ShoppingController_1.GetFoodAvialability);
/*  ================== Top Restaurant   ==================== */
router.get("/top-restaurant/:pincode", ShoppingController_1.GetTopRestaurants);
/*  ================== Food Availabilable in 30 minuts   ==================== */
router.get("/foodsin30mins/:pincode", ShoppingController_1.GetFoodIn30Min);
/*  ================== Search Foods   ==================== */
router.get("/search/:pincode", ShoppingController_1.SearchFoods);
/*  ================== Find Restaurant ByID   ==================== */
router.get("/restaurant/:id", ShoppingController_1.RestaurantById);
module.exports = router;
//# sourceMappingURL=ShoppingRoute.js.map