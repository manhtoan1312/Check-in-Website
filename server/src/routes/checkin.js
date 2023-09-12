const express = require("express");
const checkin_router = express.Router();
const verifyToken = require("../middleware/auth");
const CheckinController = require("../controller/CheckinController");

checkin_router.post("/", verifyToken, CheckinController.checkin);

module.exports = checkin_router;
