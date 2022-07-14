import express from "express";
import {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  VandorLogin,
} from "../controllers/vandorController";
import { Authenticate } from "../middleware/commonAuth";

const router = express.Router();

router.post("/login", Authenticate, VandorLogin);
router.get("/profile", GetVandorProfile);
router.put("/profile", UpdateVandorProfile);
router.put("/service", UpdateVandorService);

router.post('/post', );
router.get('/get', )

module.exports = router;//Authenticate
