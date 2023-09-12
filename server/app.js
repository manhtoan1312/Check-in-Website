const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const { API_PORT } = process.env;
require("./src/config/database").connect();
const accountRoute = require("./src/routes/account");
const checkinRoute = require("./src/routes/checkin");
const statisticRoute = require("./src/routes/statistic");
const locationRoute = require("./src/routes/location");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", accountRoute);
app.use("/checkin", checkinRoute);
app.use("/get-workday", statisticRoute);
app.use("/location", locationRoute);
app.listen(API_PORT, function () {
  console.log("Server running on port " + API_PORT);
});
