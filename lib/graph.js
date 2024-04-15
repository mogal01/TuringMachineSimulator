let loadGraphButton=document.getElementById("loadGraphButton");
let cycleCounts;
let countTemp=0;

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

    cycleCounts = {};
    graph.nodes.forEach(node => {
        cycleCounts[node.id] = 0;
    });
}

function createGraph(TuringComputation){

    let newLabel=TuringComputation.readSymbol + " → " + TuringComputation.writeSymbol+ " , " + TuringComputation.move;
    let newRecord={source:TuringComputation.currentState,target:TuringComputation.nextState,label:newLabel};
    let toModify=graph.links.find(link => link.source===TuringComputation.currentState && link.target===TuringComputation.nextState);
    if((TuringComputation.currentState===TuringComputation.nextState)&&(toModify)){
        console.log("Sono entrato riga 32");
        toModify.label=toModify.label+"|"+newRecord.label;

    }
    else
        graph.links.push(newRecord);

    let researchNode=graph.nodes.find(node => node.id === TuringComputation.nextState);
    if (!researchNode) {
        // Il nodo con l'id specificato non è presente, aggiungilo come nuovo record
        graph.nodes.push({id:TuringComputation.nextState});

    }

    cycleCounts = {};
    graph.nodes.forEach(node => {
        cycleCounts[node.id] = 0;
    });

}

let svg=d3.select("svg");

