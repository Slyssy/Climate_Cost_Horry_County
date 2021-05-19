// Times Flooded Bar Chart>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Load the Data
d3.csv("/static/SurveyCostDataWithLatitudeAndLongitude.csv").then(function (
  csv
) {
  // *Parsing data to make it useable for chart
  let counts = {};
  csv.forEach(function (d) {
    let timesFloodedGroup = d.timesFlooded;
    if (counts[timesFloodedGroup] === undefined) {
      counts[timesFloodedGroup] = 1;
    } else {
      counts[timesFloodedGroup] = counts[timesFloodedGroup] + 1;
    }
  });
  csv.forEach(function (d) {
    let timesFloodedGroup = d.timesFlooded;
    d.count = counts[timesFloodedGroup];
  });

  console.log(counts);

  // Split the count object into an array of objects
  data = Object.keys(counts).map((k) => ({ group: k, count: counts[k] }));

  const sortOrder = [
    "1",
    "2 to 3",
    "4 to 5",
    "6 to 10",
    "11 to 15",
    "More than 20",
  ];
  data.sort((a, b) => sortOrder.indexOf(a.group) - sortOrder.indexOf(b.group));

  console.log(data);

  var width = 1080;
  height = 393;
  margin = { left: 100, top: 70, right: 30, bottom: 85 };

  // Setting the ranges
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);
  var color = d3
    .scaleOrdinal()
    .range(["#ed5151", "#149ece", "#3caf99", "#004c73", "#fc921f"]);

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

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3
    .select("#timesFlooded")
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

  g.append("text")
    .attr("class", "xAxisLabel")
    .attr("transform", "translate(" + width / 2 + " ," + height + ")")
    .style("text-anchor", "middle")
    .text("Number of Reported Flood Events");

  var yAxisG = g.append("g").attr("class", "y axis");

  yAxisG
    .append("text")
    .attr("class", "yAxisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", -60 - margin.left)
    .attr("x", 60 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("# of  Houses");

  g.append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", -20 - margin.top)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text("Reported Flood Events");

  // Scale the range of the data in the domains
  x.domain(
    data.map(function (d) {
      return d.group;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.count;
    }) + 2,
  ]);

  // append the rectangles for the bar chart
  var bar = svg.selectAll(".bar").data(data);

  var bar1 = bar
    .enter()
    .append("rect")
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

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .attr("class", "timesFlooded_xAxis_tickLabel");

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y).ticks(5).tickSize(-1080));

  // Adding Tooltip Behavior
  bar1
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", "#ce42f5");
      d3.select("#tool_tip_timesFlooded_group").text(" " + d.group);
      d3.select("#tool_tip_timesFlooded_count").text(" " + d.count);

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
    });
});
