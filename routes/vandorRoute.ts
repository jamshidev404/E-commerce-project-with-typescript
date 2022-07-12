import express, { Request, Response, NextFunction } from "express";
import { VandorLogin } from '../controllers/vandorController'

const router = express.Router();

router.post('/login', VandorLogin);
router.get("/profile", );
router.put('/profile', )
router.put('/service'  )

module.exports = router;
