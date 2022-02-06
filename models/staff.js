const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/*
# Schema name: staffSchema
# Define: info
# - idNumber: staff id number
# - password: password to login
# - permission: user or admin
# - name: staff name
# - doB: date of bith
# - salaryScale: salary scale
# - startDate: fisrt working time 
# - department: department
# - annualLeave: annual leave
# - image: image url link
*/
const staffSchema = new Schema({
  idNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  permission: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  doB: {
    type: Date,
    required: true
  },
  salaryScale: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  annualLeave: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    require: true
  },
});


module.exports = mongoose.model('Staff', staffSchema);
