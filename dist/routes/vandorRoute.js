"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vandorController_1 = require("../controllers/vandorController");
const commonAuth_1 = require("../middleware/commonAuth");
const multer_1 = __importDefault(require("multer"));
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, new Date().toISOString() + '_' + file.originalname);
    }
});
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
const router = express_1.default.Router();
router.post("/login", vandorController_1.VandorLogin);
router.use(commonAuth_1.Authenticate);
router.get("/profile", vandorController_1.GetVandorProfile);
router.put("/profile", vandorController_1.UpdateVandorProfile);
router.put("/service", vandorController_1.UpdateVandorService);
router.put("/coverimage", images, vandorController_1.UpdateVandorCoverImage);
router.post('/post', vandorController_1.AddFood);
router.get('/get', vandorController_1.GetFoods);
module.exports = router; //Authenticate
//# sourceMappingURL=vandorRoute.js.map