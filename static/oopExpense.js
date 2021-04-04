// *Out of Pocket Expense>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
var width = 768;
height = 400;
margin = { left: 90, top: 70, right: 150, bottom: 160 };

// Setting the ranges
var x2 = d3.scaleBand().range([0, width]).padding(0.1);
var y2 = d3.scaleLinear().range([height, 0]);
var colorScale2 = d3.scaleOrdinal()
.range([
    "#ed5151",
      "#149ece",
      "#3caf99",
      "#004c73",
      "#fc921f",
      "#a8a800",
      "#f789d8",
      "#732600",
      "#ff00c5",
      "#9e559c",
      "#a7c636",]);

// * append the svg object to the body of the page
// * append a 'group' element to 'svg'
// * moves the 'group' element to the top left margin
var svg2 = d3
  .select("#outOfPocketExpense")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g = svg2
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
  .attr("x", 120)
  .attr("y", 480)
  .text("Out of Pocket Expense");

g.append("text")
  .attr("y", -80)
  .attr("x", 50)
  .attr("class", "title")
  .text("Reported Out of Pocket Expense");

// Load the Data
d3.csv("/static/SurveyCostDataWithLatitudeAndLongitude.csv").then(function (data1) {
  // Format the data
  data1.forEach(function (d) {
    d.OOP_Expense = d.OOP_Expense;
    d.Count_OOP_Expense = +d.Count_OOP_Expense;
  });
  // console.log(data1)

  // Scale the range of the data in the domains
  x2.domain(
    data1.map(function (d) {
      return d.OOP_Expense;
    })
  );
  y2.domain([
    0,
    d3.max(data1, function (d) {
      return d.Count_OOP_Expense;
    }) + 2,
  ]);

  // append the rectangles for the bar chart
  var bar = svg2.selectAll(".bar").data(data1);

  var bar1 = bar
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x2(d.OOP_Expense);
    })
    .attr("width", x2.bandwidth())
    .attr("y", function (d) {
      return y2(d.Count_OOP_Expense);
    })
    .attr("height", function (d) {
      return height - y2(d.Count_OOP_Expense);
    })
    .attr("fill",  function (d) {
      return colorScale2(d.OOP_Expense);
    });

  // add the x Axis
  svg2
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x2).tickSizeOuter(0))
    .selectAll("text")
    .attr("class", "oop_xAxis_tickLabel")
    .attr("y", 0)
    .attr("x", -8)
    .attr("dy", ".35em")
    .attr("transform", "rotate(300)")
    .style("text-anchor", "end");
  // add the y Axis
  svg2.append("g").call(d3.axisLeft(y2).ticks(5).tickSize(-width));

  // Adding Tooltip Behavior
  bar1
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", "#ce42f5");
      d3.select("#tool_tip_times_flooded").text(" " + d.Count_OOP_Expense);

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
        return colorScale2(d.OOP_Expense);
      });

      //Hide the tooltip
      d3.select("#tooltip-bar-times-flooded").style("opacity", "0");
    });
});