var statesData
fetch('http://localhost:3000/geojson').then(function (response) {
  return response.json()
}).then(function (result) {
  statesData = result
  console.log("i come here")
  console.log(statesData)
})
