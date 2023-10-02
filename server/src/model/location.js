const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  Coordinate: {
    Latitude: { type: Number, require: true },
    Longitude: { type: Number, require: true }, 
  },
  branch: { type: String, require: true, unique: true},
  address: {type: String, require: true}
});

module.exports = mongoose.model("locations", locationSchema);
