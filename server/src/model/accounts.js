const mongoose = require("mongoose");

const accountSchema= new mongoose.Schema({
    email: {type: String, unique: true, readonly: true},
    password: {type: String},
    create_at: {type: Date, default: new Date()},
    role: {type: String, default: 'STAFF'},
    one_time_password:{type: String, default: null},
    otp_requested_time:{type: String, default: null},
    user: {type: mongoose.Schema.ObjectId, ref: 'user'}
  })

accountSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model('accounts', accountSchema)