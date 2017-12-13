// import { inspect } from 'util'

var express = require('express')
var router = express.Router()
// var Incident = require('../model/gis')

var IncidentController = require('../controller/incident')
// var foo = require('')
/* GET home page. */
// var config = require('../public/javascripts/incidentsData.json')
// router.get('/', (req, res) => {
//   res.render('index', { title: 'Express' })
// })

router.post('/chartsData', IncidentController.chartsFilter)

router.post('/incidentinside', IncidentController.incidentsInside)
router.get('/geojson', IncidentController.geo_json)
router.get('/', (req, res) => {
  res.render('Dashboard', { title: 'Express' })
})

router.get('/lorem', (req,res)=>{
res.json({"hello":"world"});
})

module.exports = router
