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



    constructor(state, props) {
        /*if (typeof props.url === 'undefined' ){
            throw new Error("All required properties needs to be provided")
        }*/
        super(props)
        this.myRef = React.createRef()

        // static property
        this.props = props

        // properties that this diagram needs to listen for change on, e.g. data https://reactjs.org/docs/state-and-lifecycle.html
        // outside of the constructor, state is changed with e.g. this.setState((state, props) => {y: state.y + props.ySuffix})
        this.state = state

    }


    //TODO setting state here will trigger re-rendering !!
    componentDidMount() {
        //const data = d3.json(useQuery(props.label, () => fetch(props.url)))
        //const growth = [useQuery(props.label, () => fetch("http://localhost:3001/singleStockGrowth"))]
        //d3.json(props.label, () => fetch().then((res) => res.json))
        //d3.json('sample.json', 



        // no spaces allowed as graph names. Hyphens are replaced with spaces
        // TODO every place that refers to data should refer to this.state.data
        var data = { // placeholder data
            y: "Type of y",
            series: [{ name: "graph-1", values: [10, 30, 70, 90, 100] }, { name: "graph-2", values: [5, 26, 80, 70, 60] }, { name: "graph-3", values: [3, 37, 82, 77, 66] }],
            dates: [12, 13, 14, 15, 16]
        }//this.state.data


        var margin = ({ top: 20, right: 30, bottom: 30, left: 40 })

        var height = 1000
        var width = 1000
        if (typeof this.props.width != 'undefined') {
            width = this.props.width;
        }
        if (typeof this.props.height != 'undefined') {
            height = this.props.height;
        }


        var x = d3.scaleUtc()
            .domain(d3.extent(data.dates))
            //.domain(d3.extent(data.dates , d => d.date))
            .range([margin.left + 30, width - margin.right])



        //var maxValue = d3.max(data, d => d.value)
        var maxValue = d3.max(data.series, d => d3.max(d.values))
        var y = d3.scaleLinear()
            // this is from zero to max. should be able to choose settings for y-axim
            .domain([0, maxValue + maxValue / 10]).nice()
            .range([height - margin.bottom, margin.top])


        // functions for the drawing of the axises
        var xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
            .attr("class", "axisLabel")

        var yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`) // not as css since dependent on js
            .call(d3.axisLeft(y))
            .attr("class", "axisLabel")
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("class", "yAxisLabel")
                .attr("x", 10) //x-position of label shown at top of y-axis
                .text(data.y)) // label shown at top of y-axis

        // creates a background grid
        var grid = g => g
            .attr("stroke", "currentColor")
            .attr("stroke-opacity", 0.1)
            .call(g => g.append("g")
                .selectAll("line")
                .data(x.ticks())
                .join("line")
                .attr("x1", d => 0.5 + x(d))
                .attr("x2", d => 0.5 + x(d))
                .attr("y1", margin.top)
                .attr("y2", height - margin.bottom))
            .call(g => g.append("g")
                .selectAll("line")
                .data(y.ticks())
                .join("line")
                .attr("y1", d => 0.5 + y(d))
                .attr("y2", d => 0.5 + y(d))
                .attr("x1", margin.left)
                .attr("x2", width - margin.right));

        // a line, defined by x-value from every node in data´s date value, and x-value from its value-value
        var line = d3.line()
            .defined(d => !isNaN(d))
            .x((d, i) => x(data.dates[i]))
            .y(d => y(d))


        // Make an svg and set size of viewPort
        var svg = d3.select(this.myRef.current)
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
        //.style("preserveAspectRatio", "xMidYMid meet");

        // append the axises and the grid
        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("g")
            .call(grid);

        // pretty colors!!
        svg.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", "20%")
            .attr("y2", "100%")
            .selectAll("stop")
            .data([
                { offset: "0%", color: "#2BE8D2" },
                { offset: "100%", color: "#008A1E" }
            ])
            .enter().append("stop")
            .attr("offset", function (d) { return d.offset; })
            .attr("stop-color", function (d) { return d.color; });

        // the actual line drawing part
        var path = svg.append("g")
            .attr("fill", "none") // this fills the area enclosed by the graph, with added edges between start and end nodes
            .attr("stroke", "url(#line-gradient)")
            .attr("stroke-width", 5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "square") // alt value 'butt'
            .selectAll("path")
            .data(data.series)
            .enter()
            .append("path")
            .attr("class", (d => d.name))
            .join("path")
            .style("mix-blend-mode", "multiply") // darker where the lines cross over each other
            .attr("d", d => line(d.values));


        // the creation of the interactive legend
        svg.selectAll("legend")
            .data(data.series)
            .enter()
            .append('g')
            .append("text")
            .attr("class", "legend")
            .attr('x', function (d, i) { return 140 + i * 100 })
            .attr('y', 30)
            .text(d => d.name.replace('-', ' ')) // these are replaced back and forth. This is since class names can not contain spaces
            .style("fill", "url(#line-gradient)")
            .on("click", d => {
                let className = "." + d.target.innerHTML.replace(' ', '-') // this is dumb
                // is the element currently visible ?
                var currentOpacity = d3.selectAll(className).style("opacity")
                // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll(className).transition().style("opacity", currentOpacity == 1.0 ? 0.0 : 1.0)
            })



        svg.call(hover, path)

        function hover(svg, path) {

            // touch related event handlers
            if ("ontouchstart" in document) svg
                .style("-webkit-tap-highlight-color", "transparent")
                .on("touchmove", moved)
                .on("touchstart", entered)
                .on("touchend", left)
            // mouse related event handlers
            else svg
                .on("mousemove", moved)
                .on("mouseenter", entered)
                .on("mouseleave", left);

            const dot = svg.append("g")
                .attr("display", "none");

            dot.append("circle")
                .attr("r", 10)
                .attr("stroke-width", 2)
                .attr("stroke", "black")
                .attr("fill", "none")

            dot.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", 15)
                .attr("text-anchor", "start")
                .attr("y", -20);

                /* attempt to fix tooltips for hidden graphs
            function activeValues(){
                var values = []
                data.series.forEach(element => {
                    console.log(svg.select(element.name))
                    if (svg.select(element.name).currentOpacity === 1.0){
                        values.push[element]
                    }
                    
                })
                console.log(values)
            }*/

            

            function moved(event) {
                event.preventDefault();
                const pointer = d3.pointer(event, this); // provides pointer information
                const xm = x.invert(pointer[0]); // coordinates of the pointer, for x
                const ym = y.invert(pointer[1]); // and y

                const i = d3.bisectCenter(data.dates, xm); // i is the index of the date closest to the pointer
                const s = d3.least(data.series, d => Math.abs(d.values[i] - ym)); //s is the serie closest to the pointer
                path.attr("stroke", d => d === s ? null : "#C0FFD0").filter(d => d === s).raise(); // if this line is highlighted, set color filter to null. Otherwise, set color filter to a fade
                dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`); // moves the tooltip
                dot.select("text").text(s.name.replace('-', ' ') + ": " + data.dates[i]); // text in tooltip
            }

            function entered() {
                path.style("mix-blend-mode", null).attr("stroke", "#C0FFD0");
                dot.attr("display", null);
            }

            function left() {
                path.style("mix-blend-mode", "multiply").attr("stroke", null);
                dot.attr("display", "none"); // stop showing tooltip
            }
        }
    }

    // method called when React element is removed
    componentWillUnmount() {

    }


    render() {
        return (
            <div ref={this.myRef} className="LineDiagram"></div>
        )
    }
}