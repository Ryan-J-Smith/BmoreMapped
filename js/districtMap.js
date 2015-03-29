var width = 960,
	height = 960,
	scaleVal = 150000,
	ctrLat = 39.30,
	ctrLon = 76.61;

// Create SVG object, set width and height, attach to "body"
var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)

var projection = d3.geo.albers()
	.rotate([ctrLon,0])
	.center([0, ctrLat])
	.scale(scaleVal)
	.translate([width / 2, height /2]);


var path = d3.geo.path()
	.projection(projection);



d3.json("/data/councilDistrictsSimple.json", function(error, json) {
	if (error) return console.error(error);
	
	svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("fill", "steelblue")
	.style("stroke", "black")
	// Add mouseover effects
	.on("mouseover", function() {
		d3.select(this).style("fill", "orange");
	})
	.on("mouseout", function() {
		d3.select(this).style("fill", "steelblue");
	});
});

