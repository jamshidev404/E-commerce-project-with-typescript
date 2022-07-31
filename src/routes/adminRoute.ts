import express, { Request, Response, NextFunction } from "express";
import { createVandor,
         getVandors, 
         getVandorById, 
         GetTransactionId,
         GetTransactions,
         VerifyDeliveryUser,
         GetDeliveryUsers
        } 
         from '../controllers/admin.Controller';

const router = express.Router();

router.post('/add', createVandor )
router.get("/all", getVandors);
router.get("/vandor/:id", getVandorById);

//Transactions
router.get('/transactions', GetTransactions);
router.get('/transaction/:id', GetTransactionId);

router.put('/delivery/verify', VerifyDeliveryUser)
router.get('/delivery/getusers', GetDeliveryUsers)


module.exports = router;
