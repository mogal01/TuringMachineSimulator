


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
	let shifted=false;
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



	//si esegue un passo della simulazione
	step() {
		const currentSymbol = this.tape[this.headPosition];

		//gira nella struttura di transition e trova tutte le transizioni che hanno lo stato uguale allo stato corrente e il simbolo letto uguale al simbolo corrente
		const transition = this.transitions.find(t => t.currentState === this.currentState && t.readSymbol === currentSymbol);


		if (transition) {//funzione di transizione
			console.log("52");
				this.tape[this.headPosition] = transition.writeSymbol;

				this.moveHead(transition.move === 'R' ? 'right' : 'left');

				this.currentState = transition.nextState;
				currentStatelabel.innerText = this.currentState;
			/*if((this.currentState==='qShift')&&(!shifted)) {
				console.log("Riga 58");
				let tempTransition = loadComputation('shift');
				let backup=transitionsInputTextArea.value;
				transitionsInputTextArea.value=tempTransition;
				let tempInput=transitionsInputTextArea.value.split('\n').map(line => line.trim()).filter(line => line !== '');
				let tempParsedtransition = tempInput.map(parseTransition);
				let backupTransition=this.transitions;
				this.transitions=tempParsedtransition;
				console.log("riga 66");
				this.currentState='q0';
				while(this.step()){console.log("67");}
				this.transitions=backupTransition;
				transitionsInputTextArea.value=backup;
				this.currentState='qShift';
				shifted=true;
			}*/

		} else {
			//se non c'è transizione, raggiungiamo lo stato di rifiuto
			this.currentState = this.rejectState;
			currentStatelabel.innerText = this.currentState;
		}

		generate(this.tape,this.headPosition);

		//verifica se la simulazione è giunta a una conclusione
		if (this.currentState === this.acceptState || this.currentState === this.rejectState) {
			nextStepButton.setAttribute("disabled",'');
			return false; //simulazione conclusa
		}

		return true;
	}


	run() {
		generate(this.tape,this.headPosition);
		cellPointing(this.headPosition);
		nextStepButton.removeAttribute("disabled");
		return this.currentState === this.acceptState;

	}

	moveHead(direction) { //il principale metodo per spostare la testina
		 const cells = document.querySelectorAll('.cell');

		 if(direction==='left' && this.headPosition>0){
			 this.headPosition--;
			 if(tapeContentIndex>0)
				 tapeContentIndex--;

			 if(this.headPosition>8){
				reduceTape(this.tape,this.headPosition);
				 //sposta il contenuto dei div a sinistra (mantenendo la casella evidenziata centrale)
				 for (let i = cells.length - 1; i > 0; i--) {
					 cells[i].textContent = cells[i - 1].textContent;
				 }
				 cells[0].textContent = tapeContent[tapeContentIndex-9] || '_';
				 console.log(tapeContentIndex);

			 }
		 }
		 if(direction==='right'){
			 this.headPosition++;
			 tapeContentIndex++;
			 if(this.headPosition>9){
				 extendTape(this.tape,this.headPosition);
				 //sposta il contenuto dei div a destra (mantenendo la casella evidenziata centrale)
				 for (let i = 0; i < cells.length - 1; i++) {
					 cells[i].textContent = cells[i + 1].textContent;
				 }
				 cells[cells.length - 1].textContent = tapeContent[tapeContentIndex+1] || '_';
			 }
		 }


		 updateTapeDisplay(this.tape,this.headPosition);
	 }

}



function inizialize(transitions) //inizializzazione e configurazione della mdt
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

	setStates = [...new Set(setStates)];
	tapeAlphabet.push('_');
	tapeAlphabet= [...new Set(tapeAlphabet)];
	mdtAlphabet=[...new Set(mdtAlphabet)];
	tapeAlphabet.forEach(symbol => tapeAlphabetLabel.innerText+=" " + symbol);
	setStates.forEach(state => stateSetLabel.innerText+=" " + state);
	mdtAlphabet.forEach(symbol => mdtAlphabetLabel.innerText+=" " + symbol);

	turingMachine = new TuringMachine(
		['q0', 'qAccept', 'qReject'],
		mdtAlphabet,
		tapeAlphabet,
		parsedTransitions,
		'q0',
		'qAccept',
		'qReject',
	);

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

	//esempio di generazione dinamica delle celle del nastro

	while(tape.length<visibleCellsCount){
		tape.push('_');
	}
	tapeContent = tape;

	const cells = document.querySelectorAll('.cell');

	let i=tapeContentIndex-9;
	if(headPosition<9) {
		cells.forEach((cell, index) => {
			//utilizza '_' se si raggiunge la fine del nastro
			cell.textContent = tapeContent[index] || '_';

		})
	} else {
		cells.forEach((cell, index) => {
			//utilizza '_' se si raggiunge la fine del nastro
			cell.textContent = tapeContent[i] || '_';
			i++;

		})
	}

}



