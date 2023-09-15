const express = require("express");
const location_router = express.Router();
const verifyToken = require("../middleware/auth");
const LocationController = require("../controller/LocationController");

location_router.get(
  "/get-location",
  verifyToken,
  LocationController.getAllLocation
);
location_router.get(
    "/get-old-location",
    verifyToken,
    LocationController.getOldLocation
  );
location_router.post(
  "/add-location",
  verifyToken,
  LocationController.addLocation
);
location_router.post(
  "/update-location",
  verifyToken,
  LocationController.updateLocation
);
location_router.delete(
  "/delete-location/:id",
  verifyToken,
  LocationController.deleteLocation
);
location_router.get(
  "/restore-location/:id",
  verifyToken,
  LocationController.restoreLocation
);

location_router.get('/search/:key',verifyToken, LocationController.searchLocation)

module.exports = location_router;
