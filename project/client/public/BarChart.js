import React, {Component} from 'react';
import * as d3 from "d3";
//import { selection } from 'd3';
// with the help of https://blog.logrocket.com/data-visualization-in-react-using-react-d3-c35835af16d0/

class BarChart extends Component {

    constructor(props){
        super(props)
        this.myRef = React.createRef()
        this.dataset = [100, 200, 300, 400, 500];
    }


    // override?
    componentDidMount(){

        // placeholder data
        const data = [1,2,3,2,5,7,6,1,4,5];
        //const data = this.props.data;
        const width = 400;
        const height = 400;
/*
        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height])
*/
        

        // svg is scalable
        // select chooses the first element matching the argument in the document drawChart() is called upon
        // append appends a svg type node and returns a handle to that node
        const svg = d3.select(this.myRef.current)
        .append("svg")
        .attr("width", width)
        //.attr("width", this.props.width)
        .attr("height", height)
        .attr("margin-left", 100);

        
        // d is data point value, i is index of the data point in te array
        // selection.attr("property", (d,i) => {});

        // select all is like select but it applies to every matching element in the body
        svg.selectAll("rect")
        // data(data) attaches data argument to all selected elements
        .data(data)
        // enter and append helps with dynamic data
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 40)
        // svg coordinates are from upper left corner
        .attr('y', (d, i) => height - d*30)
        .attr("width", 35)
        .attr("height", (d, i) => d*30)
        .attr("fill", "teal");

    }

    // this is necessary syntax for inserting the React element <BarChart/>
    render(){
        return (
        <div ref={this.myRef} className="BarChart">
        </div>
        )
    }

}

export default BarChart; 