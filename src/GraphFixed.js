import React from "react";
import * as d3 from "d3";

class TopologyGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {graph: props.graph};
    }

    render() {
//        const svgRef = React.useRef(null);
        const margin = {"top": 10, "right": 30, "bottom": 30, "left": 40},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
     
//        const svgEl = d3.select(svgRef.current);
        const svgEl = d3.select("svg");
        console.log(svgEl);
        svgEl.selectAll("*").remove(); // Clear svg content before adding new elements 
        
        // append the svg object to the body of the page
        const svg = svgEl
        .append("g")
        .attr("transform",
                `translate(${margin.left}, ${margin.top})`);
    
        // Initialize the links
        const link = svg
            .selectAll("line")
            .data(this.state.graph.links)
            .join("line")
            .style("stroke", "#aaa");
    
        // Initialize the nodes
        const node = svg
            .selectAll("circle")
            .data(this.state.graph.nodes)
            .join("circle")
            .attr("r", 20)
            .style("fill", "#69b3a2");
    
        // Let's list the force we wanna apply on the network
        const simulation = d3.forceSimulation(this.state.graph.nodes)                 // Force algorithm is applied to data.nodes
            .force("link", d3.forceLink()                               // This force provides links between nodes
                    .id(function(d) { return d.id; })                     // This provide  the id of a node
                    .links(this.state.graph.links)                                    // and this the list of links
            )
            .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
            .on("end", ticked);
    
        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
    
            node
                .attr("cx", function (d) { return d.x+6; })
                .attr("cy", function(d) { return d.y-6; });
        }
    
        return (
            <svg width={width} height={height} /> 
        );    
    }
}

export default TopologyGraph;