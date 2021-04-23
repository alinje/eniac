import React, {Component} from 'react';
import * as d3 from "d3";
export default class BarPlotChart extends Component{

    constructor(props){
        super(props)
        this.myRef = React.createRef()
        this.props = props
    }
    componentDidMount(){
        var margin = ({top: 20, right: 30, bottom: 30, left: 40})

        var height = 1000
        var width = 1000
        if (typeof this.props.width != 'undefined') {
            width = this.props.width;
        }

        var svg = d3.select(this.myRef.current)
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .style("preserveAspectRatio", "xMidYMid meet");

        d3.json("project/client/public/test_data.json", function(data){
            // X axis
            var x = d3.scaleBand()
                .range([ 0, width ])
                .domain(data.map(function(d) { return d.rows.stock; }))
                .padding(0.2);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 130000])
                .range([ height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // Bars
            svg.selectAll("mybar")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.rows.stock); })
                .attr("y", function(d) { return y(d.rows.amount); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return height - y(d.rows.amount); })
                .attr("fill", "#69b3a2")
        });

    }
    render() {
        return (
            <div ref={this.myRef} className="BarPlotChart"></div>
        )
    }
}