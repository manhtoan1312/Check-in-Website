  const mongoose = require("mongoose");

  const employeeSchema = new mongoose.Schema({
    name:{type: String, required: true},
    gender:{type: String, default: null},
    phone:{type: String, match: /[0-9]{10}$/},
    address:{type: String, default: null},
    enable: {type: Boolean, default: true},
    pine_times: {type: Number,default: 0, min:0, max:3}
  });

  module.exports = mongoose.model("users", employeeSchema)