function loadGraph() {

    svg.selectAll("*").remove();

    // Calcoliamo le dimensioni dell'area SVG
    const svgWidth = +svg.attr("width");
    const svgHeight = +svg.attr("height");

    // Calcoliamo il centro dell'area SVG
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;

    // Aggiungiamo un cerchio bianco al centro dell'area SVG
    svg.append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', 20)
        .style('fill', 'white');

    let simulation = d3.forceSimulation(graph.nodes)
        .force("link", d3.forceLink(graph.links).id(d => d.id).distance(250)) // Aumenta la distanza tra i nodi
        .force("charge", d3.forceManyBody().strength(-600)) // Aumenta la forza di attrazione tra i nodi
        .force("center", d3.forceCenter(400, 400)) // Posizione del centro del grafo
        .on("tick", ticked);




    let arrows=svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", 0.5)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .style("stroke", "red")
        .style("fill", "#FDD835")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");


    let link = svg.append("g")
        .selectAll(".link")
        .data(graph.links)
        .enter()
        .append("path") // Usa 'path' invece di 'line' per gli archi
        .attr("class", "link")
        .style("fill", "none")
        .style("stroke", "#424242")
        .attr("stroke-width", 3)
        .attr("marker-end", "url(#end)")
        .attr("d", d => {
            if (d.source === d.target) { // Controlla se l'arco è un ciclo
                // Calcola le dimensioni e la posizione del percorso curvo
                let x = d.source.x;
                let y = d.source.y;
                let raggio = 20; // Imposta il raggio dell'arco
                return `M ${x},${y} A ${raggio},${raggio} 0 1,1 ${x-0.1},${y}`;
            } else {
                // Codice per archi normali (linee rette)
                return `M ${d.source.x},${d.source.y} L ${d.target.x},${d.target.y}`;
            }
        });




    let node = svg.append("g")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .style("fill", function (d) { return "#BDBDBD"; })
        .attr("r", 10) // Imposta il raggio del nodo
        .on("mouseover", function(event, d) {  // Aggiunto gestore evento mouseover
            showTooltip(d, event.pageX, event.pageY);
        })
        .on("mouseout", function() {  // Aggiunto gestore evento mouseout
            hideTooltip();
        });

    // Aggiungi etichette agli archi
    let linksLabel = svg.append("g")
        .selectAll(".link-label")
        .data(graph.links)
        .enter().append("text")
        .text(d => {

            return d.label;
        });
        /*.attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => {
            if (d.source === d.target) {
                let baseOffset = -20;
                let additionalOffset = -20 * (cycleCounts[d.source.id] % 3);
                cycleCounts[d.source.id]++;
                let calculatedOffset = d.source.y + baseOffset + additionalOffset;
                return Math.max(20, Math.min(calculatedOffset, 580));
            } else {
                return (d.source.y + d.target.y) / 2;
            }
        });*/





// Funzione per mostrare il tooltip
    function showTooltip(node, event) {
        let tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        let [x, y] = d3.pointer(event); // Coordinate relative al viewport

        // Calcola la posizione del tooltip basandoti sulle dimensioni fisse del SVG
        let svgRect = svg.node().getBoundingClientRect();
        let tooltipX = svgRect.left + window.scrollX + x;
        let tooltipY = svgRect.top + window.scrollY + y;

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("Node: " + node.id) // Contenuto del tooltip
            .style("left", tooltipX + "px")
            .style("top", tooltipY + "px");
    }


// Modifica l'evento mouseover per passare l'evento
    node.on("mouseover", function(event, d) {
        showTooltip(d, event);
    })

// Funzione per nascondere il tooltip
    function hideTooltip() {
        d3.select(".tooltip").remove();
    }


    // Aggiungi etichette ai nodi
    let nodesLabel = svg.append("g").selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .text(d => d.id) // Testo dell'etichetta preso dalla proprietà "label" di ciascun nodo;


    function ticked() {
        // Aggiorna posizione archi (linee o percorsi curvi)
        link.attr("d", function (d) {
            if (d.source === d.target) {
                // Aggiornamento per archi curvi (cicli)
                let x = d.source.x;
                let y = d.source.y;
                let raggio = 20; // Il raggio può essere aggiustato
                return `M ${x},${y} A ${raggio},${raggio} 0 1,1 ${x - 0.1},${y}`;
            } else {
                // Aggiornamento per archi normali (linee rette)
                return `M ${d.source.x},${d.source.y} L ${d.target.x},${d.target.y}`;
            }
        });

        // Aggiorna posizione dei nodi
        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
                return d.y;
            });

        // Aggiorna posizione delle etichette dei nodi
        nodesLabel.attr("x", function (d) {
            return d.x;
        })
            .attr("y", function (d) {
                return d.y - 15;
            }); // A seconda di come vuoi posizionarle

        // Aggiorna posizione delle etichette degli archi, se presente
        /*linksLabel.attr("x", function (d) {
            if (d.source === d.target) {
                // Posizionamento per etichette di archi curvi
                return d.source.x; // A seconda di come vuoi posizionarle
            } else {
                // Posizionamento per etichette di archi normali
                return (d.source.x + d.target.x) / 2;
            }
        })
            .attr("y", function (d) {
                if (d.source === d.target) {
                    // Posizionamento per etichette di archi curvi
                    return d.source.y - 20; // Sposta sopra il nodo
                } else {
                    // Posizionamento per etichette di archi normali
                    return (d.source.y + d.target.y) / 2;
                }
            });*/

        // Aggiorna posizione delle etichette degli archi
       /* linksLabel
            .attr("x", function(d) {
                return (d.source.x + d.target.x) / 2; // Punto medio dell'arco
            })
            .attr("y", function(d) {
                const offset = 10; // Aumenta l'offset se necessario
                return (d.source.y + d.target.y) / 2 + offset; // Sposta in basso le etichette
            })
            .style("text-anchor", "middle")
            .style("user-select", "none")
            .style("pointer-events", "none");

        // Aggiungi uno sfondo alle etichette per migliorare la leggibilità
        linksLabel.each(function() {
            const bbox = this.getBBox();
            d3.select(this).insert("rect", ":first-child")
                .attr("x", bbox.x - 2)
                .attr("y", bbox.y - 2)
                .attr("width", bbox.width + 4)
                .attr("height", bbox.height + 4)
                .attr("fill", "white")
                .style("opacity", 0.7); // Leggermente trasparente
        });

// Aggiungere uno sfondo alle etichette per migliorare la leggibilità
        linksLabel.insert("rect", ":first-child")
            .attr("x", function (d) {
                return this.parentNode.getBBox().x - 2;
            })
            .attr("y", function (d) {
                return this.parentNode.getBBox().y - 2;
            })
            .attr("width", function (d) {
                return this.parentNode.getBBox().width + 4;
            })
            .attr("height", function (d) {
                return this.parentNode.getBBox().height + 4;
            })
            .attr("fill", "white") // Sfondo bianco
            .style("opacity", 0.7); // Leggermente trasparente per non nascondere completamente il grafico sottostante
            */



       linksLabel.attr("x", function(d) {
            return (d.source.x + d.target.x) / 2; // Posizione X per tutte le etichette
        }).attr("y", function(d) {
            if (d.source === d.target) {
                /*if(countTemp>=1199)
                    console.log("Arrivato al limite");
                if(countTemp<1200) {
                    countTemp++;
                    // Calcola un offset Y che varia per ogni ciclo ma rimane all'interno dell'SVG
                    let baseOffset = -20; // Offset di base sopra il nodo
                    let additionalOffset = -20 * (cycleCounts[d.source.id] % 3); // Cicli aggiuntivi si spostano ulteriormente, ma entro un certo limite
                    cycleCounts[d.source.id]++;
                    console.log("cycleCounts di " + d.source.id + " è: " + cycleCounts[d.source.id]);
                    let calculatedOffset = d.source.y + baseOffset + additionalOffset;
                    return Math.max(20, Math.min(calculatedOffset, 580));
                } else return (d.source.y + d.target.y) / 2;*/
                return Math.max(20, Math.min(d.source.y -40, 580));
            } else {
                // Per gli archi normali, posiziona le etichette al centro
                return (d.source.y + d.target.y) / 2;
            }
        })
            .style("text-anchor", "middle");


    }

    // Aggiungi la funzione di trascinamento per i nodi
    const dragHandler = d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);

// Applica la funzione di trascinamento ai nodi
    node.call(dragHandler);

// Definisci le funzioni per gestire l'inizio, il trascinamento e la fine del trascinamento
    function dragStarted(event, d) {
        countTemp=0;
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }


    loadGraphButton.setAttribute("disabled","");

}






