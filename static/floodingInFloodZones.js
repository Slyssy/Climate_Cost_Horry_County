// // ?Flooding In Flood Zones Bar Chart>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// // *Load the Data
// d3.csv("/static/FOIA_flood_data_0.csv").then(function (csv) {
//   // *Parsing data to make it useable for chart
// let counts = {};
// csv.forEach(function (d) {
//   let timesFloodedGroup = d.Times_Flooded;
//   if (counts[timesFloodedGroup] === undefined) {
//     counts[timesFloodedGroup] = 1;
//   } else {
//     counts[timesFloodedGroup] = counts[timesFloodedGroup] + 1;
//   }
// });
// csv.forEach(function (d) {
//   let timesFloodedGroup = d.Times_Flooded;
//   d.count = counts[timesFloodedGroup];
// });

// console.log(counts);

// // Split the count object into an array of objects
// data = Object.keys(counts).map((k) => ({ group: k, count: counts[k] }));

// const sortOrder = ["0", "1", "2", "3"];
// data.sort((a, b) => sortOrder.indexOf(a.group) - sortOrder.indexOf(b.group));

//   console.log(data);

//   var width = 1080;
//   height = 393;
//   margin = { left: 90, top: 70, right: 30, bottom: 85 };

//   // Setting the ranges
//   var x = d3.scaleBand().range([0, width]).padding(0.1);
//   var y = d3.scaleLinear().range([height, 0]);
//   var color = d3
//     .scaleOrdinal()
//     .range(["#ed5151", "#149ece", "#3caf99", "#004c73", "#fc921f"]);

//   // append the svg object to the body of the page
//   // append a 'group' element to 'svg'
//   // moves the 'group' element to the top left margin
//   var svg = d3
//     .select("#timesFlooded")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   var g = svg
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   var xAxisG = g
//     .append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")");

//   g.append("text")
//     .attr("class", "xAxisLabel")
//     .attr("transform", "translate(" + width / 2 + " ," + height + ")")
//     .style("text-anchor", "middle")
//     .text("Number of Reported Flood Events");

//   var yAxisG = g.append("g").attr("class", "y axis");

//   yAxisG
//     .append("text")
//     .attr("class", "yAxisLabel")
//     .attr("transform", "rotate(-90)")
//     .attr("y", -60 - margin.left)
//     .attr("x", 60 - height / 2)
//     .attr("dy", "1em")
//     .style("text-anchor", "middle")
//     .text("# of  Houses");

//   g.append("text")
//     .attr("class", "title")
//     .attr("x", width / 2)
//     .attr("y", -20 - margin.top)
//     .attr("text-anchor", "middle")
//     .style("text-decoration", "underline")
//     .text("Reported Flood Events");

//   // Scale the range of the data in the domains
//   x.domain(
//     data.map(function (d) {
//       return d.group;
//     })
//   );
//   y.domain([
//     0,
//     d3.max(data, function (d) {
//       return d.count;
//     }) + 2,
//   ]);

//   // append the rectangles for the bar chart
//   var bar = svg.selectAll(".bar").data(data);

//   var bar1 = bar
//     .enter()
//     .append("rect")
//     .attr("class", "bar")
//     .attr("x", function (d) {
//       return x(d.group);
//     })
//     .attr("width", x.bandwidth())
//     .attr("y", function (d) {
//       return y(d.count);
//     })
//     .attr("height", function (d) {
//       return height - y(d.count);
//     })
//     .attr("fill", function (d) {
//       return color(d.group);
//     });

//   // add the x Axis
//   svg
//     .append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).tickSizeOuter(0))
//     .selectAll("text")
//     .attr("class", "timesFlooded_xAxis_tickLabel");

//   // add the y Axis
//   svg.append("g").call(d3.axisLeft(y).ticks(5).tickSize(-1080));

//   // Adding Tooltip Behavior
//   bar1
//     .on("mouseover", function (event, d) {
//       d3.select(this).style("fill", "#ce42f5");
//       d3.select("#tool_tip_timesFlooded_group").text(" " + d.group);
//       d3.select("#tool_tip_timesFlooded_count").text(" " + d.count);

//       //Position the tooltip <div> and set its content
//       let x = event.pageX;
//       let y = event.pageY;

