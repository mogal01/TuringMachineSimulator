


let MTTuringMachine;
let buttonListenerBoolean=false; //è una variabile di debug che si occupa di assicurare che i listener sui pulsanti moveRightButtonLeft e Right siano aggiunti solo una volta
let currentStatelabel=document.getElementById("currentState");
let stateSetLabel =document.getElementById("stateSet");
let mdtAlphabetLabel=document.getElementById("mdtAlphabet");
let tapeAlphabetLabel=document.getElementById("tapeAlphabet");
let tapeContent1;
let tapeContent2;
let tapeContent3;
let nextStepButton =document.getElementById("nextStep");

let moveHeadRightButton1=document.getElementById("moveRight-1");
let moveHeadLeftButton1=document.getElementById("moveLeft-1");
let moveHeadRightButton2=document.getElementById("moveRight-2");
let moveHeadLeftButton2=document.getElementById("moveLeft-2");
let moveHeadRightButton3=document.getElementById("moveRight-3");
let moveHeadLeftButton3=document.getElementById("moveLeft-3");

let startingTape=document.getElementById("startingTape");
let startingTape2=document.getElementById("startingTape-2");
let startingTape3=document.getElementById("startingTape-3");
let visibleCellsCount = 11;
let tape1ContentIndex=0;
let tape2ContentIndex=0;
let tape3ContentIndex=0;
let transitionsInputTextArea=document.getElementById('transitionsInput');
let runComputationButton=document.getElementById("runComputationButton");
let loadGraphButton2=document.getElementById("loadGraphButton");
loadGraphButton2.setAttribute("disabled","");
moveHeadRightButton1.setAttribute("disabled","");
moveHeadLeftButton1.setAttribute("disabled","");
moveHeadRightButton2.setAttribute("disabled","");
moveHeadLeftButton2.setAttribute("disabled","");
moveHeadRightButton3.setAttribute("disabled","");
moveHeadLeftButton3.setAttribute("disabled","");



class MultiTapeTuringMachine {
    constructor(states, alphabet, tapeAlphabet, transitions, initialState, acceptState, rejectState) {
        this.states = states; //insieme degli stati
        this.alphabet = alphabet; //alfabeto
        this.tapeAlphabet = tapeAlphabet; //alfabeto del nastro
        this.transitions = transitions; //funzione di transizione
        this.currentState = initialState; //stato iniziale
        this.acceptState = acceptState; //stato finale
        this.rejectState = rejectState; //stato di rifiuto
        this.tape1 = startingTape.value.split(''); //inizializza il nastro con il contenuto di StartingTape
        this.tape2 = startingTape2.value.split('');
        this.tape3 = startingTape3.value.split('');
        this.headPosition1 = 0; //posizione iniziale della testina del nastro
        this.headPosition2 = 0;
        this.headPosition3 = 0;
        this.initialState = initialState;
    }


