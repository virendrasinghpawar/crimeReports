
            var policeDistrict = dc.barChart('#policeDistrictChart'),
              resolutionChart = dc.pieChart('#resolution-chart'),
              categoryChart = dc.pieChart('#category-chart')

            makeChart(1)
            var incidentData = []
            function monthChange(){
                console.log("changingthe value")
                var month = document.getElementById("mySelect").value;
                console.log("monthis",month)
                makeChart(month)
                console.log("after callingthe month")
            }
            function makeChart(month) {
                console.log("month inside",month)
                // document.getElementById("loader").style.display = 'block';
                // document.getElementById("body").style.display = 'none';
                
                
                console.log("i am goingto show")
                

            fetch('http://localhost:3000/chartsData',
              {
                method: 'post',
                headers: {
                      'Accept': 'application/json, text/plain, */*',
                      'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                      'months': [Number(month)]

                    })
              }).then(res => res.json()).then(res => {
                  incidentData = res


                  var unique_values = incidentData.map(function (d) {
                      return d.policeStationName
                    })
                    // console.log(unique_values)

                    // console.log()
                  var ndx = crossfilter(incidentData)
                  var chart = dc.heatMap('#dtime')



                  dtimeDim = ndx.dimension(function (d) {
                      return [+d.time.split(':')[0], +d.dayOfWeek]
                    }),
                        dtimeGroup = dtimeDim.group().reduceSum(function (d) { return +1 })

                  chart
                        .width(28 * 24)
                        .height(28 * 7)
                        .dimension(dtimeDim)
                        .group(dtimeGroup)
                        .keyAccessor(function (d) { return +d.key[0] })
                        .valueAccessor(function (d) { return +d.key[1] })
                        .colorAccessor(function (d) { return +d.value })
                        .title(function (d) {
                          return 'Day of Week:   ' + d.key[1] + '\n' +
                                'Time:  ' + d.key[0] + '\n' +
                                'Value: ' + (d.value) + 'Incidents'
                        })
                        .colors(['#F4C9C6', '#EFB3B3', '#EF8383', '#FF3826', '#E00000'])
                        .calculateColorDomain()

                  categoryDim = ndx.dimension(function (d) {
                      return d.category
                    }),
                        StationaNameDim = ndx.dimension(function (d) { return d.policeStationName }),
                        resolutionDim = ndx.dimension(function (d) { return d.resolution }),


                        categoryCount = categoryDim.group().reduceSum(function (d) { return +1 }),
                        stationCount = StationaNameDim.group().reduceSum(function (d) { return +1 }),
                        resolutionCount = resolutionDim.group().reduceSum(function (d) { return +1 })



                  policeDistrict
                        .dimension(StationaNameDim)
                        .group(stationCount)
                        .elasticY(true)
                        .height(350)
                        .width(400)
                        .ordering(function (p) {
                            return p.value
                          })
                         .controlsUseVisibility(true)
                        .x(d3.scale.ordinal()
                        .domain([...new Set(unique_values)])
                        
                    )
                        .xUnits(dc.units.ordinal)
                        
                        .controlsUseVisibility(true)

                  resolutionChart
                        .dimension(resolutionDim)
                        .group(resolutionCount)                       
                        
                        .innerRadius(30)
                        
                        // .slicesCap()
                        .ordering(function (p) {
                          return p.value
                        })


                  categoryChart

                        .dimension(categoryDim)
                        .group(categoryCount)
                        // .elasticX(true)
                        .innerRadius(30)
                        
                        .controlsUseVisibility(true)
                        .ordering(function (p) {
                          return p.value
                        })


                  function show_empty_message (chart) {
                      var is_empty = d3.sum(chart.group().all().map(chart.valueAccessor())) === 0
                      var data = is_empty ? [1] : []
                      var empty = chart.svg().selectAll('.empty-message').data(data)
                      empty.enter().append('text')
                            .text('NO DATA!')
                            .attr({
                              'text-anchor': 'middle',
                              'alignment-baseline': 'middle',
                              class: 'empty-message',
                              x: chart.margins().left + chart.effectiveWidth() / 2,
                              y: chart.margins().top + chart.effectiveHeight() / 2
                            })
                            .style('opacity', 0)
                      empty.transition().duration(1000).style('opacity', 1)
                      empty.exit().remove()
                    }

                //   resolutionChart.on('pretransition', show_empty_message)
                    // categoryChart.on('pretransition', show_empty_message);

                  dc.renderAll()
                })
                // document.getElementById("loader").style.display = 'none';
                // document.getElementById("body").style.display = 'block';
                
                
                
            }