
var statesData
fetch('http://localhost:3000/geojson').then(function (response) {
  return response.json()
}).then(function (result) {
  statesData = result

  var map = L.map('map').setView([37.7749, -122.4194], 12)

  mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        L.tileLayer(mbUrl, {

          attribution: mbAttr,
          id: 'mapbox.streets'
        }).addTo(map)

    // control that shows state info on hover
  var info = L.control()

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info')
    this.update()
    return this._div
  }

  info.update = function (props) {
    this._div.innerHTML = '<h4>San Francisco Incidents Reports</h4>' + (props ?
            '<b>' + props.district + '</b><br />' + props.crimeCount + ' Incidents'
            : 'Hover over a  police district')
  }

  info.addTo(map)

    // get color depending on number of incidents
  function getColor (d) {
        // console.log("i come here")
    return d > 23000 ? '#800026' :
            d > 20000 ? '#BD0026' :
                d > 15000 ? '#E31A1C' :
                    d > 10000 ? '#FC4E2A' :
                        d > 5000 ? '#FD8D3C' :
                            d > 2000 ? '#FEB24C' :
                                d > 1000 ? '#FED976' :
                                    '#FFEDA0'
  }

  function style (feature) {
        // console.log("feature.properties.crimeCount", feature.properties.crimeCount)
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.crimeCount)
      }
  }

  function highlightFeature (e) {
    var layer = e.target

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      })

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront()
      }

    info.update(layer.feature.properties)
  }

  var geojson

  function resetHighlight (e) {
    geojson.resetStyle(e.target)
    info.update()
  }

  function zoomToFeature (e) {
    map.fitBounds(e.target.getBounds())
  }

  function onEachFeature (feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      })
  }

  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map)

  map.attributionControl.addAttribution('San Francisco Incidents Reports')

  var legend = L.control({ position: 'bottomright' })

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1000, 2000, 5000, 10000, 20000, 23000],
        labels = [],
        from, to

    for (var i = 0; i < grades.length; i++) {
        from = grades[i]
        to = grades[i + 1]

        labels.push(
                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                from + (to ? '&ndash;' + to : '+'))
      }

    div.innerHTML = labels.join('<br>')
    return div
  }
  var grayscale = L.tileLayer(mbUrl, { id: 'mapbox.light', attribution: mbAttr }),
    streets = L.tileLayer(mbUrl, { id: 'mapbox.streets', attribution: mbAttr })

  var baseLayers = {
    'Grayscale': grayscale,
    'Streets': streets
  }

    // var overlays = {
    // 	"Cities": cities
    // };
  legend.addTo(map)

  L.control.layers(baseLayers).addTo(map)
  var markers = null
  map.on('moveend', function (e) {
                    // console.log("Dragged", map.getZoom())

    if (map.getZoom() > 14) {
                        // console.log("inside zoom")
                        // var bounds = map.getCenter();
                        // console.log("Center", map.getCenter())

        fetch('http://localhost:3000/incidentinside', {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json'
                          },
                        body: JSON.stringify({
                            'Center': map.getCenter()

                          })
                      }).then(res => res.json())
                            .then(res => {
                              if (markers) {
                                map.removeLayer(markers)
                              }
                                
                              markers = L.markerClusterGroup({ chunkedLoading: true })
                             
                              console.log("result 3",res[2])
                              for (var i = 0; i < res.length; i++) {
                                var a = res[i].location.coordinates
                                var title = res[i].category+"</br>"+"hello"
                                var marker = L.marker(L.latLng(a[1], a[0]), { title: title })
                                marker.bindPopup(title)
                                
                                markers.addLayer(marker)
                              }

                              map.addLayer(markers)
                            // console.log("done with marking")
                            })
      } else {
                        // console.log("going to remove markers")

      }
  })
  map.on('zoomend', function (e) {
    zoom_based_layerchange()
  })

  function zoom_based_layerchange () {
        // console.log(map.getZoom());

        // var currentZoom = ;

    switch (map.getZoom()) {
        case 15:
                // alert(map.getCenter())
                // clean_map();
          legend.remove(map)
          info.remove(map)

          map.eachLayer(function (layer) {
              if (layer instanceof L.GeoJSON) {
                    map.removeLayer(layer)
                  }
                    // console.log(layer);
            })

                // legend.(map);
                // coorsLayer.addTo(map); //show Coors Field
          break
        case 12:
          if (markers) {
            // console.log("i am going to removing them as well")
              map.removeLayer(markers)
                // console.log("yes i have done this")
            }

                    // console.log(layer);

          legend.addTo(map)
          info.addTo(map)
          L.geoJson(statesData, {
              style: style,
              onEachFeature: onEachFeature
            }).addTo(map)

        default:
                // do nothing
          break
      }
  }
})