    // Esegui un passo della simulazione
    step() {
        let currentSymbol = this.tape1[this.headPosition1];
        let currentSymbol2 = this.tape2[this.headPosition2];
        let currentSymbol3 = this.tape3[this.headPosition3];

        /*this.transitions.forEach(t => {
            t.readSymbol = t.readSymbol.split('/');
            console.log("read Symbol:" + t.readSymbol[0] + t.readSymbol[1] + t.readSymbol[2]);
            t.writeSymbol = t.writeSymbol.split('/');
            console.log("write Symbol:" + t.writeSymbol[0] + t.writeSymbol[1] + t.writeSymbol[2]);
            t.move = t.move.split('/');
            console.log("move:" + t.move[0] + t.move[1] + t.move[2]);
        });*/

        console.log("currentSymbol1: " + currentSymbol + "currentSymbol2: " + currentSymbol2 + "currentSymbol3" + currentSymbol3);
        console.log("current state: " + this.currentState);

        console.log(this.transitions[0].readSymbol[0] === currentSymbol);
        console.log(this.transitions[0].readSymbol[1] === currentSymbol2);
        console.log(this.transitions[0].readSymbol[2] === currentSymbol3);

        // Gira nella struttura di transition e trova tutte le transizioni che hanno lo stato uguale allo stato corrente e il simbolo letto uguale al simbolo corrente
        let transition = this.transitions.find((t) => t.currentState === this.currentState && t.readSymbol[0] === currentSymbol && t.readSymbol[1] === currentSymbol2 && t.readSymbol[2] === currentSymbol3);


        if (transition) {
            console.log("Avvio la funzione di transizione");
            // Applica la funzione di transizione
            console.log(transition[0]);
            this.tape1[this.headPosition1] = transition.writeSymbol[0];
            this.tape2[this.headPosition2] = transition.writeSymbol[1];
            this.tape3[this.headPosition3] = transition.writeSymbol[2];
            if(transition.move[0]!=='S') {
                console.log("Muovo la testina");
                this.moveHeadMultiTape(transition.move[0] === 'R' ? 'right' : 'left',1);
                /*this.headPosition1 += transition.move[0] === 'R' ? 1 : -1;
                this.headPosition1 = this.headPosition1 === -1 ? 0 : this.headPosition1;*/ //non permette alla testina di scendere sotto lo 0
            }

            if(transition.move[1]!=='S') {
                this.moveHeadMultiTape(transition.move[1] === 'R' ? 'right' : 'left',2);
                /*this.headPosition2 += transition.move[1] === 'R' ? 1 : -1;
                this.headPosition2 = this.headPosition2 === -1 ? 0 : this.headPosition2;*/ //non permette alla testina di scendere sotto lo 0
            }

            if(transition.move[2]!=='S') {
                this.moveHeadMultiTape(transition.move[2] === 'R' ? 'right' : 'left',3);
                /*this.headPosition3 += transition.move[2] === 'R' ? 1 : -1;
                this.headPosition3 = this.headPosition3 === -1 ? 0 : this.headPosition3;*/ //non permette alla testina di scendere sotto lo 0
            }
            this.currentState = transition.nextState;
            currentStatelabel.innerText = this.currentState;

        } else {
            // Se non c'è transizione, raggiungiamo lo stato di rifiuto
            this.currentState = this.rejectState;
            currentStatelabel.innerText = this.currentState;
        }
        generate(this.tape1, this.headPosition1, 1);
        generate(this.tape2, this.headPosition2, 2);
        generate(this.tape3, this.headPosition3, 3);

        extendTape(this.tape1);
        extendTape(this.tape2);
        extendTape(this.tape3);

        /*cellPointing(this.headPosition1, 1);
        cellPointing(this.headPosition2, 2);
        cellPointing(this.headPosition3, 3);*/

        tapeContent1=this.tape1;
        tapeContent2=this.tape2;
        tapeContent3=this.tape3;


        // Verifica se la simulazione è giunta a una conclusione
        if (this.currentState === this.acceptState || this.currentState === this.rejectState) {
            nextStepButton.setAttribute("disabled", '');
            return false; // Simulazione conclusa
        }

        return true; // Continua la simulazione
    }

    // Esegui la simulazione fino alla fine
    run() {
        //while (this.step()) {}
        generate(this.tape1, this.headPosition1, 1);
        generate(this.tape2, this.headPosition2, 2);
        generate(this.tape3, this.headPosition3, 3);
        cellPointing(this.headPosition1, 1);
        cellPointing(this.headPosition2, 2);
        cellPointing(this.headPosition3, 3);
        tapeContent1=this.tape1;
        tapeContent2=this.tape2;
        tapeContent3=this.tape3;
        nextStepButton.removeAttribute("disabled");
        return this.currentState === this.acceptState;

    }

