"use strict";
// Parse the Data
d3.csv("/static/Simplified_C-CAP_Scheme.csv").then(function (data) {
  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(5);
  console.log(subgroups);

  // *Grabbing CCAP Groups from CSV Column to be used on X Axis
  let groups = [...new Set(data.map((d) => d.C_CAP))];

  // var groups = d3
  //   .map(data, function (d) {
  //     return d.C_CAP;
  //   })
  //   .keys();
  console.log(groups);

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

  // set the dimensions and margins of the graph
  var margin = { top: 40, right: 80, bottom: 315, left: 100 },
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#my_dataviz_vert")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("class", "xAxisText")
    .attr("y", 0)
    .attr("x", -10)
    .attr("dy", ".35em")
    .attr("transform", "rotate(270)")
    .style("text-anchor", "end");
  // Add Y axis
  var y = d3.scaleLinear().domain([0, 300]).range([height, 0]);
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

  // Another scale for subgroup position?
  var xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  svg
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text("Land Usage 1996 vs 2016");

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal().domain(subgroups).range(["#aec7e8", "#1f76b4"]);

  // TODO Starting modifications for tooltip here
  var tooltip = d3
    .select("#my_dataviz_vert")
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
  // var mouseover = function (d) {
  //   d3.select(this).style("fill", "#ce42f5");
  //   var year = d.key;
  //   var coverage = d.value;
  //   console.log(year);
  //   console.log(coverage);

  // tooltip
  //   .html(
  //     "Year: " +
  //       year +
  //       "<br>" +
  //       "Land Coverage: " +
  //       coverage +
  //       " Square Miles"
  //   )
  //     .style("opacity", 1);
  // };
  // var mousemove = function (d) {
  //   tooltip
  //     .style("left", d3.event.pageX + 10 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
  //     .style("top", d3.event.pageY + 10 + "px");
  // };
  var mouseleave = function (d) {
    d3.select(this).style("fill", function (d) {
      return color(d.key);
    });
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
    .on("mouseover", function (event, d, i) {
      tooltip
        .html(
          `<div>Year: ${d.key}</div><div>Land Coverage: ${d.value} Square Miles</div>`
        )
        .style("opacity", "1");
      d3.select(this).transition().attr("fill", "#ce42f5").duration(100);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function (event) {
      d3.select(this)
        .transition()
        .attr("fill", function (d) {
          return color(d.key);
        });
      tooltip.style("opacity", 0);
    });

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
