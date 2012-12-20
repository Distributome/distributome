//Weibull Distribution Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tU\tX";
var dist, quantileGraph, distGraph, distTable;
var kParam, bParam;
var recordTable, distTable;
var runButton, stepButton, quantileCanvas, distCanvas, stopSelect;
var k = 1, b = 1;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	distCanvas = document.getElementById("distCanvas");
	quantileCanvas = document.getElementById("quantileCanvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	kParam = new Parameter(document.getElementById("kInput"), document.getElementById("kLabel"));
	kParam.setProperties(0.5, 50, 0.1, k, "<var>k</var>");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(0.5, 50, 0.1, b, "<var>b</var>");
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
	k = kParam.getValue();
	b = bParam.getValue();
	completeRecord = "";
	recordTable.value = header;
	dist = new WeibullDistribution(k, b);
	distGraph = new DistributionGraph(distCanvas, dist, "X");
	distGraph.draw();
	distTable.value = distGraph.text();
	quantileGraph = new QuantileGraph(quantileCanvas, dist);
	quantileGraph.setGraphType(CDF);
	quantileGraph.draw();
}

function simulate(){
	runCount++;
	stopCount++;
	var u, x;
	u = Math.random();
	x = dist.quantile(u);
	dist.setValue(x);
	distGraph.draw();
	distTable.value = distGraph.text();
	quantileGraph.setProb(u);
	currentRecord = runCount + "\t" + u.toFixed(3) + "\t" + x.toFixed(3);
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