    moveHeadMultiTape(direction, tapeNumber) {
        let cells;

        if (tapeNumber === 1) {
            cells = document.querySelectorAll('.cell');
            if (direction === 'left' && this.headPosition1 > 0) {
                this.headPosition1--;
                if (tape1ContentIndex > 0)
                    tape1ContentIndex--;

                if (this.headPosition1 > 4) {
                    reduceTape(this.tape1);
                    // Sposta il contenuto dei div a sinistra
                    for (let i = cells.length - 1; i > 0; i--) {
                        cells[i].textContent = cells[i - 1].textContent;
                    }
                    cells[0].textContent = tapeContent1[tape1ContentIndex - 5] || '_';

                }
            }
            if (direction === 'right') {
                this.headPosition1++;
                tape1ContentIndex++;
                if (this.headPosition1 > 5) {
                    extendTape(this.tape1);
                    // Sposta il contenuto dei div a destra
                    for (let i = 0; i < cells.length - 1; i++) {
                        cells[i].textContent = cells[i + 1].textContent;
                    }
                    cells[cells.length - 1].textContent = tapeContent1[tape1ContentIndex + 5] || '_';
                }
            }

            updateTapeDisplay(this.tape1, this.headPosition1,tapeNumber)
        }

        if (tapeNumber === 2) {
            cells = document.querySelectorAll('.cell2');
            if (direction === 'left' && this.headPosition2 > 0) {
                this.headPosition2--;
                if (tape2ContentIndex > 0)
                    tape2ContentIndex--;

                if (this.headPosition2 > 4) {
                    reduceTape(this.tape2);
                    // Sposta il contenuto dei div a sinistra
                    for (let i = cells.length - 1; i > 0; i--) {
                        cells[i].textContent = cells[i - 1].textContent;
                    }
                    cells[0].textContent = tapeContent2[tape2ContentIndex - 5] || '_';

                }
            }
            if (direction === 'right') {
                this.headPosition2++;
                tape2ContentIndex++;
                if (this.headPosition2 > 5) {
                    extendTape(this.tape2);
                    // Sposta il contenuto dei div a destra
                    for (let i = 0; i < cells.length - 1; i++) {
                        cells[i].textContent = cells[i + 1].textContent;
                    }
                    cells[cells.length - 1].textContent = tapeContent2[tape2ContentIndex + 5] || '_';
                }
            }

            updateTapeDisplay(this.tape2, this.headPosition2,tapeNumber)
        }

        if (tapeNumber === 3) {
            cells = document.querySelectorAll('.cell3');
            if (direction === 'left' && this.headPosition3 > 0) {
                this.headPosition3--;
                if (tape3ContentIndex > 0)
                    tape3ContentIndex--;

                if (this.headPosition3 > 4) {
                    reduceTape(this.tape3);
                    // Sposta il contenuto dei div a sinistra
                    for (let i = cells.length - 1; i > 0; i--) {
                        cells[i].textContent = cells[i - 1].textContent;
                    }
                    cells[0].textContent = tapeContent3[tape3ContentIndex - 5] || '_';

                }
            }
            if (direction === 'right') {
                this.headPosition3++;
                tape3ContentIndex++;
                if (this.headPosition3 > 5) {
                    extendTape(this.tape3);
                    // Sposta il contenuto dei div a destra
                    for (let i = 0; i < cells.length - 1; i++) {
                        cells[i].textContent = cells[i + 1].textContent;
                    }
                    cells[cells.length - 1].textContent = tapeContent3[tape3ContentIndex + 5] || '_';
                }
            }

            updateTapeDisplay(this.tape3, this.headPosition3,tapeNumber)
        }
    }

}



function inizialize(transitions)
{
    resetGraph();
    updateTapeDisplay(startingTape,0,1);
    updateTapeDisplay(startingTape2,0,2);
    updateTapeDisplay(startingTape3,0,3);
    tapeAlphabetLabel.innerText="";
    stateSetLabel.innerText="";
    mdtAlphabetLabel.innerText="";
    let parsedTransitions = transitions.map(parseTransition);
    let setStates=[];
    let tapeAlphabet=[];
    let mdtAlphabet=[];

    parsedTransitions.forEach(t => {
        t.readSymbol = t.readSymbol.split('/');
        t.writeSymbol = t.writeSymbol.split('/');
        t.move = t.move.split('/');
    });

    if(NonDeterministicCheck(parsedTransitions)){
        Swal.fire({
            icon: "error",
            title: "Non Deterministic Error",
            text: "You have entered a Non-Deterministic Input",
        });
        return;
    }


    parsedTransitions.forEach((transition) => {
        setStates.push(transition.currentState);
        //setStates[index]=transition.currentState;
        transition.readSymbol.forEach(s => tapeAlphabet.push(s));
        //tapeAlphabet[index]=transition.readSymbol;
        transition.writeSymbol.forEach(s => mdtAlphabet.push(s));
        //mdtAlphabet[index]=transition.writeSymbol;
        createGraph(transition);
        });

    MTTuringMachine = new MultiTapeTuringMachine(
        ['q0', 'qAccept', 'qReject'],
        ['0', '1'],
        ['0', '1', '_'],
        /*[
            {currentState: 'q0', readSymbol: '0', writeSymbol: '1', move: 'R', nextState: 'q1'},
            {currentState: 'q1', readSymbol: '0', writeSymbol: '0', move: 'L', nextState: 'q0'},
            {currentState: 'q2', readSymbol: '0', writeSymbol: '1', move: 'R', nextState: 'qAccept'},
            {currentState: 'q0', readSymbol: '1', writeSymbol: '0', move: 'R', nextState: 'q1'},
            {currentState: 'q0', readSymbol: '_', writeSymbol: '_', move: 'R', nextState: 'qAccept'},
        ]*/ parsedTransitions,
        'q0',
        'qAccept',
        'qReject',
    );
    console.log("MDT inizializzata");
    setStates = [...new Set(setStates)];
    tapeAlphabet.push('_');
    tapeAlphabet= [...new Set(tapeAlphabet)];
    mdtAlphabet=[...new Set(mdtAlphabet)];
    tapeAlphabet.forEach(symbol => tapeAlphabetLabel.innerText+=" " + symbol);
    setStates.forEach(state => stateSetLabel.innerText+=" " + state);
    mdtAlphabet.forEach(symbol => mdtAlphabetLabel.innerText+=" " + symbol);
    currentStatelabel.innerText=MTTuringMachine.initialState;

    MTTuringMachine.run();

    moveHeadLeftButton1.removeAttribute("disabled");
    moveHeadRightButton1.removeAttribute("disabled");
    moveHeadLeftButton2.removeAttribute("disabled");
    moveHeadRightButton2.removeAttribute("disabled");
    moveHeadLeftButton3.removeAttribute("disabled");
    moveHeadRightButton3.removeAttribute("disabled");
    if(!buttonListenerBoolean){
        nextStepButton.addEventListener('click',function(){MTTuringMachine.step()});
        moveHeadRightButton1.addEventListener('click', function() {MTTuringMachine.moveHeadMultiTape('right',1)});
        moveHeadLeftButton1.addEventListener('click', function(){MTTuringMachine.moveHeadMultiTape('left',1)});
        moveHeadRightButton2.addEventListener('click', function() {MTTuringMachine.moveHeadMultiTape('right',2)});
        moveHeadLeftButton2.addEventListener('click', function(){MTTuringMachine.moveHeadMultiTape('left',2)});
        moveHeadRightButton3.addEventListener('click', function() {MTTuringMachine.moveHeadMultiTape('right',3)});
        moveHeadLeftButton3.addEventListener('click', function(){MTTuringMachine.moveHeadMultiTape('left',3)});
        buttonListenerBoolean=true;
    }
}




