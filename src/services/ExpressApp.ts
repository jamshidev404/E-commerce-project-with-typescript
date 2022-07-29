import express, { Application } from "express";
import path from "path";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/images", express.static(path.join(__dirname, "images")));

  app.use("/api/admin", require("../routes/adminRoute"));
  app.use("/api/vandor", require("../routes/vandorRoute"));
  app.use("/api/shopping", require("../routes/ShoppingRoute"));
  app.use("/api/customer", require("../routes/CustomerRoute"));

  return app;
};
