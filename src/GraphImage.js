import React from "react";
import * as d3 from "d3";
import './svg.css';
import { color } from "d3";

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
        const link = svg.selectAll(".link")
            .data(graph.links)
            .enter().append("g")
            .attr("class", "link")
            .append("line")
            .attr("stroke-width", 3)
            .style("stroke", d => color(d.serviceType));
//            .on("mouseover", tooltip_in)
//            .on("mouseout", tooltip_out);

        // Text on links
        const linkText = svg.selectAll(".link")
            .append("text")
            .attr("class", "label")
            .attr("dy", ".35em")
            .text(function(d) {
                return d.linkType;
            });

        // Link tooltip
        linkText.on("mouseover", tooltip_in)
        .on("mouseout", tooltip_out);

//        linkText.append("title")
//        .text(function(d) { return d.source.port + " to " + d.target.port; });
        
        // Initialize the nodes
        const node = svg.selectAll("node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", "nodes");

        // node images
        node.append("svg:image")
            .attr("xlink:href", function(d) { return d.type; })
            .attr("x", -8)
            .attr("y", -8)
            .attr("width", "30")
            .attr("height", "30")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // node labels
        node.append("text")
            .attr("dx", -60)
            .attr("dy", 35)
            .text(function(d) { return d.name });

        // node tooltip
        node.append("title")
        .text(function(d) { return d.name; });
        
        let tooltip = d3
        .select("body")
        .append("div") // the tooltip always "exists" as its own html div, even when not visible
        .style("position", "absolute") // the absolute position is necessary so that we can manually define its position later
        .style("visibility", "hidden") // hide it from default at the start so it only appears on hover
        .style("background-color", "white")
        .attr("class", "tooltip");
        
        function tooltip_in(event, d) { // pass event and d to this function so that it can access d for our data
            return tooltip
              .html("<ul><li>" + d.source.port + "</li><li>" + d.target.port + "</li></ul>") // add an html element with a header tag containing the name of the node.  This line is where you would add additional information like: "<h4>" + d.name + "</h4></br><p>" + d.type + "</p>"  Note the quote marks, pluses and </br>--these are necessary for javascript to put all the data and strings within quotes together properly.  Any text needs to be all one line in .html() here
              .style("visibility", "visible") // make the tooltip visible on hover
              .style("top", event.pageY + "px") // position the tooltip with its top at the same pixel location as the mouse on the screen
              .style("left", event.pageX + "px"); // position the tooltip just to the right of the mouse location
        }
        
        function tooltip_out(event, d) {
            return tooltip
                .transition()
                .duration(50) // give the hide behavior a 50 milisecond delay so that it doesn't jump around as the network moves
                .style("visibility", "hidden"); // hide the tooltip when the mouse stops hovering
        }
        
        // Let's list the force we wanna apply on the network
        const simulation = d3.forceSimulation(graph.nodes)                 // Force algorithm is applied to data.nodes
            .force("link", d3.forceLink()                               // This force provides links between nodes
                    .id(function(d) { return d.id; })                     // This provide  the id of a node
                    .links(graph.links)                                    // and this the list of links
            )
            .force("charge", d3.forceManyBody().strength(-800))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
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
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            linkText
                .attr("x", function(d) {
                    return ((d.source.x + d.target.x)/2);
                })
                .attr("y", function(d) {
                    return ((d.source.y + d.target.y)/2);
                });

            d3.select('#alpha_value').style('flex-basis', (simulation.alpha()*100) + '%');
        }

        // UI Events
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
          
          function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
          }
          
          function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0.0001);
            d.fx = null;
            d.fy = null;
          }

    }, [graph]); // Redraw if data changes

    return (
        <div className="App-graph">
            <svg ref={svgRef} width={width} height={height} />
        </div>
    );    
    
}

export default TopologyGraph;