"use strict";

/* jshint globalstrict: true */
/* global console,dc,d3,crossfilter */

var dataFile = "../data/BaltCrimeMonthData.csv";
var neighborhoodFile = "../data/hoodDict.json";
var crimeFile = "../data/crimeDict.json";
var neighborhoodGeo = "../data/hoodsWCensusSmall.json";

var hoodDict;
var crimeDict;
var hoodPop;
var hoodDemoDict = {};
var mapData;

var mapChart = dc.geoChoroplethChart("#chart-crime-choropleth");
var dateCountChart = dc.barChart("#chart-crime-volume");
var crimeTypeChart = dc.rowChart("#chart-crime-type");

// dateCountChart.on("preRedraw", function (chart) {
//     chart.rescale();
// });
// dateCountChart.on("preRender", function (chart) {
//     chart.rescale();
// });

// Disable DC Transitions
dc.disableTransitions = false;

// Modify event delay
dc.constants.EVENT_DELAY = 40;

// Load neighborhood list into d3
d3.json(neighborhoodFile, function(error, json) {
    if (error) return console.warn(error);
    hoodDict = json;
});

// Load crime list into d3
d3.json(crimeFile, function(error, json) {
    if (error) return console.warn(error);
    crimeDict = json;
});

// Load data into d3
d3.csv(dataFile, function(csvError, csvData) {

    if (csvError) throw csvError;
    
    d3.json(neighborhoodGeo, function (jsonError, geojson) {
        
        if (jsonError) throw jsonError;

        // Specify date formatting
        var formatDate = d3.time.format("%Y%m%d");

        // Get data from geojson
        geojson.features.forEach(function(d,i) {
            hoodPop = +d.properties.Population;
            if (hoodPop === 0) { hoodPop = Infinity;}
            hoodPop = hoodPop + 200;
            hoodDemoDict[d.properties.Name] = {};
            hoodDemoDict[d.properties.Name].pop = hoodPop;
        });

        // Format entries
        csvData.forEach(function(d,i){
            d.index = i;
            d.date = formatDate.parse(d.date);
            d.month = d3.time.month(d.date); // pre-calculate month for better performance
            d.crime = crimeDict[+d.crime];
            d.neighborhood = hoodDict[+d.neighborhood];
            d.count = +d.count;
        });

        // Initiate crossfilter
        var ndx = crossfilter(csvData);
        var all = ndx.groupAll();

        var monthDim = ndx.dimension(function (d) {
            return d.month;
        });
        var monthCounts = monthDim.group().reduceSum(function(d) {
            return d.count;
        });

        var crimeTypeDim = ndx.dimension(function (d) {
            return d.crime;
        });

        var crimeTypeGroup = crimeTypeDim.group().reduceSum(function(d) {
            return d.count;
        });

        var neighborhoodDim = ndx.dimension(function (d) {return d.neighborhood; });
        var neighborhoodGroup = neighborhoodDim.group().reduceSum(function(d) {
            if(d.neighborhood in hoodDemoDict) {
                return parseFloat(d.count) / parseFloat(hoodDemoDict[d.neighborhood].pop);
            }
            else {
                return d.count;
            }
        });

        var minDate = monthDim.bottom(1)[0].month;
        var maxDate = monthDim.top(1)[0].month;

        dateCountChart
            .width(1000)
            .height(200)
            .dimension(monthDim)
            .group(monthCounts)
            .x(d3.time.scale().domain([minDate,maxDate]))
            .xUnits(d3.time.months)
            .elasticY(true);

        crimeTypeChart
            .width(300)
            .height(400)
            .dimension(crimeTypeDim)
            .group(crimeTypeGroup)
            .renderLabel(true)
            .elasticX(true);

        var scaleVal = 125000,
            ctrLat = 39.25,
            ctrLon = 76.57;

        var mapProjection = d3.geo.albers()
            .rotate([ctrLon,0])
            .center([0, ctrLat])
            .scale(scaleVal);

        mapChart
            .dimension(neighborhoodDim)
            .group(neighborhoodGroup)
            .width(700)
            .height(400)
            // .transitionDuration(1000)
            .projection(mapProjection)
            .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
            .colorDomain([0, 1.5])
            .overlayGeoJson(geojson.features, "neighborhood", function(d) {
                return d.properties.Name; });

            dc.renderAll();
    });



        



});

