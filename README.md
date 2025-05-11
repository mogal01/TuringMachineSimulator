# Simulatore di Macchina di Turing

## Panoramica

Questo repository contiene un **Simulatore di Macchina di Turing**, un'applicazione web sviluppata per il corso di Elementi della Teoria della Computazione, utilizzando JavaScript, HTML e CSS. Il simulatore modella la funzionalità di una Macchina di Turing standard, di una Macchina di Turing a 3 nastri e di una Macchina di Turing non deterministica.

Disponibile al link: [https://github.com/mogal01/TuringMachineSimulator](https://mogal01.github.io/TuringMachineSimulator/)

## Caratteristiche

- **Simulazione della Macchina di Turing**: Simula il funzionamento di una Macchina di Turing. Permette l'inserimento del contenuto iniziale del nastro e delle istruzioni per la Macchina di Turing.
- **Esecuzione di ogni passo di computazione**: Include un pulsante "Next Step" per osservare l'operazione della Macchina di Turing ad ogni  passo di computazione.
- **Visualizzazione Grafica**: Presenta un pulsante "Load Graph" per mostrare una rappresentazione grafica del processo di calcolo della Macchina di Turing tramite nodi e archi grazie al framework D3.js.
- **Varianti Multiple**: Supporta simulazioni sia della Macchina di Turing standard, sia di quella a 3 nastri, sia di quella non deterministica.

## Installazione ed utilizzo

Il simulatore è un'applicazione lato client che funziona in un browser web. Per utilizzarlo:

1. Clona o scarica questo repository.
2. Apri il file `index.html` in un browser web.

Non è richiesta alcuna installazione o configurazione aggiuntiva.

## Input

- Apri `index.html` in un browser web.
- La pagina presenta in basso, il campo di input principale per inserire configurazioni del tipo "(q0,1,0,R,q1)". Dove rappresentano:
  q0 - Lo stato corrente nel momento della lettura del simbolo.
  1 - il simbolo letto sulla cella puntata sul nastro.
  0 - il simbolo scritto sulla cella puntata sul nastro.
  R - la direzione (Right) in cui si sposterà la testina.
  q1 - Lo stato che la MdT raggiungerà al termine dello step di computazione.
  **è importante che lo stato iniziale sia sempre indicato come "q0"**
- A lato, è possibile inserire l'input iniziale presente sul nastro.
- è inoltre possibile caricare delle computazioni pre-impostate a lato della pagina con il pulsante "load computation".

## Struttura dei File

Il progetto è organizzato come segue:

### Pagine HTML
- `index.html`: Pagina di simulazione della Macchina di Turing standard a singolo nastro.
- `MultiTapeTuringMachine.html`: Pagina per la simulazione della Macchina di Turing a 3 nastri.
- `NonDeterministicTuringMachine.html`: Pagina per la simulazione della Macchina di Turing non deterministica.

Ognuna di queste pagine presenta l'interfaccia utente per la simulazione della rispettiva tipologia di Macchina di Turing.

### File JavaScript
- `TuringMachine.js`: Contiene la logica del simulatore. Questo file definisce la classe `TuringMachine`, che modella un oggetto di Macchina di Turing con un nastro composto da 11 celle. I metodi `run()` e `step()` permettono di inizializzare la Macchina di Turing e di eseguire ogni passo di computazione inserito nell'input della pagina. Vi sono inoltre principalmente `moveHead(direction)` e `updateTapeDisplay(tape,headPosition)` come principali metodi per gestire i movimenti del nastro al centro della pagina.
- `Graph.js`: Utilizza il framework d3.js per creare un grafico della computazione. Questo grafico viene visualizzato nella parte inferiore della pagina di simulazione.
- `MultiTapeTuringMachine.js`ha un'implementazione analoga ma adattata all'uso di 3 nastri.
- `NonDeterministicTuringMachine.js`presenta (al momento) solo la possibilità di sviluppare un grafico rappresentante l'albero delle computazioni di una macchina non deterministica.

Ogni file JavaScript è strettamente integrato con la corrispondente pagina HTML per fornire una simulazione interattiva e visiva delle diverse Macchine di Turing.

