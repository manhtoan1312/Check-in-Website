const express = require("express");
const location_router = express.Router();
const verifyToken = require("../middleware/auth");
const LocationController = require("../controller/LocationController");

location_router.get(
  "/",
  verifyToken, 
  LocationController.getAllLocation
);

location_router.post(
  "/",
  verifyToken,
  LocationController.addLocation
);
location_router.put(
  "/",
  verifyToken,
  LocationController.updateLocation
);

location_router.delete(
  "/:id",
  verifyToken,
  LocationController.deleteLocation
);

location_router.get('/search/:key',verifyToken, LocationController.searchLocation)
location_router.get('/by_id/:id',verifyToken, LocationController.getLocationByID)

module.exports = location_router;
