
let graph= {nodes: [
        { id: "q0" },
    ],
    links: [

    ]};

function resetGraph(){
    graph= {nodes: [
            { id: "q0" },
        ],
        links: [

        ]};
}

//currentState, readSymbol, writeSymbol, move, nextState
function createGraph(TuringComputation){

    let newLabel=TuringComputation.readSymbol + " → " + TuringComputation.writeSymbol+ " , " + TuringComputation.move;
    let newRecord={source:TuringComputation.currentState,target:TuringComputation.nextState,label:newLabel};
    graph.links.push(newRecord);

    let researchNode=graph.nodes.find(node => node.id === TuringComputation.nextState);
    if (!researchNode) {
        // Il nodo con l'id specificato non è presente, aggiungilo come nuovo record
        graph.nodes.push({id:TuringComputation.nextState});

    }


}

let svg=d3.select("svg");

function NDloadGraph() {

    svg.selectAll("*").remove();


    svg.append('circle')
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', 20)
        .style('fill', 'white');

    let simulation = d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links).id(d => d.id).distance(150)) // Aumenta la distanza tra i nodi
        .force("charge", d3.forceManyBody().strength(-200)) // Aumenta la forza di attrazione tra i nodi
        .force("center", d3.forceCenter(400, 300)) // Posizione del centro del grafo
        .on("tick", ticked);


    let arrows=svg.append("svg:defs").selectAll("marker")
        .data(["end2"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", 0.5)
        .attr("markerWidth", 2)
        .attr("markerHeight", 2)
        .attr("orient", "auto")
        .style("stroke", "red")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");


    let link = svg.append("g")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .style("fill","#25A4F5")
        .attr("stroke-width",3)
        .style("stroke", "#1869E7")
        .attr("stroke-width", 5)
        .attr("marker-end", "url(#end)");


    // Aggiungi etichette agli archi
    let linksLabel = svg.append("g")
        .selectAll(".link-label")
        .data(graph.links)
        .enter().append("text")
        .text(d => d.label); // Testo dell'etichetta preso dalla proprietà "label" di ciascun arco;


    let node = svg.append("g")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .style("fill", function (d) {
            return "#F59D24";
        })
        .attr("stroke", "yellow")
        .attr("r", 10) // Imposta il raggio del nodo

    // Aggiungi etichette ai nodi
    let nodesLabel = svg.append("g").selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .text(d => d.id) // Testo dell'etichetta preso dalla proprietà "label" di ciascun nodo;


    function ticked() {

        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("cx", function (d) {
            return d.x;
        })

            .attr("cy", function (d) {
                return d.y;
            });

        // Aggiungi le coordinate x e y alle etichette degli archi
        linksLabel.attr("x", function (d) {
            return (d.source.x + d.target.x) / 2;
        })
            .attr("y", function (d) {
                return (d.source.y + d.target.y) / 2;
            });

        // Aggiungi le coordinate x e y alle etichette dei nodi
        nodesLabel.attr("x", function (d) {
            return d.x;
        })
            .attr("y", function (d) {
                return d.y - 15; // Sposta leggermente l'etichetta verso l'alto per evitare sovrapposizioni con i cerchi
            });


    }
}






