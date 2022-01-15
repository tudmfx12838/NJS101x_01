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
            time: {type: Number, required: false},
            date: {type: Date, required: false}
        }]
    },
  covidInfo: {
        covidStatus:[{
            infect: {type: Boolean, required: false},
            date: {type: Date, required: false}
        }]
    },
  bodyInfo: {
        bodyStatus: [{
           temp: {type: Number, required: false},
           date: {type: Date, required: false}
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