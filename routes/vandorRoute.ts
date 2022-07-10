import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.get("/get", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello" });
});

module.exports = router;
