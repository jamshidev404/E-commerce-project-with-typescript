import express, { Request, Response, NextFunction, Router } from "express";
import { 
    DeliveryUserSignUp,
    DeliveryUserLogin,
    GetDeliveryUserProfile,
    EditDeliveryUserProfile,
    UpdateDeliveryUserStatus
} from "../controllers/DeliveryController";
import { Authenticate } from "../middleware/commonAuth";

const router = express.Router();

/*==================== SignUp / Create Customer =======================*/

router.post("/add", DeliveryUserSignUp);

/*==================== Login =======================*/

router.post("/login", DeliveryUserLogin);

// Authentication
router.use(Authenticate);

/*==================== Change Service Status =======================*/
router.put('/change-status',UpdateDeliveryUserStatus)

/*==================== Profile =======================*/

router.get("/profile", GetDeliveryUserProfile);
router.put("/profile", EditDeliveryUserProfile);

module.exports = router;