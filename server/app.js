const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan")
dotenv.config();

const { API_PORT } = process.env;
require("./src/config/database").connect();
const accountRoute = require("./src/routes/account");
const checkinRoute = require("./src/routes/checkin");
const statisticRoute = require("./src/routes/statistic");
const locationRoute = require("./src/routes/location");
app.use(morgan("combined"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use("/auth", accountRoute);
app.use("/checkin", checkinRoute);
app.use("/get-workday", statisticRoute);
app.use("/location", locationRoute);
  
app.listen('9000','0.0.0.0',()=>{
  console.log("server is listening on 9000 port");
})
