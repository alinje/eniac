import React, { useEffect } from 'react';
import * as d3 from "d3";
import rawJson from '../public/test_data.json';
import { useQuery } from 'react-query';


export default function PieChart(props) {

    const myRef = React.useRef(null)

    function Double(sign){
        //var rawJson = JSON.parse("project/client/public/test_data.json")
        const { data = { rows: [{ amount: 0 }] } } = props
        console.log({ pieChart: data })
        var width = 400,
            height = 400,
            radius = Math.min(width, height) / 2;

        var svg = d3.select(myRef.current).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        //var color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c', '#a41a1c', '#a42f1c']);
        var color = d3.scaleOrdinal(d3.schemePaired)

        var pie = d3.pie().value(function (d) {
            if(Math.sign(d.totalsum) === sign){
                return null
            }
            return Math.abs(d.totalsum);
        });

        var path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

        var label = d3.arc()
            .outerRadius(radius)
            .innerRadius(radius - 100);


        var arc = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function (d) { return color(d.data.label); });

        console.log(arc)

        arc.append("text")
            .attr("transform", function (d) {
                return "translate(" + label.centroid(d) + ")";
            })
            .text(function (d) {
                if(Math.sign(d.data.totalsum) === sign){
                    return null
                }
                return d.data.label; });
    }


    // the first argument function is called upon every time a change happens to one of the objects in the second argument array
    useEffect(() => {
        Double(-1)
        Double(1)


}, [props.data])

// the first argument function is called upon every time a change happens to one of the objects in the second argument array
/*useEffect(() => {
    //var rawJson = JSON.parse("project/client/public/test_data.json")
    const {data = {rows: [{amount: 0}]}} = props
    console.log({pieChart: data})

    var width = 800,
        height = 800,
        radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.amount;
        });

    var svg = d3.select(myRef.current).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.stock);
        });

    g.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.data.amount;
        });
}, [props.data])*/

/*componentDidMount(){
    // set the dimensions and margins of the graph
    const width = 450,
        height = 450,
        margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin

// append the svg object to the div
    const svg = d3.select(this.myRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
    const data = {a:9, b:20, c:30, d:8, e:12};

// set the color scale
    const color = d3.scaleOrdinal()
        .domain(data)
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

// Compute the position of each group on the pie:
    const pie = d3.pie()
        .value(function(d) {return d.value; })
    const data_ready = pie(Object.entries(data))

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        )
        .attr('fill', function(d){ return(color(d.data.key)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);


} Shit's fucked yo*/

return (

    <div ref={myRef} className="PieChart"></div>


)

}