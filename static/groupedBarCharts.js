"use strict";
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 140, left: 50 },
  width = 860 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("/static/Simplified_C-CAP_Scheme.csv", function (data) {
  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(5);
  console.log(subgroups);

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3
    .map(data, function (d) {
      return d.C_CAP;
    })
    .keys();
  console.log(groups);
  // Add X axis
  var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("y", 0)
    .attr("x", -10)
    .attr("dy", ".35em")
    .attr("transform", "rotate(300)")
    .style("text-anchor", "end");
  // Add Y axis
  var y = d3.scaleLinear().domain([0, 300]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal().domain(subgroups).range(["#aec7e8", "#1f76b4"]);

  var tooltip = d3
    .select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    // d3.select(this).style("fill", "#ce42f5");
    var subgroupName = d.key;
    var subgroupValue = d.value;
    console.log(subgroupName);

    tooltip
      .html(
        "Year: " +
          subgroupName +
          "<br>" +
          "Land Coverage: " +
          subgroupValue +
          " Square Miles"
      )
      .style("opacity", 1);
  };
  var mousemove = function (d) {
    tooltip
      .style("left", d3.mouse(this)[0] + 90 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", d3.mouse(this)[1] + "px");
  };
  var mouseleave = function (d) {
    // d3.select(this).style("fill", function (d) {
    //   return color(subgroups);
    // });
    tooltip.style("opacity", 0);
  };
  console.log(data);
  // Show the bars
  svg
    .append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + x(d.C_CAP) + ",0)";
    })
    .selectAll("rect")
    .data(function (d) {
      return subgroups.map(function (key) {
        return { key: key, value: d[key] };
      });
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xSubgroup(d.key);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("fill", function (d) {
      return color(d.key);
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
});
