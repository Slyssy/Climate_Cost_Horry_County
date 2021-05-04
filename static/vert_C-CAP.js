// set the dimensions and margins of the graph
var margin = { top: 10, right: 80, bottom: 200, left: 70 },
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
  // List of subgroups = header of the csv files = 1996 or 2016
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
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("y", 0)
    .attr("x", -10)
    .attr("dy", ".35em")
    .attr("transform", "rotate(300)")
    .style("text-anchor", "end");

  var y = d3.scaleLinear().domain([0, 550]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("class", "yAxisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Land Coverage (sq mi)");

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal().domain(subgroups).range(["#aec7e8", "#1f76b4"]);

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack().keys(subgroups)(data);
  console.log(stackedData);
  // ----------------
  // Create a tooltip
  // ----------------
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
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    console.log(subgroupName);
    console.log(subgroupValue);
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

  // Show the bars
  svg
    .append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", function (d) {
      return color(d.key);
    })
    .attr("opacity", ".75")
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.data.C_CAP);
    })
    .attr("y", function (d) {
      return y(d[1]);
    })
    .attr("height", function (d) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth())
    .attr("stroke", "grey")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  var years = ["1996", "2016"];

  var legend = svg
    .selectAll(".legend")
    .data(years.slice())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend
    .append("rect")
    .attr("x", width + 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend
    .append("text")
    .attr("class", "legendText")
    .attr("x", width + 40)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function (d, i) {
      return years[i];
    });
});
