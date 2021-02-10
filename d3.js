console.log("Hello World!")
var outerWidth = 960;
var outerHeight = 500;
var margin = { left: 90, top: 16, right: 30, bottom: 85 };
var barPadding = 0.2;

var xColumn = "Flood_Area";
var yColumn = "Count";
var colorColumn = "Flood_Area";

var innerWidth  = outerWidth  - margin.left - margin.right;
var innerHeight = outerHeight - margin.top  - margin.bottom;

var svg = d3.select("#barChart").append("svg")
    .attr("width",  outerWidth)
    .attr("height", outerHeight);
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var xAxisG = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + innerHeight + ")");
var yAxisG = g.append("g")
    .attr("class", "y axis");

var xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);
var yScale = d3.scale.linear().range([innerHeight, 0]);
var colorScale =  d3.scale.ordinal().range(["#a7c636", "#149ece", "#ed5151"]);

var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
    .outerTickSize(0);
var yAxis = d3.svg.axis().scale(yScale).orient("left")
    .ticks(5)
    // .tickFormat(customTickFormat)
    .outerTickSize(-960)
    .innerTickSize(-960);

    function render(data){

        xScale.domain(       data.map( function (d){ return d[xColumn]; }));
        yScale.domain([0, d3.max(data, function (d){ return d[yColumn]; })]);
        colorScale.domain(data.map(function (d){ return d[colorColumn]; }));

        xAxisG
          .call(xAxis)
          .selectAll("text")  
          .attr("dx", "-0.4em")
          .attr("dy", "1.24em")
        //   .attr("transform", "rotate(-16)" );

        yAxisG.call(yAxis);

        var bars = g.selectAll("rect").data(data);
        bars.enter().append("rect")
          .attr("width", xScale.rangeBand());
        bars
          .attr("x", function (d){ return xScale(d[xColumn]); })
          .attr("y", function (d){ return yScale(d[yColumn]); })
          .attr("height", function (d){ return innerHeight - yScale(d[yColumn]); })
          .attr("fill", function (d){ return colorScale(d[colorColumn]); });
        bars.exit().remove();

      //   g.selectAll(".text")
      //     .data(data)
      //     .enter()
      //     .append("text")
      //     .attr("class","label")
      //     .attr("x", (function(d) { return xScale(xColumn); }  ))
      //     .attr("y", function(d) { return yScale(yColumn) - 20; })
      //     .attr("dy", ".75em")
      //     .text(function(d) { return yColumn; })
      }

      function type(d){
        d.Count = +d.Count;
        return d;
      }

      d3.csv("Flood_Area_Count.csv", type, render);