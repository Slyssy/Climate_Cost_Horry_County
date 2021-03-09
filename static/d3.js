// Set Demensions and margins for the bar chart
var width = 768;
height = 400;
margin = { left: 90, top: 70, right: 30, bottom: 85 };

// Setting the ranges
var x = d3.scaleBand().range([0, width]).padding(0.1);
var y = d3.scaleLinear().range([height, 0]);
var colorScale = d3.scaleOrdinal().range(["#6aeb5e", "#ebe028", "#976aeb"]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3
  .select("#barChart")
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
  .attr("transform", "translate(0," + innerHeight + ")");

var yAxisG = g.append("g").attr("class", "y axis");

yAxisG
  .append("text")
  .attr("class", "yAxis-Label")
  .attr("y", -140)
  .attr("x", -250)
  .attr("transform", `rotate(-90)`)
  .attr("fill", "black")
  .text("# of  Houses Flooded");

g.append("text")
  .attr("class", "xAxis-Label")
  .attr("x", 230)
  .attr("y", 400)
  .text("Flood Zones");

g.append("text")
  .attr("y", -80)
  .attr("x", 20)
  .attr("class", "title")
  .text("Flooded Houses in Each Flood Zone");

// Load the Data
d3.csv("/static/Flood_Area_Count.csv").then(function (data) {
  // Format the data
  data.forEach(function (d) {
    d.Flood_Area = d.Flood_Area;
    d.Count = +d.Count;
  });
  // console.log(data)

  // Scale the range of the data in the domains
  x.domain(
    data.map(function (d) {
      return d.Flood_Area;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.Count;
    }) + 2,
  ]);

  // append the rectangles for the bar chart
  var bar = svg.selectAll(".bar").data(data);

  var bar1 = bar
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.Flood_Area);
    })
    .attr("width", x.bandwidth())
    .attr("y", function (d) {
      return y(d.Count);
    })
    .attr("height", function (d) {
      return height - y(d.Count);
    })
    .attr("fill", function (d) {
      return colorScale(d.Flood_Area);
    });

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y).ticks(5).tickSize(-width));

  // Adding Tooltip Behavior
  bar1
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", "#ce42f5");
      d3.select("#tool_tip").text(" " + d.Count);

      //Position the tooltip <div> and set its content
      let x = event.pageX - 500;
      let y = event.pageY - 1400;

      //Position tooltip and make it visible
      d3.select("#tooltip-bar")
        .style("left", x + "px")
        .style("top", y + "px")
        .style("opacity", 1);
    })

    .on("mouseout", function () {
      d3.select(this).style("fill", function (d) {
        return colorScale(d.Flood_Area);
      });

      //Hide the tooltip
      d3.select("#tooltip-bar").style("opacity", "0");
    });
});
