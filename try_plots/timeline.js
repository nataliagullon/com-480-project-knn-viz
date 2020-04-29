var chartDiv = document.getElementById("chart-container");

var margin = {
		    top: 10,
		    right: 40,
		    bottom: 10,
		    left: 60
		  },
		  width = chartDiv.clientWidth * 0.95,
		  height = chartDiv.clientHeight * 0.5,
		  contextHeight = 50;
		contextWidth = width;

/*
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */

// setup x
var xValue = function(d) {
	return d.Year;
}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom()
		.scale(xScale);

// setup y
var yValue = function(d) {
	if (d.Season == 'Summer'){
		return 2;
	} else {
		return -2;
	}
},
  	yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft();

// setup fill color
var cValue = function(d) { return d.Continent;},
    color = d3.scaleOrdinal(d3.schemeCategory10);

// add the graph canvas to the body of the webpage
var svg = d3.select("#my_timeline")
		.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("location_host_cities.csv", function(error, data) {
	console.log('heeere')
  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Year = +d.Year;
//    console.log(d);
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-10, d3.max(data, xValue)+10]);
  yScale.domain([-3, 3]);

	// try to draw lines
	svg.selectAll(".line")
		      .data(data)
		    .enter().append("line")
		      .attr("class", "line")
					.attr("x1", xMap)
		      .attr("x2", xMap)
					.attr("y1", height/2)
		      .attr("y2", yMap)
					.style("stroke", "rgb(159,159,159, 0.3)");

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height/2 + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");


	svg.append("g")
    .append("text")
      .attr("class", "label")
      .attr("y", 6)
      .attr("dy", ".71em")
			.attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("Summer");

	svg.append("g")
		 .append("text")
		 	.attr("class", "label")
		  .attr("y", height)
		  .attr("dy", ".71em")
			.attr("dx", ".71em")
		  .style("text-anchor", "end")
		  .text("Winter");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 6)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["City"] + ", " + d["Country"] + "<br/> Year "+ xValue(d))
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY ) + 10 + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(100)
               .style("opacity", 0);
      });



  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + -i*200 + ", " + height*1.2 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
});
