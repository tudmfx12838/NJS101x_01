# NJS101x_01

@startuml
' hide the spot
hide circle

' avoid problems with angled crows feet
skinparam linetype ortho

entity "Staff" as Staff {
  *e1_id : number <<generated>>
  --
  *idNumber: String
  password: String
  permission: String
  name : String
  doB : Date
  startDate: Date
  salaryScale: Number
  department: String
  annualLeave: Number
}

entity "Timesheet" as Timesheet {
  *e2_id : number <<generated>>
  --
  *e1_id : number <<FK>>
  locations: [{location: String}]
  startTimes: [{startTime: Date}]
  timeResults: [{
	locations: [{location: String}]
	startTimes: [{startTime: Date}]
	endTime: Date
	timeTotal: Number
  }]
  timeSheetDatas: [{
	date: String
	timeTotal: Number
	incompleteTime: Number
	overTime: Number
  }]
  workStatus: Boolean
  takeLeaveInfo[{
	date: Sring,
	leaveTime: String
  }]
  monthSalary:({
	month: String
	salary: Number
  })
}

entity "Health" as Health {
  *e3_id : number <<generated>>
  --
  e1_id : number <<FK>>
  vaccineInfo:({ 
	  vaccineStatus:[{
		date: Sring,
		time: number
	  }]
  })
  covidInfo:({ 
	  covidStatus:[{
		date: Sring,
		infect: Boolean
	  }]
  })
  bodyInfo:({ 
	  bodyStatus:[{
		date: Sring,
		temp: number
	  }]
  })
}

Staff ||..o{ Timesheet
Staff ||..o{ Health
@enduml
