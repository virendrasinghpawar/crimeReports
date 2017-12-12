const mongoose = require('mongoose')
// const config = require('../config/database')

const incidentSchema = mongoose.Schema({
  policeStationId: {
    type: Number
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  DayOfWeek: {
    type: String
  },
  Date: {
    type: Date
  },
  time: {
    type: String
  },
  policeStationName: {
    type: String
  },
  resolution: {
    type: String
  },
  Address: {type: String},
  location: { type: {type: String}, coordinates: [Number]},
  recordId: { type: Number}

})
incidentSchema.index({location: '2dsphere'})
const incident = module.exports = mongoose.model('incident', incidentSchema)
