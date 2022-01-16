const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const healthSchema = new Schema({
  staffId: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  vaccineInfo: {
    vaccineStatus:[{
            time: {type: Number, required: true},
            date: {type: Date, required: true}
        }]
    },
  covidInfo: {
        covidStatus:[{
            infect: {type: Boolean, required: true},
            date: {type: Date, required: true}
        }]
    },
  bodyInfo: {
        bodyStatus: [{
           temp: {type: Number, required: true},
           date: {type: Date, required: true}
        }]
    },
});

healthSchema.methods.addToVaccineInfo = function(vaccineStatus) {
    this.vaccineInfo.vaccineStatus.push(vaccineStatus);
    return this.save(); 
};

healthSchema.methods.addToCovidInfo = function(covidStatus) {
  this.covidInfo.covidStatus.push(covidStatus);
  return this.save(); 
};

healthSchema.methods.addToBodyInfo = function(bodyStatus) {
  this.bodyInfo.bodyStatus.push(bodyStatus);
  return this.save(); 
};

healthSchema.methods.updateHealthInfo = function(healthInfo, healthData) {
  if(healthInfo == 'tempCovid'){
      console.log(healthData);
      // console.log({status: bodyInfo});
      this
          .addToBodyInfo(healthData)
          .then(result => {
              console.log('Đăng ký thân nhiệt thành công');
          })
          .catch(err => console.log(err));
  } else if(healthInfo == 'vaccineCovid') {
      console.log(healthData);
      // console.log({status: bodyInfo});
      this
          .addToVaccineInfo(healthData)
          .then(result => {
              console.log('Đăng ký thông tin vaccine thành công');
          })
          .catch(err => console.log(err));
  } else if(healthInfo == 'infectCovid') {
      console.log(healthData);
      // console.log({status: bodyInfo});
      this
          .addToCovidInfo(healthData)
          .then(result => {
              console.log('Đăng ký thông tin nhiễm Covid thành công');
          })
          .catch(err => console.log(err));
  } else {
      console.log('Not found Registry')
  }
};


module.exports = mongoose.model('Health', healthSchema);

/*
{
  "_id": {
      "$oid": "61e2ef67ee7d2c7128bb1dcc"
  },
  "staffId": {
      "$oid": "61e1a8657961e804cd7451b1"
  },
  "vaccineInfo": {
      "vaccineStatus": []
  },
  "covidInfo": {
      "covidStatus": []
  },
  "bodyInfo": {
      "bodyStatus": []
  },
  "__v": 0
}
*/