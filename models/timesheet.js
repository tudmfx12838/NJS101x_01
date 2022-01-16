const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timesheetSchema = new Schema({
  staffId: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  locations: [
    {
      location: { type: String, required: false },
    },
  ],
  startTimes: [
    {
      startTime: { type: Date, required: false },
    },
  ],
  startCount: { type: Number, required: false },
  //endTime:  { type: Date, required: false },
  timeResults: [
    {
      locations: [{location: { type: String, required: false }}],
      startTimes: [{ startTime: { type: Date, required: false }}],
      endTime:  { type: Date, required: false },
      timeTotal: { type: Number, required: false },
    },
  ],
  workStatus: { type: Boolean, required: true },
});

timesheetSchema.methods.addStartTime = function (workInfoData) {
  this.locations.push({location: workInfoData.location});
  this.startTimes.push({startTime: workInfoData.startTime});
  this.workStatus = true;
  return this.save();
};

timesheetSchema.methods.addEndTime = function (workInfoData) {
  const locations = [...this.locations];
  const startTimes = [...this.startTimes];
  const endTime = workInfoData;
  const timeTotal = 10;

  const addtimeResult = {locations: locations, startTimes: startTimes, endTime: endTime, timeTotal: timeTotal}
  this.timeResults.push(addtimeResult);

  this.locations = [];
  this.startTimes = [];
  this.workStatus = false;

  return this.save();
};



module.exports = mongoose.model("TimeSheet", timesheetSchema);