//       //Position tooltip and make it visible
//       d3.select("#tooltip-bar-timesFlooded")
//         .style("left", x + "px")
//         .style("top", y + "px")
//         .style("opacity", 1);
//     })

//     .on("mouseout", function () {
//       d3.select(this).style("fill", function (d) {
//         return color(d.group);
//       });

//       //Hide the tooltip
//       d3.select("#tooltip-bar-timesFlooded").style("opacity", "0");
//     });
// });
// ! Start bar chart with update

// ?Flooding In Flood Zones Bar Chart>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var width = 1080;
height = 393;
margin = { left: 90, top: 70, right: 30, bottom: 85 };

// *Appending SVG object to the correct div on page
var svg = d3
  .select("#timesFlooded")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxisG = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");

xAxisG
  .append("text")
  .attr("class", "xAxisLabel")
  .attr("transform", "translate(" + (width / 2 - 70) + " ," + height + ")")
  .style("text-anchor", "middle")
  .text("Flood Zones");

var yAxisG = g.append("g").attr("class", "y axis");

yAxisG
  .append("text")
  .attr("class", "yAxisLabel")
  .attr("transform", "rotate(-90)")
  .attr("y", -65 - margin.left)
  .attr("x", 75 - height / 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("# of  Houses");

g.append("text")
  .attr("class", "title")
  .attr("x", width / 2 - 70)
  .attr("y", -20 - margin.top)
  .attr("text-anchor", "middle")
  .style("text-decoration", "underline")
  .text("Reported Flooding per Flood Zone (FOIA Data)");

// *Setting the ranges
var x = d3.scaleBand().range([0, width]).padding(0.1);
let xAxis = svg.append("g").attr("transform", "translate(0," + height + ")");

var y = d3.scaleLinear().range([height, 0]);
let yAxis = svg.append("g");

var color = d3.scaleOrdinal().range(["rgb(252, 146, 31)"]);

// *Function that creates and updates the plot for given set of data.
function update(data) {
  // *Scale the range of the data in the domains
  x.domain(
    data.map(function (d) {
      return d.group;
    })
  );

  xAxis
    .transition()
    .duration(1000)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("class", "timesFlooded_xAxis_tickLabel");

  y.domain([
    0,
    d3.max(data, function (d) {
      return d.count;
    }) + 50,
  ]);

  // *add the x Axis

  // *add the y Axis
  yAxis
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y).ticks(5).tickSize(-1080));

  // append the rectangles for the bar chart
  var u = svg.selectAll(".bar").data(data);

  u.enter()
    .append("rect")
    .merge(u)
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", "#ce42f5");
      d3.select("#tool_tip_floodZone").text(" " + d.group);
      d3.select("#tool_tip_reportedFlooding_count").text(" " + d.count);

      //Position the tooltip <div> and set its content
      let x = event.pageX;
      let y = event.pageY;

      //Position tooltip and make it visible
      d3.select("#tooltip-bar-timesFlooded")
        .style("left", x + "px")
        .style("top", y + "px")
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      d3.select(this).style("fill", function (d) {
        return color(d.group);
      });

      //Hide the tooltip
      d3.select("#tooltip-bar-timesFlooded").style("opacity", "0");
    })
    .transition()
    .duration(1000)
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.group);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.count);
    })
    .attr("height", function (d) {
      return height - y(d.count);
    })
    .attr("fill", function (d) {
      return color(d.group);
    });

  //* Adding Tooltip Behavior

  u.exit().remove();
}

