"use strict";

/* jshint globalstrict: true */
/* global console,d3,c3 */

var typeChart = c3.generate({
    bindto: '#propertyTypeChart',
    data: {
        // iris data from R
        columns: [
            ['Vacant', 32.2],
            ['Owner Occupied', 19.1],
            ['Other', 48.7],
        ],
        type : 'bar',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    axis: {
        x: {
            show: false
        },
        y: {
            label: '%',
            max: 60,
            min: 0
        }
    }
});

var vacantGivenBoughtChart = c3.generate({
    bindto: '#typeGivenBoughtChart',
    data: {
        // iris data from R
        columns: [
            ['Vacant', 10.6],
            ['Owner Occupied', 34.3],
            ['Other', 55.1],
        ],
        type : 'bar',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    },
    axis: {
        x: {
            show: false
        },
        y: {
            label: '%',
            max: 60,
            min: 0
        }
    }
});