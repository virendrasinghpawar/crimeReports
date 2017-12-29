<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js">
<!--<![endif]-->

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <style>
        .model {
            width: 450px;
            height: 300px;
            float: left;
            border: 0.75px solid grey;
            margin: 5px;
        }
    </style>
</head>

<body>
    <input type="button" id="btnAdd" value="Add chart">
    <!--<p id="fooBar">Fields:</p>-->
    <div id="myDiv">

    </div>
    <script>
        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        // console.log(uuidv4())
        function removeChart(uniqueId) {
            alert("about to delete are you sure want to delete this")
            //    delete document.getElementById(uniqueId)
            document.getElementById(uniqueId).remove()
        }



        function add() {
            //Create an input type dynamically.   
            var element = document.createElement("div"),
                uniqueId = uuidv4()
            element.setAttribute("id", uniqueId)
            // element.innerHTML = uniqueId

            element.classList.add("model")


            removeButton = document.createElement("button")
            removeButton.innerHTML = "X"
            removeButton.onclick = function () {
                removeChart(uniqueId)
            }
            element.appendChild(removeButton)



            var trace1 = {
                x: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012],
                y: [219, 146, 112, 127, 124, 180, 236, 207, 236, 263, 350, 430, 474, 526, 488, 537, 500, 439],
                name: 'Rest of world',
                marker: { color: '#abcd' },
                type: 'bar'
            };

            var trace2 = {
                x: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012],
                y: [16, 13, 10, 11, 28, 37, 43, 55, 56, 88, 105, 156, 270, 299, 340, 403, 549, 499],
                name: 'China',
                marker: { color: 'rgb(26, 118, 255)' },
                type: 'bar'
            };

            var data = [trace1, trace2];

            var layout = {
                height:290,
                width:450,
                title: 'US Export of Plastic Scrap',
                xaxis: {
                    tickfont: {
                        size: 14,
                        color: 'rgb(107, 107, 107)'
                    }
                },
                yaxis: {
                    title: 'USD (millions)',
                    titlefont: {
                        size: 16,
                        color: 'rgb(107, 107, 107)'
                    },
                    tickfont: {
                        size: 14,
                        color: 'rgb(107, 107, 107)'
                    }
                },
                 showlegend: false,
                // legend: {
                //     x: 0,
                //     y: 1.0,
                //     bgcolor: 'rgba(255, 255, 255, 0)',
                //     bordercolor: 'rgba(255, 255, 255, 0)'
                // },
                barmode: 'group',
                bargap: 0.15,
                bargroupgap: 0.1
            };

            // Plotly.newPlot('myDiv', data, layout);

            Plotly.newPlot(element, data, layout);
            var myDiv = document.getElementById("myDiv");
            //Append the element in page (in span).  
            myDiv.appendChild(element);
        }
        document.getElementById("btnAdd").onclick = function () {
            add();
        };
    </script>
</body>

</html>