// *Load the Data
d3.csv("/static/FOIA_flood_data_0.csv").then(function (csv) {
  // *Parsing data use for total number of houses in each flood zone to report flooding.

  let countsFloodZone = {};

  csv.forEach(function (d) {
    let floodZone = d.Flood_Zone;
    if (d.Times_Flooded != 0) {
      if (countsFloodZone[floodZone] === undefined) {
        countsFloodZone[floodZone] = 1;
      } else {
        countsFloodZone[floodZone] = countsFloodZone[floodZone] + 1;
      }
    }
  });

  console.log(countsFloodZone);

  data = Object.keys(countsFloodZone).map((k) => ({
    group: k,
    count: countsFloodZone[k],
  }));
  const sortOrder = ["AE", "VE", "X", "0.2 PCT ANNUAL CHANCE"];
  data.sort((a, b) => sortOrder.indexOf(a.group) - sortOrder.indexOf(b.group));

  console.log(data);

  // * Creating AE Dataset to show number times Group AE houses reported flooding
  let countsAE = {};
  csv.forEach(function (d) {
    let timesFloodedGroup = d.Times_Flooded;
    let floodZone = d.Flood_Zone;
    if (floodZone === "AE") {
      if (countsAE[timesFloodedGroup] === undefined) {
        countsAE[timesFloodedGroup] = 1;
      } else {
        countsAE[timesFloodedGroup] = countsAE[timesFloodedGroup] + 1;
      }
    }
  });
  csv.forEach(function (d) {
    let timesFloodedGroup = d.Times_Flooded;
    d.count = countsAE[timesFloodedGroup];
  });

  console.log(countsAE);

  // Split the count object into an array of objects
  dataAE = Object.keys(countsAE).map((k) => ({ group: k, count: countsAE[k] }));

  const sortOrderAE = ["0", "1", "2", "3"];
  dataAE.sort(
    (a, b) => sortOrderAE.indexOf(a.group) - sortOrderAE.indexOf(b.group)
  );

  console.log(dataAE);

  // * Creating VE Dataset to show number times Group AE houses reported flooding
  let countsVE = {};
  csv.forEach(function (d) {
    let timesFloodedGroup = d.Times_Flooded;
    let floodZone = d.Flood_Zone;
    if (floodZone === "VE") {
      if (countsVE[timesFloodedGroup] === undefined) {
        countsVE[timesFloodedGroup] = 1;
      } else {
        countsVE[timesFloodedGroup] = countsVE[timesFloodedGroup] + 1;
      }
    }
  });
  csv.forEach(function (d) {
    let timesFloodedGroup = d.Times_Flooded;
    d.count = countsVE[timesFloodedGroup];
  });

  console.log(countsVE);

  // Split the count object into an array of objects
  dataVE = Object.keys(countsVE).map((k) => ({ group: k, count: countsVE[k] }));

  const sortOrderVE = ["0", "1", "2", "3"];
  dataVE.sort(
    (a, b) => sortOrderVE.indexOf(a.group) - sortOrderVE.indexOf(b.group)
  );

  console.log(dataVE);

  // * Creating X Dataset to show number times Group AE houses reported flooding
  let countsX = {};
  csv.forEach(function (d) {
    let timesFloodedGroup = d.Times_Flooded;
    let floodZone = d.Flood_Zone;
    if (floodZone === "X") {
      if (countsX[timesFloodedGroup] === undefined) {
        countsX[timesFloodedGroup] = 1;
      } else {
        countsX[timesFloodedGroup] = countsX[timesFloodedGroup] + 1;
      }
    }
  });
  csv.forEach(function (d) {
    let timesFloodedGroup = d.Times_Flooded;
    d.count = countsX[timesFloodedGroup];
  });

  console.log(countsX);

  // Split the count object into an array of objects
  dataX = Object.keys(countsX).map((k) => ({ group: k, count: countsX[k] }));

  const sortOrderX = ["0", "1", "2", "3"];
  dataX.sort(
    (a, b) => sortOrderX.indexOf(a.group) - sortOrderX.indexOf(b.group)
  );

  console.log(dataX);

  // * Creating 0.2 Dataset to show number times Group AE houses reported flooding
  let counts02 = {};
  csv.forEach(function (d) {
    let timesFloodedGroup = d.Times_Flooded;
    let floodZone = d.Flood_Zone;
    if (floodZone === "0.2 PCT ANNUAL CHANCE") {
      if (counts02[timesFloodedGroup] === undefined) {
        counts02[timesFloodedGroup] = 1;
      } else {
        counts02[timesFloodedGroup] = counts02[timesFloodedGroup] + 1;
      }
    }
  });
  csv.forEach(function (d) {
    let timesFloodedGroup = d.Times_Flooded;
    d.count = counts02[timesFloodedGroup];
  });

  console.log(counts02);

  // Split the count object into an array of objects
  data02 = Object.keys(counts02).map((k) => ({ group: k, count: counts02[k] }));

  const sortOrder02 = ["0", "1", "2", "3"];
  data02.sort(
    (a, b) => sortOrder02.indexOf(a.group) - sortOrder02.indexOf(b.group)
  );

  console.log(data02);

  update(data);
});
