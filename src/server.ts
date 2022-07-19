import express from "express";
import App from "./services/ExpressApp";
import dbConnect from "./services/Database";
import { PORT } from "./config";

const StartConnect = async () => {
  const app = express();

  await dbConnect();

  await App(app);

  app.listen(PORT, () => {
    console.log(`Server running ${PORT}`);
  });
};

StartConnect();
