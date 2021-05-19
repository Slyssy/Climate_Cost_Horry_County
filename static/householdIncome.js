// *Household Income>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// var width = 1080;
// height = 393;
// margin = { left: 90, top: 70, right: 150, bottom: 160 };

// // Setting the ranges
// var x3 = d3.scaleBand().range([0, width]).padding(0.1);
// var y3 = d3.scaleLinear().range([height, 0]);
// var colorScale3 = d3
//   .scaleOrdinal()
//   .range([
//     "#ed5151",
//     "#149ece",
//     "#3caf99",
//     "#004c73",
//     "#fc921f",
//     "#a8a800",
//     "#f789d8",
//     "#732600",
//     "#ff00c5",
//     "#9e559c",
//     "#a7c636",
//   ]);

// // * append the svg object to the body of the page
// // * append a 'group' element to 'svg'
// // * moves the 'group' element to the top left margin
// var svg3 = d3
//   .select("#householdIncome")
//   .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var g = svg3
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var xAxisG = g
//   .append("g")
//   .attr("class", "x axis")
//   .attr("transform", "translate(0," + innerHeight + ")");

// var yAxisG = g.append("g").attr("class", "y axis");

// yAxisG
//   .append("text")
//   .attr("class", "yAxis-Label")
//   .attr("y", -140)
//   .attr("x", -200)
//   .attr("transform", `rotate(-90)`)
//   .attr("fill", "black")
//   .text("# of  Houses");

// g.append("text")
//   .attr("class", "xAxis-Label")
//   .attr("x", 320)
//   .attr("y", 480)
//   .text("Household Income");

// g.append("text")
//   .attr("y", -80)
//   .attr("x", 310)
//   .attr("class", "title")
//   .text("Reported Household Income");

// // Load the Data
// d3.csv("/static/SurveyCostDataWithLatitudeAndLongitude.csv").then(function (
//   data1
// ) {
//   // Format the data
//   data1.forEach(function (d) {
//     d.Household_Income = d.Household_Income;
//     d.Count_Household_Income = +d.Count_Household_Income;
//   });
//   // console.log(data1)

//   // Scale the range of the data in the domains
//   x3.domain(
//     data1.map(function (d) {
//       return d.Household_Income;
//     })
//   );
//   y3.domain([
//     0,
//     d3.max(data1, function (d) {
//       return d.Count_Household_Income;
//     }) + 2,
//   ]);

//   // append the rectangles for the bar chart
//   var bar = svg3.selectAll(".bar").data(data1);

//   var bar1 = bar
//     .enter()
//     .append("rect")
//     .attr("class", "bar")
//     .attr("x", function (d) {
//       return x3(d.Household_Income);
//     })
//     .attr("width", x3.bandwidth())
//     .attr("y", function (d) {
//       return y3(d.Count_Household_Income);
//     })
//     .attr("height", function (d) {
//       return height - y3(d.Count_Household_Income);
//     })
//     .attr("fill", function (d) {
//       return colorScale3(d.Household_Income);
//     });

//   // add the x Axis
//   svg3
//     .append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x3).tickSizeOuter(0))
//     .selectAll("text")
//     .attr("class", "oop_xAxis_tickLabel")
//     .attr("y", 0)
//     .attr("x", -8)
//     .attr("dy", ".35em")
//     .attr("transform", "rotate(300)")
//     .style("text-anchor", "end");
//   // add the y Axis
//   svg3.append("g").call(d3.axisLeft(y3).ticks(5).tickSize(-width));

//   // Adding Tooltip Behavior
//   bar1
//     .on("mouseover", function (event, d) {
//       d3.select(this).style("fill", "#ce42f5");
//       d3.select("#tool_tip_times_flooded").text(" " + d.Count_Household_Income);

//       //Position the tooltip <div> and set its content
//       let x = event.pageX;
//       let y = event.pageY;

//       //Position tooltip and make it visible
//       d3.select("#tooltip-bar-times-flooded")
//         .style("left", x + "px")
//         .style("top", y + "px")
//         .style("opacity", 1);
//     })

//     .on("mouseout", function () {
//       d3.select(this).style("fill", function (d) {
//         return colorScale3(d.Household_Income);
//       });

