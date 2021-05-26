// const stations = [
//     "CONWAY, SC US",
//     "CONWAY 6.2 E, SC US",
//     "MYRTLE BEACH 8.6 SW, SC US",
//     "MYRTLE BEACH 9.1 WSW, SC US",
//     "LORIS 2.9 WSW, SC US",
//     "MYRTLE BEACH 9.2 WSW, SC US",
//     "MURRELLS INLET 1.7 N, SC US",
//     "MYRTLE BEACH 2.4 ENE, SC US",
//     "MYRTLE BEACH 7.4 NNW, SC US",
//     "MURRELLS INLET 4.0 NE, SC US",
//     "MYRTLE BEACH 5.0 WNW, SC US",
//     "MYRTLE BEACH 4.8 NNW, SC US",
//     "LORIS 1.4 ENE, SC US",
//     "NORTH MYRTLE BEACH, SC US"
// ]

// d3.csv("/static/Horry_County_Precipitation.csv").then((d) => chart(d));

// function chart(csv) {
//   csv.forEach(function (d) {
//     d.DATE = d.DATE;
//     d.PRCP = +d.PRCP;
//     return d;
//   });

//   const years = csv
//     .map((a) => a.DATE)
//     .filter((value, index, self) => self.indexOf(value) === index);
//   years.sort(function (a, b) {
//     return b - a;
//   });
//   // console.log(years)

//   d3.select("#year")
//     .selectAll("option")
//     .data(years)
//     .enter()
//     .append("option")
//     .text((d) => d);

//   var svg = d3.select("#precipitation_barchart"),
//     margin = { top: 70, right: -35, bottom: 80, left: 110 },
//     width = +svg.attr("width") - margin.left - margin.right,
//     height = +svg.attr("height") - margin.top - margin.bottom;

//   // Setting x Scale
//   const x = d3
//     .scaleBand()
//     .range([margin.left, width - margin.right])
//     .padding(0.1)
//     .paddingOuter(0.2);

//   var y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

//   var colorScale = d3
//     .scaleOrdinal()
//     .range([
//       "#ed5151",
//       "#149ece",
//       "#3caf99",
//       "#004c73",
//       "#fc921f",
//       "#a8a800",
//       "#f789d8",
//       "#732600",
//       "#ff00c5",
//       "#9e559c",
//       "#a7c636",
//       "#7f7f7f",
//       "#6b6bd6",
//       "#a87000",
//     ]);

//   var xAxis = (g) =>
//     g
//       .attr("transform", "translate(0," + (height - margin.bottom) + ")")
//       .call(d3.axisBottom(x).tickSizeOuter(0))
//       .selectAll("text")
//       .attr("class", "yAxisAnnualLabels")
//       .attr("y", 0)
//       .attr("x", -10)
//       .attr("dy", ".35em")
//       .attr("transform", "rotate(300)")
//       .style("text-anchor", "end");

//   var yAxis = (g) =>
//     g
//       .attr("transform", "translate(" + margin.left + ",0)")
//       .call(d3.axisLeft(y).ticks(5).tickSize(-width));

//   svg.append("g").attr("class", "x-axis");

//   svg
//     .append("g")
//     .attr("class", "y-axis")
//     .append("text")
//     .attr("class", "yAxisPRCP")
//     .attr("y", 80 - margin.left)
//     .attr("x", 0 - height / 2)
//     .attr("transform", `rotate(-90)`)
//     .style("text-anchor", "middle")
//     .text("Precipitation (in)");

//   svg
//     .append("text")
//     .attr("y", 35)
//     .attr("x", 110)
//     .attr("class", "title")
//     .text("Annual Precipitation Totals");

//   update(d3.select("#year").property("value"), 0);

//   function update(year, speed) {
//     var data = csv.filter((d) => d.DATE == year);
//     // console.log(data);
//     y.domain([0, d3.max(data, (d) => d.PRCP)]).nice();

//     svg.selectAll(".y-axis").transition().duration(speed).call(yAxis);

//     data.sort(
//       d3.select("#sort").property("checked")
//         ? (a, b) => b.PRCP - a.PRCP
//         : (a, b) => a.NAME - b.NAME
//     );
//     // console.log(data)

//     x.domain(data.map((d) => d.NAME));

//     svg.selectAll(".x-axis").transition().duration(speed).call(xAxis);

//     var bar = svg.selectAll(".bar").data(data, (d) => d.NAME);

//     bar.exit().remove();

//     var bar1 = bar
//       .enter()
//       .append("rect")
//       .attr("class", "bar")
//       .style("fill", function (d) {
//         return colorScale(d.NAME);
//       })
//       .attr("opacity", ".5")
//       .attr("width", x.bandwidth())
//       .attr("height", (d) => y(0) - y(d.PRCP));

//     bar1
//       .merge(bar)
//       .transition()
//       .duration(speed)
//       .attr("x", (d) => x(d.NAME))
//       .attr("y", (d) => y(d.PRCP))
//       .attr("width", x.bandwidth())
//       .attr("height", (d) => y(0) - y(d.PRCP));

//     // Adding Tooltip Behavior
//     bar1
//       .on("mouseover", function (event, d) {
//         d3.select(this).style("fill", "#ce42f5");
//         d3.select("#stationName").text(" " + d.NAME);
//         d3.select("#annualPrecipitation").text(" " + d.PRCP + " inches");

