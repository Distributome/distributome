//Discrete Uniform Distribution Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10, coinCount = 10;
var currentRecord, completeRecord = "", header = "Run\tX";
var dist, distGraph, aParam, nParam, stateSpace;
var recordTable, distTable;
var runButton, stepButton, distCanvas, stopSelect, showSelect;
var a = 1, n = 10;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	distCanvas = document.getElementById("distCanvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(-20, 20, 1, a, "<var>a</var>");
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(2, 50, 1, n, "<var>n</var>");
	resetExperiment();
}

function stepExperiment(){
	simulate();
	recordTable.value = header + completeRecord;
}

function runExperiment(){
	runID = setInterval(simulate, 20);
	stepButton.disabled = true;
	stopSelect.disabled = true;
}

function stopExperiment(){
	stopCount = 0;
	clearInterval(runID);
	stepButton.disabled = false;
	stopSelect.disabled = false;
	if (runCount > 0) recordTable.value = header + completeRecord;
}

function resetExperiment(){
	stopExperiment();
	runCount = 0; stopCount = 0;
	a = aParam.getValue();
	n = nParam.getValue();
	stateSpace = new StateSpace(document.getElementById("stateSpace"), a, a + n - 1, 1);
	stateSpace.setMargins(30, 20, 10, 10);
	stateSpace.r = 5;
	stateSpace.setInitialState(Infinity);
	completeRecord = "";
	recordTable.value = header;
	dist = new DiscreteUniformDistribution(a, n);
	distGraph = new DistributionGraph(distCanvas, dist, "X");
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text();
}

function simulate(){
	var x;
	runCount++;
	stopCount++;
	x = dist.simulate();
	//stateSpace.reset();
	stateSpace.setState(x);
	currentRecord = runCount + "\t" + x;
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
	distGraph.draw();
	distTable.value = distGraph.text();
}

function showDist(bool){
	distGraph.showDist(bool);
	distTable.value = distGraph.text();
}

