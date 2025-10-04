//Folded Normal Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tX\tY";
var normalDist, foldedNormalDist, normalDistGraph, foldedNormalDistGraph;
var muParam, sigmaParam;
var recordTable, foldedNormalDistTable;
var runButton, stepButton, normalDistCanvas, foldedNormalDistCanvas, stopSelect, showSelect;
var mu = 0, sigma = 1;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	normalDistCanvas = document.getElementById("normalDistCanvas");
	foldedNormalDistCanvas = document.getElementById("foldedNormalDistCanvas");
	foldedNormalDistTable = document.getElementById("foldedNormalDistTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	muParam = new Parameter(document.getElementById("muInput"), document.getElementById("muLabel"));
	muParam.setProperties(-10, 10, 0.1, mu, "<var>\u03BC</var>");
	sigmaParam = new Parameter(document.getElementById("sigmaInput"), document.getElementById("sigmaLabel"));
	sigmaParam.setProperties(0.5, 10, 0.1, sigma, "<var>\u03C3</var>");
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
	mu = muParam.getValue();
	sigma = sigmaParam.getValue();
	completeRecord = "";
	recordTable.value = header;
	normalDist = new NormalDistribution(mu, sigma);
	normalDistGraph = new DistributionGraph(normalDistCanvas, normalDist, "X");
	normalDistGraph.showDist(showCheck.checked);
	foldedNormalDist = new FoldedNormalDistribution(mu, sigma);
	foldedNormalDistGraph = new DistributionGraph(foldedNormalDistCanvas, foldedNormalDist, "Y");
	foldedNormalDistGraph.showDist(showCheck.checked);
	foldedNormalDistTable.value = foldedNormalDistGraph.text();
}

function simulate(){
	runCount++;
	stopCount++;
	normalDist.data().reset();
	var x, y;
	x = normalDist.simulate();
	y = Math.abs(x);
	foldedNormalDist.setValue(y);
	currentRecord = runCount + "\t" + x.toFixed(3) + "\t" + y.toFixed(3);
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
	normalDistGraph.draw();
	foldedNormalDistGraph.draw();
	foldedNormalDistTable.value = foldedNormalDistGraph.text();
}

function showDist(b){
	normalDistGraph.showDist(b);
	foldedNormalDistGraph.showDist(b);
	foldedNormalDistTable.value = foldedNormalDistGraph.text();
}

