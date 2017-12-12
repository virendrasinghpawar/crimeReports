var Incident = require('../model/gis')
var geojson = require('../public/javascripts/policeDistrict.json')
exports.get_police_Department = function (req, res) {
  Incident.find({'recordId': 16091327264070}, {'description': 1, _id: 0}).limit(20).exec((err, incidents) => {
    if (err) {
      console.log(err)
    }
    res.json(incidents)
  })
}

exports.geo_json = function (req, res, next) {
//   Incident.find({'recordId': 16091327264070}, {'description': 1, _id: 0}).limit(20).exec((err, incidents) => {
//     if (err) {
//       console.log(err)
//     }
//     res.json(incidents)
//   })

  Incident.aggregate([
    {
      $group: {
        _id: '$policeStationName',  // $region is the column name in collection
        count: {$sum: 1}
      }
    }, {
      $project: {
        'policeStationName': '$_id',
        'count': 1,
        '_id': 0
      }}
  ], function (err, result) {
    if (err) {
      next(err)
    } else {
    //   geojson["features"].forEach(feature => {
    //     console.log(feature.properties.district)
    //   })
    //   console.log()
      geojson['features'].forEach(feature => {
        result.forEach(policeDistrict => {
          if (policeDistrict.policeStationName == feature.properties.district) {
            feature.properties.crimeCount = policeDistrict.count
          }
        })
        // console.log(feature.properties.district)
      })
      res.json(geojson)
    }
  })
}

exports.incidentsInside = function (req, res) {
  // console.log('SouthEast', req.body.SouthEast)
  // console.log('SouthWest', req.body.SouthWest)
  // console.log('NorthWest', req.body.NorthWest)
  // console.log('NorthEast', req.body.NorthEast)
  // Incident.find(
  //   {
  //     location: {
  //       $geoWithin: {
  //         $geometry: {
  //           type: 'Polygon',
  //           coordinates: [[

  //                    [req.body.SouthEast.lng, req.body.SouthEast.lat],
  //                    [req.body.SouthWest.lng, req.body.SouthWest.lat],
  //                    [req.body.NorthWest.lng, req.body.NorthWest.lat],
  //                    [req.body.NorthEast.lng, req.body.NorthEast.lat],
  //                    [req.body.SouthEast.lng, req.body.SouthEast.lat]
  //           ]
  //           ],
  //           crs: {
  //             type: 'name',
  //             properties: { name: 'urn:x-mongodb:crs:strictwinding:EPSG:4326' }
  //           }
  //         }
  //       }
  //     }
  //   }
  //    )
  Incident.find({
    location: { $geoWithin: { $centerSphere: [ [req.body.Center.lng, req.body.Center.lat], 1 / 3963.2 ] } }
  }, {location: 1, category: 1}).exec((err, incidents) => {
    res.json(incidents)
  })
//   res.json({'name': 'iside'})
}

exports.chartsFilter = function (req, res) {
  Incident.aggregate([ {
    $project:
    {

      month:
      {
        $month: '$Date'
      },
      dayOfWeek: { $dayOfWeek: '$Date' },

      category: 1,
      resolution: 1,
      _id: 0,
      policeStationName: 1,
      DayOfWeek: 1,
      time: 1
    }
  },
  {
    $match:
    {
      month: {$in: req.body.months}

    }
  }], function (err, result, next) {
    if (err) {
      next(err)
    } else {
      res.json(result)
    }
  })
}
