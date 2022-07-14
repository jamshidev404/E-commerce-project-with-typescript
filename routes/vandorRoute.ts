import express from "express";
import {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
  VandorLogin,
  AddFood,
  GetFoods,
  UpdateVandorCoverImage
} from "../controllers/vandorController";
import { Authenticate } from "../middleware/commonAuth";
import multer from "multer";

const imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, new Date().toISOString() + '_' + file.originalname)
  }
})

const images = multer({ storage: imageStorage }).array('images', 10)



const router = express.Router();

router.post("/login", VandorLogin);

router.use(Authenticate);
router.get("/profile", GetVandorProfile);
router.put("/profile", UpdateVandorProfile);
router.put("/service", UpdateVandorService);
router.put("/coverimage", images, UpdateVandorCoverImage);

router.post('/post', AddFood);
router.get('/get', GetFoods)

module.exports = router;//Authenticate
