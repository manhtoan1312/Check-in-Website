const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'accounts' },
    late: { type: Boolean, default: false },
    fee: {
      type: Number,
      default: 0
    },
    time: {
      type: String,
      default: function () {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      }
    }
  });

module.exports = mongoose.model('checkin', checkinSchema)