import express from "express";
import App from "./services/ExpressApp";
import dbConnect from "./services/Database";

const StartConnect = async () => {
  const app = express();

  await dbConnect();

  await App(app);

  app.listen(2300, () => {
    console.log("Server running");
  });
};

StartConnect();
