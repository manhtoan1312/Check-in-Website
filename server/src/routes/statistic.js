const express = require("express");
const statistic_router = express.Router();
const verifyToken = require("../middleware/auth");
const statisticController = require('../controller/StatisticController')

statistic_router.get("/:month", verifyToken, statisticController.get_personal_workday);
statistic_router.get("/all/:month/:page",verifyToken, statisticController.get_Monthly_Statistics)
statistic_router.get("/download/:month",verifyToken,statisticController.download_Monthly_Statistics)
statistic_router.get("/email/:email/:month",verifyToken,statisticController.getWorkdayByEmail)
statistic_router.get("/personal-download/:email/:month",verifyToken,statisticController.download_Personal_Statistics)
statistic_router.get("/e-period/:email/:start/:end",verifyToken,statisticController.getPersonalWorkdayByDateandEmail)
statistic_router.get("/period/:start/:end",verifyToken,statisticController.getPersonalWorkdayByDate)
statistic_router.get("/all-period/:start/:end/:page",verifyToken,statisticController.getWorkdayByDate)
statistic_router.get("/p-download/period/:start/:end",verifyToken,statisticController.download_Personal_Statistics_FormDate)
statistic_router.get("/p-download/e-period/:email/:start/:end",verifyToken,statisticController.MDownload_Personal_Statistics_FormDate)
statistic_router.get("/p-download/all-period/:start/:end",verifyToken,statisticController.download_Monthly_Statistics_formDate)

module.exports = statistic_router;
