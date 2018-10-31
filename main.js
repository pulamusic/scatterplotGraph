/*

A freeCodeCamp data visualization project, created using D3.js along with Bootstrap.

Please feel free to fork this code and use it in your own project.

*/

// ******************freeCodeCamp JSON data url**********************
url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// *******************************JSON CALL**********************************
d3.json(url).then(d => {

	let title,
		subtitle,
		xMin,
		xMax,
		yMin,
		yMax,
		xScale,
		xAxis,
		yScale,
		yAxis

	const margin = {
		top: 100,
		right: 30,
		bottom: 60,
		left: 80
	}

	const width = 1000
	const height = 700

	// **********************Time values for y-axis******************
	const getTime = (d) => {
		let [mm, ss] = d.Time.split(":").map(x => Number(x))
		let date = new Date()
		date.setMinutes(mm)
		date.setSeconds(ss)
		return date
	}

	// **********************Min and Max Values********************
	xMin = d3.min(d, (d) => d.Year)
	xMax = d3.max(d, (d) => d.Year)
	yMin = d3.min(d, (d) => getTime(d))
	yMax = d3.max(d, (d) => getTime(d))

	yMin.setSeconds(yMin.getSeconds() - 10)
	yMax.setSeconds(yMax.getSeconds() + 10)

	// *********************Tooltip information*********************
	let name = []
	let nationality = []
	let year = []
	let time = []
	let doping = []
	let url = []

	for (let i = 0; i < d.length; i++) {
		name.push(d[i].Name)
		nationality.push(d[i].Nationality)
		year.push(d[i].Year)
		time.push(d[i].Time)
		doping.push(d[i].Doping)
		url.push(d[i].URL)
	}

	// *******************Tooltip background**********************
	tooltip = d3.select("body")
		.append("div")
		.attr("id", "tooltip")
		.attr("class", "tooltip")
		.style("opacity", 0)
		.style("cursor", "pointer")

	// **********************Scatterplot background************************
	const scatterplot = d3.select('#chart')
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.style("background-color", "#c9cde0")
		.style("border-radius", "10px")
		.style("box-shadow", "5px 5px 5px rgba(0, 0, 0, 0.3)")
		.attr("opacity", 0.9)

	// **********************X-axis**********************
	xScale = d3.scaleLinear()
		.domain([xMin - 1, xMax + 1])
		.range([margin.left, width - margin.right])

	xAxisTicks = d3.axisBottom(xScale)
		.tickFormat(d3.format("d"))
		.ticks(10)

	const xAxisVertPosition = height - margin.bottom

	xAxis = d3.select("#chart svg")
		.append("g")
		.attr("id", "x-axis")
		.attr("transform", "translate(0, " + xAxisVertPosition + ")")
		.call(xAxisTicks)

	const xLabelVertPosition = width / 2
	const xLabelHoriPosition = height - 20

	xLabel = scatterplot.append("text")
		.attr("transform", "translate(" + xLabelVertPosition + ", " + xLabelHoriPosition + ")")
		.style("text-anchor", "middle")
		.text("Year")

	// *******************Y-axis********************
	yScale = d3.scaleTime()
		.domain([yMin, yMax])
		.range([height - margin.bottom - margin.top, 0])


	yAxisTicks = d3.axisLeft(yScale)
		.tickFormat(d3.timeFormat("%M:%S"))
		.ticks(12)

	yAxis = d3.select("#chart svg")
		.append("g")
		.attr("id", "y-axis")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
		.call(yAxisTicks)

	yLabel = scatterplot.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", - height / 2)
		.attr("y", 10)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Time (minutes)")

	// ******************Title and subtitle********************
	title = d3.select("svg")
		.append("text")
		.attr("x", width / 2)
		.attr("y", 50)
		.attr("text-anchor", "middle")
		.attr("id", "title")
		.style("font-size", "2em")
		.text("Doping in Professional Bicycle Racing")

	subtitle = d3.select("svg")
		.append("text")
		.attr("x", width / 2)
		.attr("y", 90)
		.attr("text-anchor", "middle")
		.attr("id", "subtitle")
		.style("font-size", "1.3em")
		.text("35 Fastest times up Alpe d'Huez")

	// *******************Scatterplot points*********************
	scatterplot.selectAll("circle")
		.data(d)
		.enter()
		.append("circle")
		.attr("cx", (d) => {
			return xScale(d.Year);
		})
		.attr("cy", (d) => yScale(getTime(d)))
		.attr("transform", "translate(0, " + margin.top + ")")
		.attr("r", 8)
		.attr("fill", (d) => {
			if (d.Doping == "") {
				return "#95d89c"
			} else {
				return "#ce6161"
			}
		})
		.attr("stroke", "#476363")
		.attr("stroke-width", 1)
		.attr("class", "dot")
		.attr("data-xvalue", (d) => {
			return d.Year;
		})
		.attr("data-yvalue", (d) => getTime(d))
		// tooltip on mouseover
		.on("mouseover", function(d, i) {
			tooltip.style("opacity", 0.9);
			tooltip.html(
				"<div><span>" + d.Name + "</span> (" + d.Nationality + ")<br><span>Year:</span> " + d.Year + "<br><span>Time:</span> " + d.Time + "<br>" + d.Doping + "<br><span>Source:</span> " + d.URL + "</div>"
			)
			.attr("data-year", d.Year)
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY-60) + "px")
		})
		// tooltip mouseout
		.on("mouseout", function(d) {
			tooltip.style("opacity", 0)
		})

	// ***************Scatterplot legend******************
	const legend = d3.select("svg")
		.append("g")

	legend.append("rect")
		.attr("width", 140)
		.attr("height", 75)
		.attr("x", 800)
		.attr("y", 400)
		.attr("stroke", "#476363")
		.attr("stroke-width", 1)
		.attr("fill", "#eae3d3")

	legend.append("text")
		.text("Legend: ")
		.attr("id", "legend")
		.attr("x", 810)
		.attr("y", 420)
		.style("font-size", "0.8em")
		.style("color", "#000")

	// legend: doping
	legend.append("circle")
		.attr("r", 8)
		.attr("cx", 830)
		.attr("cy", 440)
		.attr("transform", "translate(0, 0)")
		.attr("fill", "#ce6161")
		.attr("stroke", "#476363")
		.attr("stroke-width", 1)

	legend.append("text")
		.text("Doping allegations")
		.attr("x", 845)
		.attr("y", 445)
		.style("font-size", "0.6em")
		.style("color", "#000")

	// legend: no doping
	legend.append("circle")
		.attr("r", 8)
		.attr("cx", 830)
		.attr("cy", 460)
		.attr("transform", "translate(0, 0)")
		.attr("fill", "#95d89c")
		.attr("stroke", "#476363")
		.attr("stroke-width", 1)

	legend.append("text")
		.text("No doping allegations")
		.attr("x", 845)
		.attr("y", 465)
		.style("font-size", "0.6em")
		.style("color", "#000")

});
