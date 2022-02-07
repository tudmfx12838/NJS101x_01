const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/*
# Schema name: timesheetSchema
# Define: info
# - staffId: ref form staff id to make relaiton
# - locations: store working place after checkin and fill empty after checkout
# - startTimes: store start working time after checkin and fill empty after checkout
# - timeResults: store working place and start working time after checkout
# - timeSheetDatas: store working time data in a day.
# - workStatus: will be set true after checkin and set false after checkout
# - takeLeaveInfo: store take leave information
# - monthSalary: store month salary information
*/
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
  // startCount: { type: Number, required: false },
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
  monthSalary:
    {
      month: { type: String, required: false },
      salary: { type: Number, required: false }
    }
});

/*
# Method name: addStartTime
# Implementation: store new start working time Info to database
*/
timesheetSchema.methods.addStartTime = function (workInfoData) {
  this.locations.push({ location: workInfoData.location });
  this.startTimes.push({ startTime: workInfoData.startTime });
  this.workStatus = true;
  return this.save();
};

/*
# Method name: addEndTime
# Implementation: 
# 1. store new end working time Info to database
#   -store all registed checking location and start time
#   -Caculate total of time between checkin and checkout for once time and convert to minute
# 2. store result working time on a day to database
#   -Caculate total of time a day
#   -Caculate in complete time a day
#   -Caculate over time a day
# 3. Delete registed checking location and start time and set working status as not working
# 4. Update database
*/
timesheetSchema.methods.addEndTime = function (workInfoData) {
  const WORKINGTIMEONDAY = 480 //8hour = 480 minute
  const locations = [...this.locations];
  const startTimes = [...this.startTimes];
  const endTime = workInfoData;

  const year = endTime.getFullYear();
  const month = (endTime.getMonth()+1) < 10 ? ('0' + (endTime.getMonth()+1)) : (endTime.getMonth()+1);
  const date = endTime.getDate() < 10 ? ('0' + endTime.getDate()) : endTime.getDate();
  const today = `${year}-${month}-${date}`;

  //Implement udapte timeResults
  const timeTotal =
    endTime.getHours() * 60 +
    endTime.getMinutes() -
    (startTimes[0].startTime.getHours() * 60 +
      startTimes[0].startTime.getMinutes());
  //Test case: const timeTotal = 600;
  // console.log(timeTotal);

  const addtimeResult = {
    locations: locations,
    startTimes: startTimes,
    endTime: endTime,
    timeTotal: timeTotal,
  };
  this.timeResults.push(addtimeResult);

  //Implement udapte timeSheetDatas
  //Check timeSheetDatas are exsisting or not, if not create new
  if (this.timeSheetDatas.length <= 0) {
    //get data form endTime's data
    // const date = endTime.toISOString().substring(0, 10);
    const date = today;
    const Total = timeTotal;
    const incompleteTime =  (Total < WORKINGTIMEONDAY) ? (WORKINGTIMEONDAY - Total) : 0; //neu lam chua du gio thi lay 8h - so gio lam, nguoc lai bang 0
    const overTime = Total > WORKINGTIMEONDAY ? Total - WORKINGTIMEONDAY : 0;
    this.timeSheetDatas.push({
      date: date,
      timeTotal: Total,
      incompleteTime: incompleteTime,
      overTime: overTime,
    });
  } else if (this.timeSheetDatas.length > 0) {
    //update timeSheetData endTime.toISOString().substring(0, 10)
    const getCurentDateIndex = this.timeSheetDatas.findIndex((tsd) => {
      //Test case: return tsd.date == '2022-01-21';
      // return tsd.date == endTime.toISOString().substring(0, 10);
      return tsd.date == today;
    });
    // console.log(getCurentDateIndex);

    //findIndex = -1 is not found, create new time sheet data
    if (getCurentDateIndex < 0) {
      //Check existing array data of this date
      // const date = endTime.toISOString().substring(0, 10);
      const date = today;
      //Test case: const date = '2022-01-21';
      const Total = timeTotal;
      const incompleteTime =  (Total < WORKINGTIMEONDAY) ? (WORKINGTIMEONDAY - Total) : 0; //neu lam chua du gio thi lay 8h - so gio lam, nguoc lai bang 0
      const overTime = Total > WORKINGTIMEONDAY ? Total - WORKINGTIMEONDAY : 0; //8h = 480m
      this.timeSheetDatas.push({
        date: date,
        timeTotal: Total,
        incompleteTime: incompleteTime,
        overTime: overTime,
      });
    } else { //if has existing data, update data by got index above
      const timeSheetData = this.timeSheetDatas[getCurentDateIndex];
      timeSheetData.timeTotal = timeSheetData.timeTotal + timeTotal;
      timeSheetData.incompleteTime = (timeSheetData.timeTotal < WORKINGTIMEONDAY) ? (WORKINGTIMEONDAY - timeSheetData.timeTotal) : 0;
      timeSheetData.overTime = timeSheetData.timeTotal > WORKINGTIMEONDAY ? timeSheetData.timeTotal - WORKINGTIMEONDAY : 0;
    }
  }

  //Delete registed checking location and start time and set working status as not working
  this.locations = [];
  this.startTimes = [];
  this.workStatus = false;

  //Update database
  return this.save();
};

/*
# Method name: addTakeLeave
# Implementation: store new regsisted leave Info to database
*/
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
