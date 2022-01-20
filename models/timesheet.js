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
      locations: [{ location: { type: String, required: false } }],
      startTimes: [{ startTime: { type: Date, required: false } }],
      endTime: { type: Date, required: false },
      timeTotal: { type: Number, required: false },
    },
  ],
  timeSheetDatas: [
    {
      date: { type: String, required: false },
      timeTotal: { type: Number, required: false },
      incompleteTime: { type: Number, required: false },
      overTime: { type: Number, required: false },
    },
  ],
  workStatus: { type: Boolean, required: true },
  takeLeaveInfo: [
    {
      date: { type: String, required: false },
      leaveTime: { type: String, required: false }
    },
  ],
});

timesheetSchema.methods.addStartTime = function (workInfoData) {
  this.locations.push({ location: workInfoData.location });
  this.startTimes.push({ startTime: workInfoData.startTime });
  this.workStatus = true;
  return this.save();
};

timesheetSchema.methods.addEndTime = function (workInfoData) {
  const locations = [...this.locations];
  const startTimes = [...this.startTimes];
  const endTime = workInfoData;
  const timeTotal =
    endTime.getHours() * 60 +
    endTime.getMinutes() -
    (startTimes[0].startTime.getHours() * 60 +
      startTimes[0].startTime.getMinutes());
  //Test case: const timeTotal = 600;
  // console.log(timeTotal);

  //update timeResult
  const addtimeResult = {
    locations: locations,
    startTimes: startTimes,
    endTime: endTime,
    timeTotal: timeTotal,
  };
  this.timeResults.push(addtimeResult);


  //update timeSheetData
  if (this.timeSheetDatas.length <= 0) {
    //get data form endTime's data
    const date = endTime.toISOString().substring(0, 10);
    const Total = timeTotal;
    const incompleteTime =  (Total < 480) ? (480 - Total) : 0; //neu lam chua du gio thi lay 8h - so gio lam, nguoc lai bang 0
    const overTime = Total > 480 ? Total - 480 : 0; //8h = 480m
    this.timeSheetDatas.push({
      date: date,
      timeTotal: Total,
      incompleteTime: incompleteTime,
      overTime: overTime,
    });
  } else if (this.timeSheetDatas.length > 0) {
    //update timeSheetData endTime.toISOString().substring(0, 10)
    const getCurentDateIndex = this.timeSheetDatas.findIndex((tsd) => {
      //Test case: return tsd.date == '2022-01-21';//////////////////////////////
      return tsd.date == endTime.toISOString().substring(0, 10);
    });
    console.log(getCurentDateIndex);
    //findIndex = -1 => not found
    if (getCurentDateIndex < 0) {
      //Check existing array data of this date
      const date = endTime.toISOString().substring(0, 10);
      //Test case: const date = '2022-01-21';
      const Total = timeTotal;
      const incompleteTime =  (Total < 480) ? (480 - Total) : 0; //neu lam chua du gio thi lay 8h - so gio lam, nguoc lai bang 0
      const overTime = Total > 480 ? Total - 480 : 0; //8h = 480m
      this.timeSheetDatas.push({
        date: date,
        timeTotal: Total,
        incompleteTime: incompleteTime,
        overTime: overTime,
      });
    } else {
      //if has existing data, update data by got index
      const timeSheetData = this.timeSheetDatas[getCurentDateIndex];
      timeSheetData.timeTotal = timeSheetData.timeTotal + timeTotal;
      timeSheetData.incompleteTime = (timeSheetData.timeTotal < 480) ? (480 - timeSheetData.timeTotal) : 0;
      timeSheetData.overTime = timeSheetData.timeTotal > 480 ? timeSheetData.timeTotal - 480 : 0;
      // date: { type: String, required: false },
      // timeTotal:  { type: Number, required: false },
      // overTime: { type: Number, required: false }
    }
  }

  this.locations = [];
  this.startTimes = [];
  this.workStatus = false;

  return this.save();
};

timesheetSchema.methods.addTakeLeave = function (leaveInfoData) {
  const _takeLeaveInfo = [...this.takeLeaveInfo];
  this.takeLeaveInfo = [..._takeLeaveInfo, ...leaveInfoData];
  // this.takeLeaveInfo.push(leaveInfoData);
  
  return this
          .save()
          .then(result => {
            leaveInfoData.forEach(item => {
              console.log(`Ngày ${item.date} và số giờ nghỉ phép là ${item.leaveTime}h đã đăng ký thành công.`);
            });
            console.log()
          });
};

module.exports = mongoose.model("TimeSheet", timesheetSchema);
