import express, { Request, Response, NextFunction } from "express";
import { createVandor,
         getVandors, 
         getVandorById } 
         from '../controllers/admin.Controller';

const router = express.Router();

router.post('/vandor', createVandor )
router.get("/vandors", getVandors);
router.get("/vandor/:id", getVandorById);

module.exports = router;
