const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  Coordinate: {
    Latitude: { type: Number, require: true },
    Longitude: { type: Number, require: true },
  },
  branch: { type: String, default: null},
  enable:{type:Boolean, default: true}
});

module.exports = mongoose.model("locations", locationSchema);
