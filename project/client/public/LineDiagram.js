import React, { Component } from 'react';
import * as d3 from "d3";
import { useQuery } from 'react-query';


/**
 * LineDiagram component demands following properties:
 * url: url to backend data provider
 * label: label to show
 * 
 * Optional:
 * 
 */
export default class LineDiagram extends Component {



    constructor(props) {
        /*if (typeof props.url === 'undefined' ){
            throw new Error("All required properties needs to be provided")
        }*/

        super(props)
        this.myRef = React.createRef()
        this.props = props
    }

    //TODO setting state here will trigger re-rendering !!
    componentDidMount() {
        //const data = d3.json(useQuery(props.label, () => fetch(props.url)))
        //const growth = [useQuery(props.label, () => fetch("http://localhost:3001/singleStockGrowth"))]
        //d3.json(props.label, () => fetch().then((res) => res.json))
        //d3.json('sample.json', 

        const data = {
            y: "Type of y",
            series: [{ name: "graph1", values: [10, 30, 70, 90, 100] }, { name: "graph2", values: [5, 26, 80, 70, 60] }],
            dates: [12, 13, 14, 15, 16]
        }


        const margin = ({ top: 20, right: 30, bottom: 30, left: 40 })

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

        // a line, defined by x-value from every node in data´s date value, and x-value from its value-value
        const line = d3.line()
            .defined(d => !isNaN(d))
            .x((d, i) => x(data.dates[i]))
            .y(d => y(d))


        // Make an svg and set size of viewPort
        const svg = d3.select(this.myRef.current)
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .style("preserveAspectRatio", "xMidYMid meet");

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        // pretty colors!!
        svg.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            // below: no idea why this is what works
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", "100%")
            .selectAll("stop")
            .data([
                { offset: "0%", color: "red" },
                { offset: "100%", color: "blue" }
            ])
            .enter().append("stop")
            .attr("offset", function (d) { return d.offset; })
            .attr("stop-color", function (d) { return d.color; });

        // the actual drawing part
        svg.append("g")
            .attr("fill", "none") // this fills the area enclosed by the graph, with added edges between start and end nodes
            .attr("stroke", "url(#line-gradient)")
            .attr("stroke-width", 5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "square") // alt value 'butt'
            .selectAll("path")
            .data(data.series)
            .enter()
            .append("path")
            .attr("class", d => d.name )
            .join("path")
            .style("mix-blend-mode", "multiply") // darker where the lines cross over each other
            .attr("d", d => line(d.values));

        svg.selectAll("myLegend")
            .data(data.series)
            .enter()
            .append('g')
            .append("text")
            .attr('x', function (d, i) { return 100 + i * 100 })
            .attr('y', 30)
            .text(d => d.name)
            .style("fill", "url(#line-gradient)"/*function (d) { return myColor(d.name) }*/)
            .style("font-size", 25)
            .on("click", d => {
                let className = "." + d.target.innerHTML // this is dumb
                // is the element currently visible ?
                var currentOpacity = d3.selectAll(className).style("opacity")
                // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll(className).transition().style("opacity", currentOpacity == 1.0 ? 0.0 : 1.0)

            })
    }


    render() {
        return (
            <div ref={this.myRef} className="LineDiagram"></div>
        )
    }
}