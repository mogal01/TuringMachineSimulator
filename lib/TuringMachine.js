


	let turingMachine;
	let buttonListenerBoolean=false; //è una variabile di debug che si occupa di assicurare che i listener sui pulsanti moveRightButtonLeft e Right siano aggiunti solo una volta
	let currentStatelabel=document.getElementById("currentState");
	let stateSetLabel =document.getElementById("stateSet");
	let mdtAlphabetLabel=document.getElementById("mdtAlphabet");
	let tapeAlphabetLabel=document.getElementById("tapeAlphabet");
	let tapeContent;
	let nextStepButton =document.getElementById("nextStep");
	let moveHeadRightButton=document.getElementById("moveRight");
	let moveHeadLeftButton=document.getElementById("moveLeft");
	let startingTape=document.getElementById("startingTape");
	let visibleCellsCount = 11;
	let tapeContentIndex=0;
	let transitionsInputTextArea=document.getElementById('transitionsInput');
	let runComputationButton=document.getElementById("runComputationButton");
	let loadGraphButton2=document.getElementById("loadGraphButton");
	loadGraphButton2.setAttribute("disabled","");
	moveHeadRightButton.setAttribute("disabled","");
	moveHeadLeftButton.setAttribute("disabled","");



 class TuringMachine {
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
				console.log("Avvio la funzione di transizione");
				// Applica la funzione di transizione
				this.tape[this.headPosition] = transition.writeSymbol;
				/*this.headPosition += transition.move === 'R' ? 1 : -1;
				this.headPosition = this.headPosition === -1 ? 0 : this.headPosition;*/ //non permette alla testina di scendere sotto lo 0

				this.moveHead(transition.move === 'R' ? 'right' : 'left');

				this.currentState = transition.nextState;
				currentStatelabel.innerText = this.currentState;

		} else {
			// Se non c'è transizione, raggiungiamo lo stato di rifiuto
			this.currentState = this.rejectState;
			currentStatelabel.innerText = this.currentState;
		}

		//extendTape(this.tape,this.headPosition);
		generate(this.tape,this.headPosition);
		//cellPointing(this.headPosition);

		// Verifica se la simulazione è giunta a una conclusione
		if (this.currentState === this.acceptState || this.currentState === this.rejectState) {
			nextStepButton.setAttribute("disabled",'');
			return false; // Simulazione conclusa
		}

		return true; // Continua la simulazione
	}

	// Esegui la simulazione fino alla fine
	run() {
		//while (this.step()) {}
		generate(this.tape,this.headPosition);
		cellPointing(this.headPosition);
		nextStepButton.removeAttribute("disabled");
		return this.currentState === this.acceptState;

	}

	moveHead(direction) {
		 const cells = document.querySelectorAll('.cell');

		 if(direction==='left' && this.headPosition>0){
			 this.headPosition--;
			 console.log("La testina è a posizione: " + this.headPosition);
			 console.log("Il nastro questa mdt è " + this.tape);
			 if(tapeContentIndex>0)
				 tapeContentIndex--;

			 if(this.headPosition>4){
				reduceTape(this.tape,this.headPosition);
				 // Sposta il contenuto dei div a sinistra
				 for (let i = cells.length - 1; i > 0; i--) {
					 cells[i].textContent = cells[i - 1].textContent;
				 }
				 cells[0].textContent = tapeContent[tapeContentIndex-5] || '_';

			 }
		 }
		 if(direction==='right'){
			 this.headPosition++;
			 tapeContentIndex++;
			 console.log("La testina è a posizione: " + this.headPosition);
			 if(this.headPosition>5){
				 console.log("Sono a riga 120");
				 extendTape(this.tape,this.headPosition);
				 // Sposta il contenuto dei div a destra
				 for (let i = 0; i < cells.length - 1; i++) {
					 cells[i].textContent = cells[i + 1].textContent;
				 }
				 cells[cells.length - 1].textContent = tapeContent[tapeContentIndex+5] || '_';
			 }
		 }


		 updateTapeDisplay(this.tape,this.headPosition);
	 }

}



