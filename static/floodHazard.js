d3.csv("/static/FOIA_flood_data_NOAA.csv").then((csv) => {
  // *Parsing data to determine how many homes that are and are not in flood hazard zones have reported flooding events
  let countsFloodHazard = {};

  csv.forEach(function (d) {
    let floodHazard = d.Flood_Hazard_Zone;
    if (d.Times_Flooded != 0) {
      if (countsFloodHazard[floodHazard] === undefined) {
        countsFloodHazard[floodHazard] = 1;
      } else {
        countsFloodHazard[floodHazard] = countsFloodHazard[floodHazard] + 1;
      }
    }
  });

  countsFloodHazard = {
    floodZoneType: "NOAA Hazard Zone",
    ...countsFloodHazard,
  };
  // countsFloodHazard.floodZoneType = "NOAA Hazard Zone";
  console.log(countsFloodHazard);

  // * Determining how many homes that are in a Flood Zone that have reported at least one flood event
  let countsFloodZone = {};

  csv.forEach(function (d) {
    let floodZone = d.In_Flood_Zone;
    if (d.Times_Flooded != 0) {
      if (countsFloodZone[floodZone] === undefined) {
        countsFloodZone[floodZone] = 1;
      } else {
        countsFloodZone[floodZone] = countsFloodZone[floodZone] + 1;
      }
    }
  });

  countsFloodZone = {
    floodZoneType: "FEMA Flood Zone",
    ...countsFloodZone,
  };
  // countsFloodZone.floodZoneType = "FEMA Flood Zone";
  console.log(countsFloodZone);

  const data = [countsFloodHazard, countsFloodZone];
  console.log(data);

  let subgroups = ["Yes", "No"];
  console.log(subgroups);

  let groups = [...new Set(data.map((d) => d.floodZoneType))];
  console.log(groups);

  // * Functions to make the svg Responsive
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
    .select("#floodHazardChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleBand().range([0, width]).padding([0.2]);
  x.domain(groups);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("class", "xAxisText")
    .attr("y", 20)
    .attr("x", 0)
    .attr("dy", ".35em")
    .attr("transform", "rotate(0)")
    .style("text-anchor", "middle");
  // Add Y axis
  var y = d3.scaleLinear().domain([0, 1000]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("class", "yAxisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Households");

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
    .text("NOAA Flood Hazard vs FEMA Flood Zone");

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal().domain(subgroups).range(["#aec7e8", "#1f76b4"]);

  // TODO Starting modifications for tooltip here
  var tooltip = d3
    .select("#floodHazardChart")
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
      return "translate(" + x(d.floodZoneType) + ",0)";
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
        .html(`<div>Number of Households ${d.key}: <b>${d.value}<b></div>`)
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

  var legenText = ["Yes", "No"];

  var legend = svg
    .selectAll(".legend")
    .data(legenText.slice())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      return "translate(0," + i * 30 + ")";
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
      return legenText[i];
    });
});
