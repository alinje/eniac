import React, {Component} from 'react';
import * as d3 from "d3";
import LineDiagram from "./LineDiagram";
//import { selection } from 'd3';
// with the help of https://blog.logrocket.com/data-visualization-in-react-using-react-d3-c35835af16d0/

class BarChart extends Component {

    constructor(props){
        super(props)
        this.myRef = React.createRef()
        this.props = props
    }
    // Function to compute density
    kernelDensityEstimator(kernel, X) {
        return function(V) {
            return X.map(function(x) {
                return [x, d3.mean(V, function(v) { return kernel(x - v); })];
            });
        };
    }
    kernelEpanechnikov(k) {
        return function(v) {
            return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
        };
    }
    componentDidMount() {

        data = LineDiagram.data;


        const margin = ({top: 20, right: 30, bottom: 30, left: 40})

        const height = 1000
        var width = 1000
        if (typeof this.props.width != 'undefined') {
            width = this.props.width;
        }

        const x = d3.scaleUtc()
            .domain(d3.extent(data.dates))
            //.domain(d3.extent(data.dates , d => d.date))
            .range([margin.left + 30, width - margin.right])


        //var maxValue = d3.max(data, d => d.value)
        var maxValue = d3.max(data.series, d => d3.max(d.values))
        const y = d3.scaleLinear()
            // this is from zero to max. should be able to choose settings for y-axim
            .domain([0, maxValue + maxValue / 10]).nice()
            .range([height - margin.bottom, margin.top])

        // the drawing of the axises
        const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 5) //x-position of label shown at top of y-axis
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y)) // label shown at top of y-axis

        // Make an svg and set size of viewPort
        const svg = d3.select(this.myRef.current)
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .style("preserveAspectRatio", "xMidYMid meet");

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        var kde = this.kernelDensityEstimator()(this.kernelEpanechnikov(7), x.ticks(40))
        var density = kde(data.map(function(d) { return d.date; }))

        svg.append("path")
            .attr("class", d => d.name)
            .datum(density)
            .attr("fill", "red")
            .attr("opacity", ".5")
            .attr("stroke", "black")
            .attr("stroke-width", .1)
            .attr("stroke-linejoin", "round")
            .attr("d", d3.line()
                .curve(d3.curveBasis)
                .x(function(d){return x(d[0]);})
                .y(function(d){return y(d[1]);})
            );

    }

}