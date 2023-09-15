const express = require("express");
const statistic_router = express.Router();
const verifyToken = require("../middleware/auth");
const statisticController = require('../controller/StatisticController')

statistic_router.get("/:month", verifyToken, statisticController.get_personal_workday);
statistic_router.get("/get-monthly-statistics/:month",verifyToken, statisticController.get_Monthly_Statistics)
statistic_router.get("/download/:month",verifyToken,statisticController.download_Monthly_Statistics)
statistic_router.get("/get-workday-by-email/:email/:month",verifyToken,statisticController.getWorkdayByEmail)
statistic_router.get("/download/personal/:email/:month",verifyToken,statisticController.download_Personal_Statistics)
//statistic_router.get("/get-formday/email/:start/:end",verifyToken,statisticController.getPersonalWorkdayByDateandEmail)
//statistic_router.get("/get-formday/:start/:end",verifyToken,statisticController.getPersonalWorkdayByDate)
//statistic_router.get("/get-formday/all/:start/:end",verifyToken,statisticController.getWorkdayByDate)
//statistic_router.get("/download/formdate/:email/:start/:end",verifyToken,statisticController.download_Personal_Statistics_FormDate)
//statistic_router.get("/download/formdate/all/:email/:start/:end",verifyToken,statisticController.download_Monthly_Statistics_formDate)

module.exports = statistic_router;
