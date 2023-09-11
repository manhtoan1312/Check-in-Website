const express = require("express");
const statistic_router = express.Router();
const verifyToken = require("../middleware/auth");
const statisticController = require('../controller/StatisticController')

statistic_router.get("/:month", verifyToken, statisticController.get_personal_workday);
statistic_router.get("/get-monthly-statistics/:month",verifyToken, statisticController.get_Monthly_Statistics)
module.exports = statistic_router;
