// ! Start bar chart with update

// ?Flooding In Flood Zones Bar Chart>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//*Function to make the SVG responsive
function responsivefy(svg) {
  // container will be the DOM element
  // that the svg is appended to
  // we then measure the container
  // and find its aspect ratio
  const container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width"), 10),
    height = parseInt(svg.style("height"), 10),
    aspect = width / height;

  // set viewBox attribute to the initial size
  // control scaling with preserveAspectRatio
  // resize svg on inital page load
  svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize);

  // add a listener so the chart will be resized
  // when the window resizes
  // multiple listeners for the same event type
  // requires a namespace, i.e., 'click.foo'
  // api docs: https://goo.gl/F3ZCFr
  d3.select(window).on("resize." + container.attr("id"), resize);

  // this is the code that resizes the chart
  // it will be called on load
  // and in response to window resizes
  // gets the width of the container
  // and resizes the svg to fill it
  // while maintaining a consistent aspect ratio
  function resize() {
    const w = parseInt(container.style("width"));
    svg.attr("width", w);
    svg.attr("height", Math.round(w / aspect));
  }
}

const width = 1080;
height = 1000;
margin = { left: 90, top: 70, right: 30, bottom: 85 };

// *Appending SVG object to the correct div on page
const fifzSVG = d3
  .select("#floodingInFloodZones")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .call(responsivefy)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const g = fifzSVG
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xAxisG = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");

xAxisG
  .append("text")
  .attr("class", "xAxisLabel")
  .attr("transform", "translate(" + (width / 2 - 70) + " ," + height + ")")
  .style("text-anchor", "middle")
  .text("Flood Zones");

const yAxisG = g.append("g").attr("class", "y axis");

yAxisG
  .append("text")
  .attr("class", "yAxisLabel")
  .attr("transform", "rotate(-90)")
  .attr("y", -80 - margin.left)
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
const x = d3.scaleBand().range([0, width]).padding(0.1);
const xAxis = fifzSVG
  .append("g")
  .attr("transform", "translate(0," + height + ")");

const y = d3.scaleLinear().range([height, 0]);
const yAxis = fifzSVG.append("g");

const color = d3.scaleOrdinal().range(["#A7BCF6"]);

// *Function that creates and updates the plot for given set of data.
function update(data) {
  // *Scale the range of the data in the domains
  x.domain(data.map((d) => d.group));

  xAxis
    .transition()
    .duration(1000)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("class", "floodingInFloodZones_xAxis_tickLabel");

  y.domain([0, d3.max(data, (d) => d.count) + 50]);

  // *add the x Axis

  // *add the y Axis
  yAxis
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y).ticks(5).tickSize(-1080));

  //* Adding Tooltip Behavior
  const u = fifzSVG.selectAll(".bar").data(data);

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
      d3.select("#tooltip-bar-floodingInFloodZones")
        .style("left", x + "px")
        .style("top", y + "px")
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      d3.select(this).style("fill", (d) => color(d.group));

      // *append the rectangles for the bar chart

      d3.select("#tooltip-bar-floodingInFloodZones").style("opacity", "0");
    })
    .transition()
    .duration(1000)
    .attr("class", "bar")
    .attr("x", (d) => x(d.group))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => height - y(d.count))
    .attr("fill", (d) => color(d.group));

  u.exit().remove();
}

// *Load the Data
d3.csv("/static/FOIA_flood_data_0.csv").then((csv) => {
  // *Parsing data use for total number of houses in each flood zone to report flooding.

  const countsFloodZone = {};

  csv.forEach((d) => {
    const floodZone = d.Flood_Zone;
    if (d.Times_Flooded != 0) {
      if (countsFloodZone[floodZone] === undefined) {
        countsFloodZone[floodZone] = 1;
      } else {
        countsFloodZone[floodZone] = countsFloodZone[floodZone] + 1;
      }
    }
  });

  console.log(countsFloodZone);

  const data = Object.keys(countsFloodZone).map((k) => ({
    group: k,
    count: countsFloodZone[k],
  }));
  const sortOrder = ["AE", "VE", "X", "0.2 PCT ANNUAL CHANCE"];
  data.sort((a, b) => sortOrder.indexOf(a.group) - sortOrder.indexOf(b.group));

  console.log(data);

  // * Creating AE Dataset to show number times Group AE houses reported flooding
  const countsAE = {};
  csv.forEach((d) => {
    const timesFloodedGroup = d.Times_Flooded;
    const floodZone = d.Flood_Zone;
    if (floodZone === "AE") {
      if (countsAE[timesFloodedGroup] === undefined) {
        countsAE[timesFloodedGroup] = 1;
      } else {
        countsAE[timesFloodedGroup] = countsAE[timesFloodedGroup] + 1;
      }
    }
  });
  csv.forEach((d) => {
    const timesFloodedGroup = d.Times_Flooded;
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
  const countsVE = {};
  csv.forEach((d) => {
    const timesFloodedGroup = d.Times_Flooded;
    const floodZone = d.Flood_Zone;
    if (floodZone === "VE") {
      if (countsVE[timesFloodedGroup] === undefined) {
        countsVE[timesFloodedGroup] = 1;
      } else {
        countsVE[timesFloodedGroup] = countsVE[timesFloodedGroup] + 1;
      }
    }
  });
  csv.forEach((d) => {
    const timesFloodedGroup = d.Times_Flooded;
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
  const countsX = {};
  csv.forEach((d) => {
    const timesFloodedGroup = d.Times_Flooded;
    const floodZone = d.Flood_Zone;
    if (floodZone === "X") {
      if (countsX[timesFloodedGroup] === undefined) {
        countsX[timesFloodedGroup] = 1;
      } else {
        countsX[timesFloodedGroup] = countsX[timesFloodedGroup] + 1;
      }
    }
  });
  csv.forEach((d) => {
    const timesFloodedGroup = d.Times_Flooded;
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
  const counts02 = {};
  csv.forEach((d) => {
    const timesFloodedGroup = d.Times_Flooded;
    const floodZone = d.Flood_Zone;
    if (floodZone === "0.2 PCT ANNUAL CHANCE") {
      if (counts02[timesFloodedGroup] === undefined) {
        counts02[timesFloodedGroup] = 1;
      } else {
        counts02[timesFloodedGroup] = counts02[timesFloodedGroup] + 1;
      }
    }
  });
  csv.forEach((d) => {
    const timesFloodedGroup = d.Times_Flooded;
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
