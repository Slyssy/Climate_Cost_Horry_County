// Times Flooded Bar Chart>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var width = 768;
height = 400;
margin = { left: 90, top: 70, right: 30, bottom: 85 };

// Setting the ranges
var x1 = d3.scaleBand().range([0, width]).padding(0.1);
var y1 = d3.scaleLinear().range([height, 0]);
var colorScale = d3.scaleOrdinal()
.range([
    "#ed5151", 
    "#149ece", 
    "#3caf99", 
    "#004c73", 
    "#fc921f",]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg1 = d3
  .select("#timesFlooded")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g = svg1
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxisG = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + innerHeight + ")");

var yAxisG = g.append("g").attr("class", "y axis");

yAxisG
  .append("text")
  .attr("class", "yAxis-Label")
  .attr("y", -140)
  .attr("x", -200)
  .attr("transform", `rotate(-90)`)
  .attr("fill", "black")
  .text("# of  Houses");

g.append("text")
  .attr("class", "xAxis-Label")
  .attr("x", 80)
  .attr("y", 400)
  .text("Number of Reported Flood Events");

g.append("text")
  .attr("y", -80)
  .attr("x", 90)
  .attr("class", "title")
  .text("Reported Flood Events");

// Load the Data
d3.csv("/static/SurveyCostDataWithLatitudeAndLongitude.csv").then(function (data1) {
  // Format the data
  data1.forEach(function (d) {
    d.NumberFlooding = d.NumberFlooding;
    d.CountFlooding = +d.CountFlooding;
  });
  // console.log(data1)

  // Scale the range of the data in the domains
  x1.domain(
    data1.map(function (d) {
      return d.NumberFlooding;
    })
  );
  y1.domain([
    0,
    d3.max(data1, function (d) {
      return d.CountFlooding;
    }) + 2,
  ]);

  // append the rectangles for the bar chart
  var bar = svg1.selectAll(".bar").data(data1);

  var bar1 = bar
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x1(d.NumberFlooding);
    })
    .attr("width", x1.bandwidth())
    .attr("y", function (d) {
      return y1(d.CountFlooding);
    })
    .attr("height", function (d) {
      return height - y1(d.CountFlooding);
    })
    .attr("fill",  function (d) {
      return colorScale(d.NumberFlooding);
    });

  // add the x Axis
  svg1
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x1).tickSizeOuter(0));

  // add the y Axis
  svg1.append("g").call(d3.axisLeft(y1).ticks(5).tickSize(-width));

  // Adding Tooltip Behavior
  bar1
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", "#ce42f5");
      d3.select("#tool_tip_times_flooded").text(" " + d.CountFlooding);

      //Position the tooltip <div> and set its content
      let x = event.pageX - 1300;
      let y = event.pageY - 1400;

      //Position tooltip and make it visible
      d3.select("#tooltip-bar-times-flooded")
        .style("left", x + "px")
        .style("top", y + "px")
        .style("opacity", 1);
    })

    .on("mouseout", function () {
      d3.select(this).style("fill",  function (d) {
        return colorScale(d.NumberFlooding);
      });

      //Hide the tooltip
      d3.select("#tooltip-bar-times-flooded").style("opacity", "0");
    });
});