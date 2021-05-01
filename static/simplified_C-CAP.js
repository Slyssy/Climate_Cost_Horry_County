// * Start Bar Chart
d3.csv("/static/Simplified_C-CAP_Scheme.csv").then((d) => chart(d));

function chart(csv) {
  var keys = csv.columns.slice(5);
  console.log(keys);

  var ccap = [...new Set(csv.map((d) => d.C_CAP))];
  console.log(ccap);
  var svg = (svg = d3.select("#chart")),
    margin = { top: 35, left: 35, bottom: 0, right: 15 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  var y = d3
    .scaleBand()
    .range([margin.top, height - margin.bottom])
    .padding(0.1)
    .paddingOuter(0.2)
    .paddingInner(0.2);

  var x = d3.scaleLinear().range([margin.left, width - margin.right]);

  var yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis");

  var xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${margin.top})`)
    .attr("class", "x-axis");

  var z = d3.scaleOrdinal().range(["steelblue", "darkorange"]).domain(keys);

  function update(input, speed) {
    data.forEach(function (d) {
      d.total = d3.sum(keys, (k) => +d[k]);
      return d;
    });

    x.domain([0, d3.max(data, (d) => d.total)]).nice();

    svg
      .selectAll(".x-axis")
      .transition()
      .duration(speed)
      .call(d3.axis(x).ticks(null, "s"));

    data.sort(
      d3.select("#sort").property("checked")
        ? (a, b) => b.total - a.total
        : (a, b) => ccap.indexOf(a.C_CAP) - ccap.indexOf(b.C_CAP)
    );

    y.domain(data.map((d) => d.C_CAP));

    svg
      .selectAll(".y-axis")
      .transition()
      .duration(speed)
      .call(d3.axisLeft(y).tickSizeOuter(0));

    var group = svg
      .selectAll("g.layer")
      .data(d3.stack().keys(keys)(data), (d) => d.key);

    group.exit().remove();

    group
      .enter()
      .insert("g", ".y-axis")
      .append("g")
      .classed("layer", true)
      .attr("fill", (d) => z(d.key));

    var bars = svg
      .selectAll("g.layer")
      .selectAll("rect")
      .data(
        (d) => d,
        (e) => e.data.C_CAP
      );

    bars.exit().remove();

    bars
      .enter()
      .append("rect")
      .attr("height", y.bandwidth())
      .merge(bars)
      .transition()
      .duration(speed)
      .attr("y", (d) => y(d.data.C_CAP))
      .attr("x", (d) => x(d[0]))
      .attr("width", (d) => x(d[1]) - x(d[0]));

    var text = svg.selectAll(".text").data(data, (d) => d.C_CAP);

    text.exit().remove();

    text
      .enter()
      .append("text")
      .attr("class", "text")
      .attr("text-anchor", "start")
      .merge(text)
      .transition()
      .duration(speed)
      .attr("y", (d) => y(d.C_CAP) + y.bandwidth() / 2)
      .attr("x", (d) => x(d.total) + 5)
      .text((d) => d.total);
  }

  var checkbox = d3.select("#sort").on("click", function () {
    update(select.property("value"), 750);
  });
}