function cellPointing(cellNumber) {
	if(startingTape.value!=="") {
		//esempio di evidenziazione della cella attiva
		const activeCellIndex = cellNumber;
		const cells = document.querySelectorAll('.cell');

		cells[activeCellIndex].classList.add('active');
	}

}


function processTransitions() { //si occupa di processare l'input della computazione

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


function NonDeterministicCheck(transitions){ //Verifica se si tratta di una computazione non-deterministica
	let visitedStates = new Set();

	for (const transition of transitions) {
		let key = transition.currentState+" " + transition.readSymbol;

		if (visitedStates.has(key)) {
			return true;
		}

		visitedStates.add(key);
	}

	return false;

}

	//funzione per analizzare una singola transizione dal formato "(q0, 0, 1, R, q1)"
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


		let menu = document.getElementById("loadMenu");
		var opzioneSelezionata = menu.options[menu.selectedIndex].value;
	if(opzioneSelezionata==='1') {
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

	if(opzioneSelezionata==='2'){
		transitionsInputTextArea.value = "(q0,1,_,R,q1)\n" +
			"(q1,1,1,R,q1)\n"+
			"(q1,_,1,L,q3)\n"+
			"(q0,_,_,L,qAccept)\n"+
			"(q0,0,0,R,q2)\n"+
			"(q1,0,1,R,q2)\n"+
			"(q2,1,0,R,q1)\n"+
			"(q2,0,0,R,q2)\n"+
			"(q2,_,0,L,q3)\n"+
			"(q3,0,0,L,q3)\n"+
			"(q3,1,1,L,q3)\n"+
			"(q3,_,_,L,qAccept)\n";

	}

		if(opzioneSelezionata==='shift'){
			return "(q0,1,_,R,q1)\n" +
				"(q1,1,1,R,q1)\n" +
				"(q1,_,1,L,q3)\n" +
				"(q0,_,_,L,qAccept)\n" +
				"(q0,0,0,R,q2)\n" +
				"(q1,0,1,R,q2)\n" +
				"(q2,1,0,R,q1)\n" +
				"(q2,0,0,R,q2)\n" +
				"(q2,_,0,L,q3)\n" +
				"(q3,0,0,L,q3)\n" +
				"(q3,1,1,L,q3)\n" +
				"(q3,_,_,L,qAccept)\n";

		}

	if(opzioneSelezionata==='3'){
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

		if(opzioneSelezionata==='4'){
			transitionsInputTextArea.value ="(q0,1,X,R,q1)\n" +
				"(q1,0,0,R,q1)\n" +
				"(q1,1,1,R,q1)\n" +
				"(q1,_,_,L,q2)\n" +
				"(q2,1,0,L,q2)\n" +
				"(q2,0,1,L,q3)\n" +
				"(q2,X,0,L,qShift)\n" +
				"(q3,0,0,L,q3)\n" +
				"(q3,1,1,L,q3)\n" +
				"(q3,X,1,R,qAccept)\n";
		}
		return 1;
	}



	function extendTape(tape,headPosition){
		const cells = document.querySelectorAll('.cell');
		//si estende la testina con '_' in modo da avere sempre un nastro infinito
		if(tapeContent.length<=tapeContentIndex+6)
		tape.push('_');

	}

	function reduceTape(tape,headPosition){
		//rimuovi l'ultimo '_'
		if (tape.length > 1 && tape[tape.length - 1] === '_') {
			tape.pop();
		}

	}



	function updateTapeDisplay(tape,headPosition) {

		const cells = document.querySelectorAll('.cell');
		let activeCell=cells[headPosition];
		if(headPosition>8)
			activeCell = cells[9];

		if(headPosition<10){
			cells[0].style.border = '2px solid #ff8400'; // Cambia il bordo in rosso
		} else{
			cells[0].style.border = null; // o cella.style.border = '';
		}
		cells.forEach(cell => cell.classList.remove('active'));

		activeCell.classList.add('active');
	}

	runComputationButton.addEventListener('click',function(){processTransitions()});