//         //Position the tooltip <div> and set its content
//         let x = event.pageX;
//         let y = event.pageY;

//         //Position tooltip and make it visible
//         d3.select("#tooltip")
//           .style("left", x + "px")
//           .style("top", y + "px")
//           .style("opacity", 1);
//       })

//       .on("mouseout", function () {
//         d3.select(this).style("fill", function (d) {
//           return colorScale(d.NAME);
//         });

//         //Hide the tooltip
//         d3.select("#tooltip").style("opacity", "0");
//       });
//   }
//   chart.update = update;
// }

// var select1 = d3
//   .select("#year")
//   .style("border-radius", "5px")
//   .on("change", function () {
//     chart.update(this.value, 750);
//   });

// var checkbox = d3
//   .select("#sort")
//   .style("margin-left", "30%")
//   .on("click", function () {
//     chart.update(select1.property("value"), 750);
//   });

// ! Start Horizontal Chart
d3.csv("/static/Horry_County_Precipitation.csv").then((d) => chart(d));

function chart(csv) {
  csv.forEach(function (d) {
    d.DATE = d.DATE;
    d.PRCP = +d.PRCP;
    return d;
  });

  const years = csv
    .map((a) => a.DATE)
    .filter((value, index, self) => self.indexOf(value) === index);
  years.sort(function (a, b) {
    return b - a;
  });
  // console.log(years)

  d3.select("#year")
    .selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .text((d) => d);

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

  // *Set dimensions and margins for chart
  let margin = { top: 60, right: 80, bottom: 50, left: 380 },
    width = 1200 - margin.left - margin.right,
    height = 548 - margin.top - margin.bottom;

  var svg = d3
    .select("#precipitation_barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // Setting x Scale
  const x = d3.scaleLinear().range([0, width]);

  var y = d3.scaleBand().range([0, height]).padding(0.2).paddingOuter(0.1);

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
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0).tickSize(-height))
      .selectAll("text")
      .attr("class", "yAxisAnnualLabels")
      .selectAll("text")
      .attr("transform", "translate(0,0)")
      .style("text-anchor", "middle");

  // *Adding X Axis Label
  svg
    .append("text")
    .attr("class", "xAxisLabel")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.bottom - 5) + ")"
    )
    .style("text-anchor", "middle")
    .text("Precipitation (in)");

  // *Adding Y Axis Label
  svg
    .append("text")
    .attr("class", "yAxisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Weather Station Name");

  var yAxis = (g) => g.call(d3.axisLeft(y).tickSize(0));

  svg.append("g").attr("class", "x-axis");

  svg
    .append("g")
    .attr("class", "y-axis")
    .append("text")
    .attr("class", "yAxisPRCP")
    .attr("y", 80 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("transform", `rotate(-90)`)
    .style("text-anchor", "middle");

  svg
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text("Annual Precipitation Totals");

  update(d3.select("#year").property("value"), 0);

  function update(year, speed) {
    var data = csv.filter((d) => d.DATE == year);
    // console.log(data);
    x.domain([0, d3.max(data, (d) => d.PRCP + 1)]).call((g) =>
      g.select(".domain").remove()
    );

    svg.selectAll(".x-axis").transition().duration(speed).call(xAxis);

    data.sort(
      d3.select("#sort").property("checked")
        ? (a, b) => b.PRCP - a.PRCP
        : (a, b) => a.NAME - b.NAME
    );
    // console.log(data)

    y.domain(data.map((d) => d.NAME));

    svg.selectAll(".y-axis").transition().duration(speed).call(yAxis);

    var bar = svg.selectAll(".bar").data(data, (d) => d.NAME);

    bar.exit().remove();

    var bar1 = bar
      .enter()
      .append("rect")
      .attr("class", "bar")
      .style("fill", function (d) {
        return colorScale(d.NAME);
      })
      .attr("opacity", ".5")
      .attr("height", y.bandwidth())
      .attr("width", (d) => x(d.PRCP));

    bar1
      .merge(bar)
      .transition()
      .duration(speed)
      .attr("y", (d) => y(d.NAME))
      .attr("x", x(0))
      .attr("height", y.bandwidth())
      .attr("width", (d) => x(d.PRCP));

    // Adding Tooltip Behavior
    bar1
      .on("mouseover", function (event, d) {
        d3.select(this).style("fill", "#ce42f5");
        d3.select("#stationName").text(" " + d.NAME);
        d3.select("#annualPrecipitation").text(" " + d.PRCP + " inches");

        //Position the tooltip <div> and set its content
        let x = event.pageX;
        let y = event.pageY;

        //Position tooltip and make it visible
        d3.select("#tooltip")
          .style("left", x + "px")
          .style("top", y + "px")
          .style("opacity", 1);
      })

      .on("mouseout", function () {
        d3.select(this).style("fill", function (d) {
          return colorScale(d.NAME);
        });

        //Hide the tooltip
        d3.select("#tooltip").style("opacity", "0");
      });
  }
  chart.update = update;
}

var select1 = d3
  .select("#year")
  .style("border-radius", "5px")
  .on("change", function () {
    chart.update(this.value, 750);
  });

const annualCheckbox = d3
  .select("#sort")
  .style("margin-left", "30%")
  .on("click", function () {
    chart.update(select1.property("value"), 750);
  });
