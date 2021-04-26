import React, {Component} from 'react';
import * as d3 from "d3";
import LineDiagram from "./LineDiagram";
//import { selection } from 'd3';
// with the help of https://blog.logrocket.com/data-visualization-in-react-using-react-d3-c35835af16d0/

export default class DistributionChart extends Component {

    constructor(props){
        super(props)
        this.myRef = React.createRef()
        this.props = props
    }

    componentDidMount() {

        var data = { // placeholder data
            y: "Type of y",
                series: [{ name: "graph-1", values: [10, 30, 70, 90, 100] }, { name: "graph-2", values: [5, 26, 80, 70, 60] }, { name: "graph-3", values: [3, 37, 82, 77, 66] }],
                dates: [12, 13, 14, 15, 16]};


        const margin = ({top: 20, right: 30, bottom: 30, left: 40})

        const height = 1000
        var width = 1000
        if (typeof this.props.width != 'undefined') {
            width = this.props.width;
        }

        const svg = d3.select(this.myRef.current)
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .style("preserveAspectRatio", "xMidYMid meet");

        const x = d3.scaleLinear()
            .domain(d3.extent(data.dates))
            //.domain(d3.extent(data.dates , d => d.date))
            .range([margin.left + 30, width - margin.right])

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));


        //var maxValue = d3.max(data, d => d.value)
        var maxValue = d3.max(data.series, d => d3.max(d.values))

        const y = d3.scaleLinear()
            // this is from zero to max. should be able to choose settings for y-axim
            .domain([0, maxValue + maxValue / 10]).nice()
            .range([height - margin.bottom, margin.top])

        svg.append("g")
            .call(d3.axisLeft(y));

        function kernelDensityEstimator(kernel, X) {
            return function(V) {
                return X.map(function(x) {
                    return [x, d3.mean(V, function(v) { return kernel(x - v); })];
                });
            };
        }
        function kernelEpanechnikov(k) {
            return function(v) {
                return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
            };
        }
        var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
        var density = kde(data.dates.map(function(d) { return d.date; }))

        svg.append("path")
            .attr("class", "myPath")
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
    render() {
        return (
            <div ref={this.myRef} className="DistributionChart"></div>
        )
    }
}