function inizialize(transitions)
{
	resetGraph();
	updateTapeDisplay(startingTape,0);
	tapeAlphabetLabel.innerText="";
	stateSetLabel.innerText="";
	mdtAlphabetLabel.innerText="";
	let parsedTransitions = transitions.map(parseTransition);
	if(NonDeterministicCheck(parsedTransitions)){
		Swal.fire({
			icon: "error",
			title: "Non Deterministic Error",
			text: "You have entered a Non-Deterministic Input",
		});
		return;
	}
	let setStates=[];
	let tapeAlphabet=[];
	let mdtAlphabet=[];
	parsedTransitions.forEach((transition,index) => {setStates[index]=transition.currentState; tapeAlphabet[index]=transition.readSymbol; mdtAlphabet[index]=transition.writeSymbol; createGraph(transition);});
	turingMachine = new TuringMachine(
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
	currentStatelabel.innerText=turingMachine.initialState;

	turingMachine.run();

	moveHeadLeftButton.removeAttribute("disabled");
	moveHeadRightButton.removeAttribute("disabled");
	if(!buttonListenerBoolean){
	nextStepButton.addEventListener('click',function(){turingMachine.step()});
	moveHeadRightButton.addEventListener('click', function() {turingMachine.moveHead('right')});
	moveHeadLeftButton.addEventListener('click', function(){turingMachine.moveHead('left')});
	buttonListenerBoolean=true;
	}
}




function generate(tape,headPosition){

	// Esempio di generazione dinamica delle celle del nastro

	while(tape.length<visibleCellsCount){
		tape.push('_');
	}
	tapeContent = tape;

	const cells = document.querySelectorAll('.cell');

	let i=tapeContentIndex-5;
	if(headPosition<5) {
		console.log("Riga 204");
		cells.forEach((cell, index) => {
			// Utilizza '_' se si raggiunge la fine del nastro
			cell.textContent = tapeContent[index] || '_';

			/*if (index === headPosition) {
				cell.classList.add('active');
			} else {
				cell.classList.remove('active');
			}*/

		})
	} else {
		cells.forEach((cell, index) => {
			// Utilizza '_' se si raggiunge la fine del nastro
			cell.textContent = tapeContent[i] || '_';
			i++;
			/*if (index === headPosition) {
				cell.classList.add('active');
			} else {
				cell.classList.remove('active');
			}*/

		})
	}

}



function cellPointing(cellNumber) {
	if(startingTape.value!=="") {
		// Esempio di evidenziazione della cella attiva
		const activeCellIndex = cellNumber; // Indice della cella attiva
		const cells = document.querySelectorAll('.cell');

		cells[activeCellIndex].classList.add('active');
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
	loadGraphButton2.removeAttribute("disabled");
	}
}


function NonDeterministicCheck(transitions){
	let visitedStates = new Set();

	for (const transition of transitions) {
		let key = transition.currentState+" " + transition.readSymbol;
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
		transitionsInputTextArea.value = "(q0,1,_,R,q1)\n"+
		"(q1,1,1,R,q1)\n"+
		"(q1,0,1,R,q2)\n"+
		"(q2,1,1,R,q2)\n"+
		"(q2,_,_,L,q3)\n"+
		"(q3,1,0,L,q4)\n"+
		"(q4,1,1,L,q4)\n"+
		"(q4,_,1,R,q5)\n"+
		"(q5,1,1,L,qAccept)";
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



	function extendTape(tape,headPosition){
		const cells = document.querySelectorAll('.cell');
		// Se la testina si sposta oltre il bordo del nastro, estendilo
		if(tapeContent.length<=tapeContentIndex+6)
		tape.push('_');
		//writeTape(tape,headPosition);

	}

	function reduceTape(tape,headPosition){
		// Rimuovi l'ultimo '_'
		if (tape.length > 1 && tape[tape.length - 1] === '_') {
			tape.pop();
		}
	  //	writeTape(tape,headPosition);

	}



	function updateTapeDisplay(tape,headPosition) {

		const cells = document.querySelectorAll('.cell');
		let activeCell=cells[headPosition];
		if(headPosition>4)
			activeCell = cells[5];

		cells.forEach(cell => cell.classList.remove('active'));

		activeCell.classList.add('active');
	}

	runComputationButton.addEventListener('click',function(){processTransitions()});






