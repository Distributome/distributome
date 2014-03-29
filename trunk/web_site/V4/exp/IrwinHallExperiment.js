//Student Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10, coinCount = 10;
var currentRecord, completeRecord = "", header = "Run\tY";
var xDist, yDist, xDistGraph, yDistGraph, nParam;
var recordTable, yDistTable;
var runButton, stepButton, xDistCanvas, yDistCanvas, stopSelect, showSelect;
var n = 1;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	xDistCanvas = document.getElementById("xDistCanvas");
	yDistCanvas = document.getElementById("yDistCanvas");
	yDistTable = document.getElementById("yDistTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, 10, 1, n, "<var>n</var>");
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
	n = nParam.getValue();
	completeRecord = "";
	recordTable.value = header;
	xDist = new UniformDistribution(0, 1);
	xDistGraph = new DistributionGraph(xDistCanvas, xDist, "X");
	xDistGraph.showDist(showCheck.checked);
	yDist = new IrwinHallDistribution(n);
	yDistGraph = new DistributionGraph(yDistCanvas, yDist, "Y");
	yDistGraph.showDist(showCheck.checked);
	yDistTable.value = yDistGraph.text();
}

function simulate(){
	var t, m, s;
	runCount++;
	stopCount++;
	xDist.data().reset();
	var y = 0;
	for (var i = 0; i < n; i++) y = y + xDist.simulate();
	yDist.setValue(y);
	currentRecord = runCount + "\t" + y.toFixed(3);
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
	xDistGraph.draw();
	yDistGraph.draw();
	yDistTable.value = yDistGraph.text();
}

function showDist(b){
	xDistGraph.showDist(b);
	yDistGraph.showDist(b);
	yDistTable.value = yDistGraph.text();
}

