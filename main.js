/* a freeCodeCamp data visualization project, created using D3.js along with Bootstrap. */

// ************declare global variables***************
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

const margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
  }

const width = 920 - margin.left - margin.right

// const width = 1200 - margin.left - margin.right

const height = 630 - margin.top - margin.bottom

// const height = 850 - margin.top - margin.bottom

const timeFormat = d3.timeFormat("%M:%S")

const color = d3.scaleOrdinal(d3.schemeCategory10)

const x = d3.scaleLinear()
  // .domain([0, d3.max(data, (d) => d[0])])
  .range([0, width])

const y = d3.scaleLinear()
  // .domain([0, d3.max(data, (d) => d[1])])
  .range([0, height])

const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))

const yAxis = d3.axisLeft(y).tickFormat(timeFormat)

// div for tooltip
const div = d3.select(".chart-div")
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0)

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "graph")
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

let parsedTime

// *****************JSON REQUEST*******************
d3.json(url, function(error, data) {
  if (error) throw error

  data.forEach(function(d) {
    d.Place = +d.Place
    parsedTime = d.time.split(":")
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]))
  })

  x.domain([d3.min(data, function(d) {
    return d.Year - 1
  }),
    d3.max(data, function(d) {
      return d.Year + 1
    })
  ])

  y.domain(d3.extent(data, function(d) {
    return d.Time
  }))

  // X-axis
  svg.append("g")
    .attr("class", "x-axis")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Year")

  // Y-axis
  svg.append("g")
    .attr("class", "y-axis")
    .attr("id", "y-axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .style("text-anchor", "end")
    .text("Best Time (minutes)")

  // Y-axis text
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -160)
    .attr("y", -44)
    .style("font-size", 18)
    .text("time in Minutes")

  // scatterplot dots
  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 8)
    .attr("cx", function(d) {
      return x(d.Year)
    })
    .attr("cy", function(d) {
      return y(d.Time)
    })
    .attr("data-xvalue", function(d) {
      return d.Year
    })
    .attr("data-yvalue", function(d) {
      return d.Time.toISOString()
    })
    .style("fill", function(d) {
      return color(d.Doping != "")
    })
    // tooltips
    .on("mouseover", function(d) {
      div.style("opacity", 0.9)
      div.attr("data-year", d.Year)
      div.html(d.Name + ": " + d.Nationality + "<br>Year: " + d.Year + ", Time: " + timeFormat(d.Time) + (d.Doping?"<br><br>" + d.Doping:""))
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
    })
    .on("mouseout", function(d) {
      div.style("opacity", 0)
    })

  // title
  svg.append("text")
    .attr("id", "title")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .text("Doping in Professional Bicycle Racing")

  // subtitle
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2) + 25)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .text("35 fastest times up Alpe d'Huez")

  // graph legend
  const legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + (height / 2 - i * 20) + ")"
    })

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color)

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .style("text-anchor", "end")
    .text(function(d) {
      if (d) {
        return "Riders with doping allegations"
      } else {
        return "Riders with no doping allegations"
      }
    })

}) // end of d3.json()






// ********************CODE FROM A FREECODECAMP TUTORIAL********************
// const dataset = [
//                   [ 34,     78 ],
//                   [ 109,   280 ],
//                   [ 310,   120 ],
//                   [ 79,   411 ],
//                   [ 420,   220 ],
//                   [ 233,   145 ],
//                   [ 333,   96 ],
//                   [ 222,    333 ],
//                   [ 78,    320 ],
//                   [ 21,   123 ]
//                 ];
//
// const w = 700;
// const h = 700;
// const padding = 80;
//
// const xScale = d3.scaleLinear()
//                   .domain([0, d3.max(dataset, (d) => d[0])])
//                   .range([padding, w - padding]);
//
// const yScale = d3.scaleLinear()
//                   .domain([0, d3.max(dataset, (d) => d[1])])
//                   .range([h - padding, padding]);
//
// const svg = d3.select("#chart")
//               .append("svg")
//               .attr("width", w)
//               .attr("height", h);
//
// svg.selectAll("circle")
//     .data(dataset)
//     .enter()
//     .append("circle")
//     .attr("cx", (d) => xScale(d[0]))
//     .attr("cy", (d) => yScale(d[1]))
//     .attr("r", 5)
//
//
// svg.selectAll("text")
//     .data(dataset)
//     .enter()
//     .append("text")
//     .text((d) =>  (d[0] + ", "
// + d[1]))
//     // Add your code below this line
//     .attr("x", (d) => xScale(d[0] + 10))
//     .attr("y", (d) => yScale(d[1]))
//
// const xAxis = d3.axisBottom(xScale);
//
// const yAxis = d3.axisLeft(yScale)
//
//
// svg.append("g")
//     .attr("transform", "translate(0, " + (h - padding) + ")")
//     .call(xAxis);
//
//
// svg.append("g")
//     .attr("transform", "translate(0, " + (w - padding) + ")")
//     .call(yAxis)
//
// // Notice that the graph axes are dynamically generated (though the y-axis doesn't seem to be working)
