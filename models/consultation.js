const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const consultationSchema = new Schema({
  staffId: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  permission: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Consultation', consultationSchema);