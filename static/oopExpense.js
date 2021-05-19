// *Out of Pocket Expense>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Load the Data
// d3.csv("/static/SurveyCostDataWithLatitudeAndLongitude.csv").then(function (
//   data
// ) {
//   // Format the data
//   var countOOPExpense = {};

//   data.forEach(function (d) {
//     // d.OOP_Expense = d.OOP_Expense;
//     d.Count_OOP_Expense = +d.Count_OOP_Expense;
//   });
//   // console.log(data1)
//   var margin = { top: 60, right: 80, bottom: 130, left: 80 },
//     width = 860 - margin.left - margin.right,
//     height = 800 - margin.top - margin.bottom;

//   // * append the svg object to the body of the page
//   // * append a 'group' element to 'svg'
//   // * moves the 'group' element to the top left margin
//   var svg = d3
//     .select("#outOfPocketExpense")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   var g = svg
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   var xDomain = d3.map(data, function (d) {
//     return d.OOP_Expense;
//   });

//   var yDomain = [
//     0,
//     d3.max(data, function (d) {
//       return d.Count_OOP_Expense;
//     }) + 2,
//   ];

//   // Setting the ranges
//   var x = d3.scaleBand().domain(xDomain).range([0, width]).padding(0.1);
//   // add the x Axis
//   xAxis = svg
//     .append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).tickSizeOuter(0));

//   //  *Adjusting xAxis Tick Labels
//   xAxis
//     .selectAll("text")
//     .attr("class", "oop_xAxis_tickLabel")
//     .attr("y", 0)
//     .attr("x", -8)
//     .attr("dy", ".35em")
//     .attr("transform", "rotate(300)")
//     .style("text-anchor", "end");

//   var y = d3.scaleLinear().domain(yDomain).range([height, 0]);
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
//     ]);

//   //   .attr("class", "x axis")
//   //   .attr("transform", "translate(0," + height + ")");

//   var yAxisG = svg.append("g").attr("class", "y axis");

//   yAxisG
//     .append("text")
//     .attr("class", "yAxisLabel")
//     .attr("transform", `rotate(-90)`)
//     .attr("y", 0 - margin.left + 30)
//     .attr("x", 0 - height / 2)
//     .attr("dy", "1em")
//     .style("text-anchor", "middle")
//     .text("# of  Houses");

//   g.append("text")
//     .attr("class", "xAxisLabel")
//     .attr("x", width / 2 - 80)
//     .attr("y", height + margin.bottom - 65)
//     .style("text-anchor", "middle")
//     .text("Out of Pocket Expense");

//   g.append("text")
//     .attr("y", -80)
//     .attr("x", 125)
//     .attr("class", "title")
//     .text("Reported Out of Pocket Expense");

//   // append the rectangles for the bar chart
//   var bar = svg.selectAll(".bar").data(data);

//   var bar1 = bar
//     .enter()
//     .append("rect")
//     .attr("class", "bar")
//     .attr("x", function (d) {
//       return x(d.OOP_Expense);
//     })
//     .attr("width", x.bandwidth())
//     .attr("y", function (d) {
//       return y(d.Count_OOP_Expense);
//     })
//     .attr("height", function (d) {
//       return height - y(d.Count_OOP_Expense);
//     })
//     .attr("fill", function (d) {
//       return colorScale(d.OOP_Expense);
//     });

//   // add the y Axis
//   svg.append("g").call(d3.axisLeft(y).ticks(5).tickSize(-width));

//   // Adding Tooltip Behavior
//   bar1
//     .on("mouseover", function (event, d) {
//       d3.select(this).style("fill", "#ce42f5");
//       d3.select("#tool_tip_oop").text(" " + d.Count_OOP_Expense);

//       //Position the tooltip <div> and set its content
//       let x = event.pageX;
//       let y = event.pageY;

//       //Position tooltip and make it visible
//       d3.select("#tooltip-bar-oop")
//         .style("left", x + "px")
//         .style("top", y + "px")
//         .style("opacity", 1);
//     })

//     .on("mouseout", function () {
//       d3.select(this).style("fill", function (d) {
//         return colorScale(d.OOP_Expense);
//       });

//       //Hide the tooltip
//       d3.select("#tooltip-bar-oop").style("opacity", "0");
//     });
// });

// ! Horizontal Bar Chart Starts Here
d3.csv("/static/SurveyCostDataWithLatitudeAndLongitude.csv").then((csv) => {
  // *Parsing data to make it useable for chart
  let counts = {};
  csv.forEach(function (d) {
    let oopGroup = d.OOPExpenses;
    if (counts[oopGroup] === undefined) {
      counts[oopGroup] = 1;
    } else {
      counts[oopGroup] = counts[oopGroup] + 1;
    }
  });
  csv.forEach(function (d) {
    let expGroup = d.OOPExpenses;
    d.count = counts[expGroup];
  });

  console.log(counts);

  // Split the count object into an array of objects
  data = Object.keys(counts).map((k) => ({ group: k, count: counts[k] }));

  const sortOrder = [
    "Less than $500",
    "$500 to $1,000",
    "$1,000 to $5,000",
    "$5,000 to $10,000",
    "$10,000 to $30,000",
    "$30,000 to $50,000",
    "$50,000 to $70,000",
    "$70,000 to $100,000",
    "$100,000 to $150,000",
    "$150,000 to $200,000",
    "$250,000 to $300,000",
  ];
  data.sort((b, a) => sortOrder.indexOf(a.group) - sortOrder.indexOf(b.group));

  console.log(data);

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
  let margin = { top: 60, right: 80, bottom: 60, left: 165 },
    width = 1200 - margin.left - margin.right,
    height = 548 - margin.top - margin.bottom;

  // *Appending the svg to the DOM
  let svg = d3
    .select("#outOfPocketExpense")
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
      return d.count + 2;
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
    .text("Out of Pocket Expense");

  // * Adding Chart Title
  svg
    .append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text("# of Households Grouped by Reported Out of Pocket Expense");

  var tooltip = d3
    .select("#outOfPocketExpense")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

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
      d3.select("#tool_tip_oop_group").text(" " + d.group);
      d3.select("#tool_tip_oop_count").text(" " + d.count);

      //Position the tooltip <div> and set its content
      let x = event.pageX;
      let y = event.pageY;

      //Position tooltip and make it visible
      d3.select("#tooltip-bar-oop")
        .style("left", x + "px")
        .style("top", y + "px")
        .style("opacity", 1);
    })

    .on("mouseout", function () {
      d3.select(this).style("fill", function (d) {
        return color(d.group);
      });

      //Hide the tooltip
      d3.select("#tooltip-bar-oop").style("opacity", "0");
    });
});
