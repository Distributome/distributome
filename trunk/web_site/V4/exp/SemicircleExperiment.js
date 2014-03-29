//Semicircle Distribution Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tX1\tX2\tY";
var dist;
var aParam, rParam;
var recordTable, distTable;
var runButton, stepButton, quantileCanvas, distCanvas, stopSelect, showSelect;
var a = 0, r = 1;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	distCanvas = document.getElementById("distCanvas");
	quantileCanvas = document.getElementById("quantileCanvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(-10, 10, 0.1, a, "<var>a</var>");
	rParam = new Parameter(document.getElementById("rInput"), document.getElementById("rLabel"));
	rParam.setProperties(0.5, 10, 0.1, r, "<var>r</var>");
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
	r = rParam.getValue();
	completeRecord = "";
	recordTable.value = header;
	dist = new SemiCircleDistribution(a, r);
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


