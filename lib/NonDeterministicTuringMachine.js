


let turingMachine;
let buttonListenerBoolean=false; //è una variabile di debug che si occupa di assicurare che i listener sui pulsanti moveRightButtonLeft e Right siano aggiunti solo una volta
let currentStatelabel=document.getElementById("currentState");
let stateSetLabel =document.getElementById("stateSet");
let mdtAlphabetLabel=document.getElementById("mdtAlphabet");
let tapeAlphabetLabel=document.getElementById("tapeAlphabet");
let startingTape=document.getElementById("startingTape");
let visibleCellsCount = 11;
let tapeContentIndex=0;
let transitionsInputTextArea=document.getElementById('transitionsInput');
let runComputationButton=document.getElementById("runComputationButton");


class NonDeterministicTuringMachine {
    constructor(states, alphabet, tapeAlphabet, transitions, initialState, acceptState, rejectState) {
        this.states = states; //insieme degli stati
        this.alphabet = alphabet; //alfabeto
        this.tapeAlphabet = tapeAlphabet; //alfabeto del nastro
        this.transitions = transitions; //funzione di transizione
        this.currentState = initialState; //stato iniziale
        this.acceptState = acceptState; //stato finale
        this.rejectState = rejectState; //stato di rifiuto
        this.tape = startingTape.value.split(''); //inizializza il nastro con il contenuto di StartingTape
        this.headPosition = 0; //posizione iniziale della testina del nastro
        this.initialState=initialState;
    }



    // Esegui un passo della simulazione
    step() {
        const currentSymbol = this.tape[this.headPosition];

        // Gira nella struttura di transition e trova tutte le transizioni che hanno lo stato uguale allo stato corrente e il simbolo letto uguale al simbolo corrente
        const transition = this.transitions.find(t => t.currentState === this.currentState && t.readSymbol === currentSymbol);


        if (transition) {
            // Applica la funzione di transizione
            this.tape[this.headPosition] = transition.writeSymbol;
            /*this.headPosition += transition.move === 'R' ? 1 : -1;
            this.headPosition = this.headPosition === -1 ? 0 : this.headPosition;*/ //non permette alla testina di scendere sotto lo 0

            this.currentState = transition.nextState;
            currentStatelabel.innerText = this.currentState;

        } else {
            // Se non c'è transizione, raggiungiamo lo stato di rifiuto
            this.currentState = this.rejectState;
            currentStatelabel.innerText = this.currentState;
        }

        // Verifica se la simulazione è giunta a una conclusione
        if (this.currentState === this.acceptState || this.currentState === this.rejectState) {
            return false; // Simulazione conclusa
        }

        return true; // Continua la simulazione
    }

    // Esegui la simulazione fino alla fine
    run() {
        NDloadGraph();
        return this.currentState === this.acceptState;

    }

}



function inizialize(transitions)
{
    resetGraph();
    tapeAlphabetLabel.innerText="";
    stateSetLabel.innerText="";
    mdtAlphabetLabel.innerText="";
    let parsedTransitions = transitions.map(parseTransition);
    let setStates=[];
    let tapeAlphabet=[];
    let mdtAlphabet=[];
    parsedTransitions.forEach((transition,index) => {setStates[index]=transition.currentState; tapeAlphabet[index]=transition.readSymbol; mdtAlphabet[index]=transition.writeSymbol; createGraph(transition);});
    turingMachine = new NonDeterministicTuringMachine(
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
    setStates = [...new Set(setStates)];
    tapeAlphabet.push('_');
    tapeAlphabet= [...new Set(tapeAlphabet)];
    mdtAlphabet=[...new Set(mdtAlphabet)];
    tapeAlphabet.forEach(symbol => tapeAlphabetLabel.innerText+=" " + symbol);
    setStates.forEach(state => stateSetLabel.innerText+=" " + state);
    mdtAlphabet.forEach(symbol => mdtAlphabetLabel.innerText+=" " + symbol);
    //currentStatelabel.innerText=turingMachine.initialState;

    turingMachine.run();

    if(!buttonListenerBoolean){
       // nextStepButton.addEventListener('click',function(){turingMachine.step()});
        buttonListenerBoolean=true;
    }
}



function processTransitions() {

    tapeContentIndex = 0;

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
    }
    // Ora puoi elaborare l'array "transitions" per ottenere le transizioni della tua MDT
}


// Funzione per analizzare una singola transizione dal formato "(q0, 0, 1, R, q1)"
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

function loadComputation(computation){
    if(computation==='1') {
        transitionsInputTextArea.value = "(q0,1,1,R,q1)\n" +
        "(q1,1,0,R,q2)\n"+
        "(q1,1,0,R,q3)\n";
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

runComputationButton.addEventListener('click',function(){processTransitions()});






