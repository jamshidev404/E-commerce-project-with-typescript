import express, { Request, Response, NextFunction } from "express";
import { createVandor,
         getVandors, 
         getVandorById } 
         from '../controllers/admin.Controller';

const router = express.Router();

router.post('/add', createVandor )
router.get("/all", getVandors);
router.get("/vandor/:id", getVandorById);

module.exports = router;
