const express = require("express");
const location_router = express.Router();
const verifyToken = require("../middleware/auth");
const LocationController = require("../controller/LocationController");

location_router.get(
  "/all",
  verifyToken,
  LocationController.getAllLocation
);

location_router.post(
  "/add",
  verifyToken,
  LocationController.addLocation
);
location_router.put(
  "/update",
  verifyToken,
  LocationController.updateLocation
);

location_router.delete(
  "/:id",
  verifyToken,
  LocationController.deleteLocation
);

location_router.get('/search/:key',verifyToken, LocationController.searchLocation)

module.exports = location_router;
