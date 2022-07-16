import express, { Application } from "express";
import bodyParser from "body-parser";
import path from "path";

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/images", express.static(path.join(__dirname, "images")));

  app.use("/api/admin", require("../routes/adminRoute"));
  app.use("/api/vandor", require("../routes/vandorRoute"));
  app.use("/api/shopping", require("../routes/ShoppingRoute"));

  
  return app;
};