function generate(tapeSelected,headPosition,tapeNumber){

    // Esempio di generazione dinamica delle celle del nastro

    while(tapeSelected.length<visibleCellsCount){
        tapeSelected.push('_');
    }

    let cells;

    if(tapeNumber===1) {
        let i=tape1ContentIndex-5;
        cells = document.querySelectorAll('.cell');
        if(headPosition<5) {
            cells.forEach((cell, index) => {
                // Utilizza '_' se si raggiunge la fine del nastro
                cell.textContent = tapeSelected[index] || '_';
                /*if (index === headPosition) {
                    cell.classList.add('active');
                } else {
                    cell.classList.remove('active');
                }*/

            })
        } else{
            cells.forEach((cell, index) => {
            // Utilizza '_' se si raggiunge la fine del nastro
            cell.textContent = tapeSelected[i] || '_';
            i++;
            /*if (index === headPosition) {
                cell.classList.add('active');
            } else {
                cell.classList.remove('active');
            }*/

        })}
    }

    if(tapeNumber===2) {
        let i=tape2ContentIndex-5;
        cells=document.querySelectorAll('.cell2');
        if(headPosition<5) {
            cells.forEach((cell, index) => {
                // Utilizza '_' se si raggiunge la fine del nastro
                cell.textContent = tapeSelected[index] || '_';
                /*if (index === headPosition) {
                    cell.classList.add('active');
                } else {
                    cell.classList.remove('active');
                }*/

            })
        } else {
                cells.forEach((cell, index) => {
                // Utilizza '_' se si raggiunge la fine del nastro
                cell.textContent = tapeSelected[i] || '_';
                i++;
                /*if (index === headPosition) {
                    cell.classList.add('active');
                } else {
                    cell.classList.remove('active');
                }*/
                })
             }
    }

    if(tapeNumber===3) {
        let i=tape3ContentIndex-5;
        cells=document.querySelectorAll('.cell3');
        if(headPosition<5) {
            cells.forEach((cell, index) => {
                // Utilizza '_' se si raggiunge la fine del nastro
                cell.textContent = tapeSelected[index] || '_';
                    /*if (index === headPosition) {
                     cell.classList.add('active');
                 } else {
                     cell.classList.remove('active');
                 }*/

            })
        } else {
            cells.forEach((cell, index) => {
            // Utilizza '_' se si raggiunge la fine del nastro
            cell.textContent = tapeSelected[i] || '_';
            i++;
            /*if (index === headPosition) {
                cell.classList.add('active');
            } else {
                cell.classList.remove('active');
            }*/

            })
        }
    }

}



