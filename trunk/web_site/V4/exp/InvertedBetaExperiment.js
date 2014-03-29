//Inverted Beta Distribution Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tX\tY";
var betaDist, invertedBetaDist, betaDistGraph, invertedBetaDistGraph;
var aParam, bParam;
var recordTable, invertedBetaDistTable;
var runButton, stepButton, betaDistCanvas, invertedBetaDistCanvas, stopSelect, showSelect;
var a = 1, b = 1;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	betaDistCanvas = document.getElementById("betaDistCanvas");
	invertedBetaDistCanvas = document.getElementById("invertedBetaDistCanvas");
	invertedBetaDistTable = document.getElementById("invertedBetaDistTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(1, 50, 0.1, a, "<var>a</var>");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(1, 50, 0.1, b, "<var>b</var>");
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
	b = bParam.getValue();
	completeRecord = "";
	recordTable.value = header;
	betaDist = new BetaDistribution(a, b);
	betaDistGraph = new DistributionGraph(betaDistCanvas, betaDist, "X");
	betaDistGraph.showDist(showCheck.checked);
	invertedBetaDist = new BetaPrimeDistribution(a, b);
	invertedBetaDistGraph = new DistributionGraph(invertedBetaDistCanvas, invertedBetaDist, "Y");
	invertedBetaDistGraph.showDist(showCheck.checked);
	invertedBetaDistTable.value = invertedBetaDistGraph.text();
}

function simulate(){
	runCount++;
	stopCount++;
	betaDist.data().reset();
	var x, y;
	x = betaDist.simulate();
	y = x / (1 - x);
	invertedBetaDist.setValue(y);
	currentRecord = runCount + "\t" + x.toFixed(3) + "\t" + y.toFixed(3);
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
	betaDistGraph.draw();
	invertedBetaDistGraph.draw();
	invertedBetaDistTable.value = invertedBetaDistGraph.text();
}

function showDist(b){
	betaDistGraph.showDist(b);
	invertedBetaDistGraph.showDist(b);
	invertedBetaDistTable.value = invertedBetaDistGraph.text();
}

