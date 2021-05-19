// * Load the Data
d3.csv("/static/Flood_Area_Count.csv").then(function (data) {
  // * Set Demensions and margins for the bar chart
  var width = 1080;
  height = 393;
  margin = { left: 100, top: 70, right: 30, bottom: 85 };

  // * Setting the ranges
  var x3 = d3.scaleBand().range([0, width]).padding(0.1);
  var y3 = d3.scaleLinear().range([height, 0]);
  var colorScale = d3.scaleOrdinal().range(["#6aeb5e", "#ebe028", "#976aeb"]);

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

  // * append the svg object to the body of the page
  // * append a 'group' element to 'svg'
  // * moves the 'group' element to the top left margin
  var svg = d3
    .select("#barChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xAxisG = g
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  var yAxisG = g.append("g").attr("class", "y axis");

  yAxisG
    .append("text")
    .attr("class", "yAxisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", -60 - margin.left)
    .attr("x", 60 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("# of  Houses Flooded");

  g.append("text")
    .attr("class", "xAxisLabel")
    .attr("transform", "translate(" + (width / 2 - 80) + " ," + height + ")")
    .style("text-anchor", "middle")
    .text("Flood Zones");

  g.append("text")
    .attr("y", -80)
    .attr("x", 280)
    .attr("class", "title")
    .text("Flooded Houses in Each Flood Zone");
  // * Format the data
  data.forEach(function (d) {
    d.Flood_Area = d.Flood_Area;
    d.Count = +d.Count;
  });
  // console.log(data)

  // * Scale the range of the data in the domains
  x3.domain(
    data.map(function (d) {
      return d.Flood_Area;
    })
  );
  y3.domain([
    0,
    d3.max(data, function (d) {
      return d.Count;
    }) + 2,
  ]);

  // * append the rectangles for the bar chart
  var bar = svg.selectAll(".bar").data(data);

  var bar1 = bar
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x3(d.Flood_Area);
    })
    .attr("width", x3.bandwidth())
    .attr("y", function (d) {
      return y3(d.Count);
    })
    .attr("height", function (d) {
      return height - y3(d.Count);
    })
    .attr("fill", function (d) {
      return colorScale(d.Flood_Area);
    });

  // * add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x3).tickSizeOuter(0))
    .selectAll("text")
    .attr("class", "floodedHouses_xAxis_tickLabel");

  // * add the y Axis
  svg.append("g").call(d3.axisLeft(y3).ticks(5).tickSize(-width));

  // * Adding Tooltip Behavior
  bar1
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", "#ce42f5");
      d3.select("#tool_tip").text(" " + d.Count);

      //* Position the tooltip <div> and set its content
      let x = event.pageX;
      let y = event.pageY;

      //* Position tooltip and make it visible
      d3.select("#tooltip-bar")
        .style("left", x + "px")
        .style("top", y + "px")
        .style("opacity", 1);
    })

    .on("mouseout", function () {
      d3.select(this).style("fill", function (d) {
        return colorScale(d.Flood_Area);
      });

      //* Hide the tooltip
      d3.select("#tooltip-bar").style("opacity", "0");
    });
});