function cellPointing(cellNumber,tapeNumber) {
    if(startingTape.value!=="") {
        // Esempio di evidenziazione della cella attiva
        const activeCellIndex = cellNumber; // Indice della cella attiva
        let cells;

        if(tapeNumber===1) {
            cells = document.querySelectorAll('.cell');
        }
        if(tapeNumber===2) {
            cells = document.querySelectorAll('.cell2');
        }
        if(tapeNumber===3) {
            cells = document.querySelectorAll('.cell3');
        }
        cells[activeCellIndex].classList.add('active');
    }

}


function processTransitions() {

    tape1ContentIndex = 0;
    tape2ContentIndex=0;
    tape3ContentIndex=0;

    if (transitionsInputTextArea.value === "")
        Swal.fire({
            icon: "error",
            title: "Input Error",
            text: "Transitions Input must not be empty",
        });
    else {
        const transitionsInput = transitionsInputTextArea.value;
        const transitions = transitionsInput.split('\n').map(line => line.trim()).filter(line => line !== '');

        inizialize(transitions);
        loadGraphButton2.removeAttribute("disabled");
    }
    // Ora puoi elaborare l'array "transitions" per ottenere le transizioni della tua MDT
}


// Funzione per analizzare una singola transizione dal formato "(q0,0/1/2,1/2/3,R/R/R,q1)"
function parseTransition(transitionString) {
    const regex = /\(([^,]+),([^,]+),([^,]+),([^,]+),([^)]+)\)/;
    const match = transitionString.match(regex);

    if (match) {
        const [, currentState, readSymbol, writeSymbol, move, nextState] = match;
        return { currentState, readSymbol, writeSymbol, move, nextState };
    } else {
        Swal.fire({
            icon: "error",
            title: "Input Error",
            text: "Transition not accepted",
        });
        console.error('Formato transizione non valido:', transitionString);
        return null;
    }
}

function NonDeterministicCheck(transitions){
    let visitedStates = new Set();

    for (const transition of transitions) {
        let key = transition.currentState+" " + transition.readSymbol[0] + " " + transition.readSymbol[1] + " " + transition.readSymbol[2];
        console.log("key: " + key);

        if (visitedStates.has(key)) {
            // La transizione è già stata definita per lo stesso stato e simbolo letto
            return true;
        }

        visitedStates.add(key);
    }

    // Tutte le transizioni sono state validate
    return false;

}



function loadComputation(computation){
    if(computation==='1') {
        transitionsInputTextArea.value = "(q0,a/_/_,_/b/_,R/R/S,q0)\n" +
        "(q0,b/_/_,b/_/_,S/L/S,q1)\n" +
        "(q1,b/b/_,_/_/_,R/L/S,q1)\n" +
        "(q1,_/_/_,_/_/_,S/S/S,qAccept)\n";
    }

    if(computation==='2'){
        transitionsInputTextArea.value = "(q0,0,0,R,q1)\n" +
            "(q1,0,0,R,qReject)\n"+
            "(q1,1,1,R,qAccept)\n";

    }

    if(computation==='3'){
        transitionsInputTextArea.value ="(q0,a,_,R,q1)\n" +
            "(q0,_,_,R,qAccept)\n" +
            "(q1,a,a,R,q1)\n" +
            "(q1,b,b,R,q1)\n" +
            "(q1,_,_,L,q2)\n" +
            "(q2,b,_,L,q3)\n" +
            "(q3,a,a,L,q3)\n" +
            "(q3,b,b,L,q3)\n" +
            "(q3,_,_,R,q0)";
    }
}



function extendTape(tape){
    const cells = document.querySelectorAll('.cell');
    // Se la testina si sposta oltre il bordo del nastro, estendilo
    if(tape.length<=tape1ContentIndex+6)
        tape.push('_');
    //writeTape(tape,headPosition);

}

function reduceTape(tape){
    // Rimuovi l'ultimo '_'
    if (tape.length > 1 && tape[tape.length - 1] === '_') {
        tape.pop();
    }
    //	writeTape(tape,headPosition);

}


function updateTapeDisplay(tape,headPosition,tapeNumber) {
    let cells
    if(tapeNumber===1)
        cells = document.querySelectorAll('.cell');
    if(tapeNumber===2)
        cells = document.querySelectorAll('.cell2');
    if(tapeNumber===3)
        cells = document.querySelectorAll('.cell3');

    let activeCell=cells[headPosition];
    if(headPosition>4)
        activeCell = cells[5];

    cells.forEach(cell => cell.classList.remove('active'));

    activeCell.classList.add('active');
}

runComputationButton.addEventListener('click',function(){processTransitions()});






