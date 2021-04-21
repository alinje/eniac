//import {chart as chart1} from "@d3/histogram"
//const d3 = require("d3@6")
//const values = Array(10) [1,2,3,2,5,7,6,1,4,5]
//import {chart as chart1, values as data} from "@d3/histogram"

import React, {Component} from 'react';
import * as d3 from "d3";
import { selection } from 'd3';



export default function TestGraph(props) {
    const data = [1,2,3,2,5,7,6,1,4,5];

    const svg = (
            <svg style={{
                border: "30px solid gold"
            }} width="200" height="100" />
    );
    
    
    //const svg = d3.create("svg")
    //.attr("viewBox", [0, 0, width, height]);

    //console.log("tjoho")
    return (
        <div className="testGraph" onClick={props.onClick}>
            {svg}
        </div>
    )
}

/* alternative, might be useful when extending other components. Now calls a TestGraph and provides an onClick function
export class GraphClass extends Component {
    render(){
        return (
            <div>
                <TestGraph onClick={() => graphMsg()}/>
            </div>
        )
    }
}
*/
// 

export function graphMsg(){
    console.log("tjoladittan")
    return "nice work pressing that"
}