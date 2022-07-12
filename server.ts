import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { MONGO_URI } from "./config";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/admin", require('./routes/adminRoute'));
app.use("/api/vandor", require("./routes/vandorRoute"));

mongoose.connect(MONGO_URI, {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
}).then(() => {
    console.log("DB connected")
}).catch((err) => {
    console.log(err)
})

const port = 2300;
app.listen(port, () => {
  console.log("Server running");
});
