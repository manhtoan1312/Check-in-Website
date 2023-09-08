const mongoose = require("mongoose");
const workdaySchema = new mongoose.Schema({
    day: {type: Date},
    checkin: [{type: mongoose.Schema.ObjectId, ref:'checkin'}]
});

module.exports = mongoose.model("work_day", workdaySchema)