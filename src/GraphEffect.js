import React from "react";
import * as d3 from "d3";
import './svg.css';

const TopologyGraph = ({graph}) => {
    const svgRef = React.useRef(null);
    const margin = {"top": 10, "right": 30, "bottom": 30, "left": 40},
    width = 1400 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;
    
    React.useEffect(() => {
        const svgEl = d3.select(svgRef.current);
        svgEl.selectAll("*").remove(); // Clear svg content before adding new elements 
                  
        // append the svg object to the body of the page
        const svg = svgEl
        .append("g")
        .attr("transform",
                `translate(${margin.left}, ${margin.top})`);

        // Initialize the links
        const link = svg.attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .style("stroke", "#aaa");

        // Initialize the nodes
        const node = svg.attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .join("circle")
            .attr("r", 10);

        // show images
        node.append("svg:image")
        .attr("xlink:href", function(d) { return d.type; })
        .attr("x", "-8px")
        .attr("y", "-8px")
        .attr("width", "16px")
        .attr("height", "16px");

        // node tooltip
        node.append("title")
        .text(function(d) { return d.name; });
        
        // Let's list the force we wanna apply on the network
        const simulation = d3.forceSimulation(graph.nodes)                 // Force algorithm is applied to data.nodes
            .force("link", d3.forceLink()                               // This force provides links between nodes
                    .id(function(d) { return d.id; })                     // This provide  the id of a node
                    .links(graph.links)                                    // and this the list of links
            )
            .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
            .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
            .on("tick", ticked);

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
    }, [graph]); // Redraw if data changes

    return (
        <svg ref={svgRef} width={width} height={height} /> 
    );    
    
}

export default TopologyGraph;