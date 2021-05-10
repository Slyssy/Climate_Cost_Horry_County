//Weather Station Totals
d3.csv("/static/Horry_County_Precipitation.csv").then((d) => chartTrend(d));

function chartTrend(csvTrends) {
  csvTrends.forEach(function (d) {
    d.DATE = d.DATE;
    d.PRCP = +d.PRCP;
    return d;
  });

  const weatherStation = csvTrends
    .map((a) => a.NAME)
    .filter((value, index, self) => self.indexOf(value) === index);
  weatherStation.sort(function (a, b) {
    return b - a;
  });
  // console.log(weatherStation);

  d3.select("#weatherStation")
    .selectAll("option")
    .data(weatherStation)
    .enter()
    .append("option")
    .text((d) => d);

  var svg = d3.select("#prcpTrends"),
    margin = { top: 70, right: -35, bottom: 20, left: 110 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  // .append("div")
  // .classed("svg-container", true)
  // .append("svg")
  // .attr("preserveAspectRatio", "xMinYMin meet")
  // .attr("viewBox", "0 0 1200 548")
  // .classed("prcpTrends", true)
  // .attr("width", 1200)
  // .attr("height", 548);

  //   Setting x Scale
  const x = d3
    .scaleBand()
    .range([margin.left, width - margin.right])
    .padding(0.1)
    .paddingOuter(0.2);

  var y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

  var colorScale = d3
    .scaleOrdinal()
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
      "#a7c636",
      "#7f7f7f",
      "#6b6bd6",
      "#a87000",
    ]);

  var xAxis = (g) =>
    g
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("class", "weatherStation_xAxis_tickLabels")
      .attr("y", 10)
      .attr("x", 0);

  var yAxis = (g) =>
    g
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y).ticks(5).tickSize(-width));

  svg.append("g").attr("class", "x-axis");

  svg
    .append("g")
    .attr("class", "y-axis")
    .append("text")
    .attr("class", "yAxisLabel")
    .attr("y", 0 - margin.left)
    .attr("x", -20 - height / 2)
    .attr("dy", "3em")
    .attr("transform", `rotate(-90)`)
    .style("text-anchor", "middle")
    .text("Precipitation (in)");

  // * Adding Chart Title
  svg
    .append("text")
    .attr("class", "title")
    .attr("x", 80 + width / 2)
    .attr("y", 70 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text("Weather Station Precipitation Totals");

  update(d3.select("#weatherStation").property("value"), 0);

  function update(name, speed) {
    var data = csvTrends.filter((d) => d.NAME == name);
    // console.log(data);
    y.domain([0, d3.max(data, (d) => d.PRCP)]).nice();

    svg.selectAll(".y-axis").transition().duration(speed).call(yAxis);

    data.sort(
      d3.select("#sortPRCP").property("checked")
        ? (a, b) => b.PRCP - a.PRCP
        : (a, b) => a.NAME - b.NAME
    );

    x.domain(data.map((d) => d.DATE));

    svg.selectAll(".x-axis").transition().duration(speed).call(xAxis);

    var bar = svg.selectAll(".bar").data(data, (d) => d.DATE);

    bar.exit().remove();

    var bar1 = bar
      .enter()
      .append("rect")
      .attr("class", "bar")
      .style("fill", "#149ece")
      .attr("opacity", ".5")
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.PRCP));

    bar1
      .merge(bar)
      .transition()
      .duration(speed)
      .attr("x", (d) => x(d.DATE))
      .attr("y", (d) => y(d.PRCP))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.PRCP));

    // Adding Tooltip Behavior
    bar1
      .on("mouseover", function (event, d) {
        d3.select(this).style("fill", "#ce42f5");
        d3.select("#stationName").text(" " + d.NAME);
        d3.select("#annualPrecipitationTrends").text(" " + d.PRCP + " inches");

        //Position the tooltip <div> and set its content
        let x = event.pageX;
        let y = event.pageY;

        //Position tooltip and make it visible
        d3.select("#tooltipTrends")
          .style("left", x + "px")
          .style("top", y + "px")
          .style("opacity", 1);
      })

      .on("mouseout", function () {
        d3.select(this).style("fill", "#149ece");

        //Hide the tooltip
        d3.select("#tooltipTrends").style("opacity", "0");
      });
  }
  chartTrend.update1 = update;
}

var select = d3
  .select("#weatherStation")
  .style("border-radius", "5px")
  .on("change", function () {
    chartTrend.update1(this.value, 750);
  });

var checkbox = d3
  .select("#sortPRCP")
  .style("margin-left", "1%")
  .on("click", function () {
    chartTrend.update1(select.property("value"), 750);
  });