//       //Hide the tooltip
//       d3.select("#tooltip-bar-times-flooded").style("opacity", "0");
//     });
// });
// ! Horizontal Bar Chart Starts Here >>>>>>>>>>>>>>>>>>>
d3.csv("/static/SurveyCostDataWithLatitudeAndLongitude.csv").then((csv) => {
  console.log(csv);
  // *Parsing data to make it useable for chart
  let counts = {};
  csv.forEach(function (d) {
    let incomeGroup = d.householdIncome;
    if (counts[incomeGroup] === undefined) {
      counts[incomeGroup] = 1;
    } else {
      counts[incomeGroup] = counts[incomeGroup] + 1;
    }
  });
  csv.forEach(function (d) {
    let incomeGroup = d.householdIncome;
    d.count = counts[incomeGroup];
  });

  console.log(counts);

  // Split the count object into an array of objects
  data = Object.keys(counts).map((k) => ({ group: k, count: counts[k] }));

  const sortOrder = [
    "> $0 but less than $4,999",
    "$5,000 to $10,000",
    "$10,000 to $25,000",
    "$25,000 to $50,000",
    "$50,000 to $75,000",
    "$75,000 to $100,000",
    "$100,000 to $125,000",
    "$125,000 to $150,000",
    "$175,000 to $200,000",
    "Not Reported",
  ];
  data.sort((b, a) => sortOrder.indexOf(a.group) - sortOrder.indexOf(b.group));

  // console.log(data);

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
  let margin = { top: 60, right: 80, bottom: 60, left: 180 },
    width = 1200 - margin.left - margin.right,
    height = 548 - margin.top - margin.bottom;

  // *Appending the svg to the DOM
  let svg = d3
    .select("#householdIncome")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let color = d3
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
    ]);

  // *Adding X Axis
  let x = d3.scaleLinear().range([0, width]);
  x.domain([
    0,
    d3.max(data, function (d) {
      return d.count + 1;
    }),
  ]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height))
    .selectAll("text")
    .attr("transform", "translate(0,0)")
    .style("text-anchor", "middle");

  // *Adding X Axis Label
  svg
    .append("text")
    .attr("class", "xAxisLabel")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.bottom - 10) + ")"
    )
    .style("text-anchor", "middle")
    .text("# of Houses");

  // *Adding Y axis
  let y = d3
    .scaleBand()
    .range([0, height])
    .domain(
      data.map(function (d) {
        return d.group;
      })
    )
    .padding(0.1);
  svg.append("g").call(d3.axisLeft(y).tickSize(0));

  // *Adding Y Axis Label
  svg
    .append("text")
    .attr("class", "yAxisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Household Income");

  // * Adding Chart Title
  svg
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text("# of Households Grouped by Reported Annual Household Income");

  // var tooltip = d3
  //   .select("#householdIncome")
  //   .append("div")
  //   .style("opacity", 0)
  //   .attr("class", "tooltip")
  //   .style("position", "absolute")
  //   .style("background-color", "white")
  //   .style("border", "solid")
  //   .style("border-width", "1px")
  //   .style("border-radius", "5px")
  //   .style("padding", "10px");

  // *Adding Bars
  svg
    .selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", x(0))
    .attr("y", function (d) {
      return y(d.group);
    })
    .attr("width", function (d) {
      return x(d.count);
    })
    .attr("height", y.bandwidth())
    .attr("fill", function (d) {
      return color(d.group);
    })
    .on("mouseover", function (event, d) {
      d3.select(this).style("fill", "#ce42f5");
      d3.select("#tool_tip_income_group").text(" " + d.group);
      d3.select("#tool_tip_income_count").text(" " + d.count);

      //Position the tooltip <div> and set its content
      let x = event.pageX;
      let y = event.pageY;

      //Position tooltip and make it visible
      d3.select("#tooltip-bar-income")
        .style("left", x + "px")
        .style("top", y + "px")
        .style("opacity", 1);
    })

    .on("mouseout", function () {
      d3.select(this).style("fill", function (d) {
        return color(d.group);
      });

      //Hide the tooltip
      d3.select("#tooltip-bar-income").style("opacity", "0");
    });
});
