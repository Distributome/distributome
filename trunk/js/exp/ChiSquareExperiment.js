//Chi-Square Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10, coinCount = 10;
var currentRecord, completeRecord = "", header = "Run\tV";
var normalDist, chiSquareDist, normalDistGraph, chiSquareDistGraph;
var muParam, sigmaParam, nParam;
var recordTable, chiSquareDistTable;
var runButton, stepButton, normalDistCanvas, chiSquardDistCanvas, stopSelect, showSelect;
var mu = 0, sigma = 1, n = 5;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	normalDistCanvas = document.getElementById("normalDistCanvas");
	chiSquareDistCanvas = document.getElementById("chiSquareDistCanvas");
	chiSquareDistTable = document.getElementById("chiSquareDistTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(2, 50, 1, n, "<var>n</var>");
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
	n = nParam.getValue();
	mu = muParam.getValue();
	sigma = sigmaParam.getValue();
	completeRecord = "";
	recordTable.value = header;
	normalDist = new NormalDistribution(mu, sigma);
	normalDistGraph = new DistributionGraph(normalDistCanvas, normalDist, "X");
	normalDistGraph.showDist(showCheck.checked);
	chiSquareDist = new ChiSquareDistribution(n);
	chiSquareDistGraph = new DistributionGraph(chiSquareDistCanvas, chiSquareDist, "V");
	chiSquareDistGraph.showDist(showCheck.checked);
	chiSquareDistTable.value = chiSquareDistGraph.text;
}

function simulate(){
	runCount++;
	stopCount++;
	normalDist.data.reset();
	var sum = 0, x, z;
	for (var i = 0; i < n; i++){
		x = normalDist.simulate();
		z = (x - mu) / sigma;
		sum = sum + z * z;
	}
	chiSquareDist.setValue(sum);
	currentRecord = runCount + "\t" + sum.toFixed(3);
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
	normalDistGraph.draw();
	chiSquareDistGraph.draw();
	chiSquareDistTable.value = chiSquareDistGraph.text;
}

function showDist(b){
	normalDistGraph.showDist(b);
	chiSquareDistGraph.showDist(b);
	chiSquareDistTable.value = chiSquareDistGraph.text;
}

