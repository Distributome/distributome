//Exponential-Logarithmic Distribution Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tU\tX";
var dist, quantileGraph, distGraph, distTable;
var bParam, pParam;
var recordTable, distTable;
var runButton, stepButton, quantileCanvas, distCanvas, stopSelect;
var b = 1, p = 0.5;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	distCanvas = document.getElementById("distCanvas");
	quantileCanvas = document.getElementById("quantileCanvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(1, 10, 0.1, b, "<var>b</var>");
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0.1, 0.9, 0.01, p, "<var>p</var>");
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
	b = bParam.getValue();
	p = pParam.getValue();
	completeRecord = "";
	recordTable.value = header;
	dist = new ExponentialLogarithmicDistribution(p, b);
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
