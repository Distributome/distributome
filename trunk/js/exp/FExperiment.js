//F Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10, coinCount = 10;
var currentRecord, completeRecord = "", header = "Run\tSX\tSY\tV";
var xDist, yDist, fDist, xDistGraph, yDistGraph, fDistGraph;
var muParam, sigmaParam, mParam, nuParam, tauParam, nParam;
var recordTable, fDistTable;
var runButton, stepButton, xDistCanvas, yDistCanvas, fDistCanvas, stopSelect, showSelect;
var mu = 0, sigma = 1, m = 10, nu = 0, tau = 1, n = 10;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	xDistCanvas = document.getElementById("xDistCanvas");
	yDistCanvas = document.getElementById("yDistCanvas");
	fDistCanvas = document.getElementById("fDistCanvas");
	fDistTable = document.getElementById("fDistTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	mParam = new Parameter(document.getElementById("mInput"), document.getElementById("mLabel"));
	mParam.setProperties(5, 50, 1, m, "<var>m</var>");
	muParam = new Parameter(document.getElementById("muInput"), document.getElementById("muLabel"));
	muParam.setProperties(-10, 10, 0.1, mu, "<var>\u03BC</var>");
	sigmaParam = new Parameter(document.getElementById("sigmaInput"), document.getElementById("sigmaLabel"));
	sigmaParam.setProperties(0.5, 10, 0.1, sigma, "<var>\u03C3</var>");
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(5, 50, 1, n, "<var>n</var>");
	nuParam = new Parameter(document.getElementById("nuInput"), document.getElementById("nuLabel"));
	nuParam.setProperties(-10, 10, 0.1, nu, "<var>\u03BD</var>");
	tauParam = new Parameter(document.getElementById("tauInput"), document.getElementById("tauLabel"));
	tauParam.setProperties(0.5, 10, 0.1, tau, "<var>\u03C4</var>");
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
	m = mParam.getValue();
	mu = muParam.getValue();
	sigma = sigmaParam.getValue();
	n = nParam.getValue();
	nu = nuParam.getValue();
	tau = tauParam.getValue();
	completeRecord = "";
	recordTable.value = header;
	xDist = new NormalDistribution(mu, sigma);
	xDistGraph = new DistributionGraph(xDistCanvas, xDist, "X");
	xDistGraph.showDist(showCheck.checked);
	yDist = new NormalDistribution(nu, tau);
	yDistGraph = new DistributionGraph(yDistCanvas, yDist, "Y");
	yDistGraph.showDist(showCheck.checked);
	fDist = new FDistribution(m, n);
	fDistGraph = new DistributionGraph(fDistCanvas, fDist, "V");
	fDistGraph.showDist(showCheck.checked);
	fDistTable.value = fDistGraph.text;
}

function simulate(){
	var sX, sY, f;
	runCount++;
	stopCount++;
	xDist.data.reset();
	yDist.data.reset();
	var sum = 0, x, z;
	for (var i = 0; i < m; i++) xDist.simulate();
	for (var j = 0; j < n; j++) yDist.simulate();
	sX = xDist.data.stdDev();
	sY = yDist.data.stdDev();
	f = (Math.pow(sX, 2)/Math.pow(sigma, 2))/(Math.pow(sY, 2)/Math.pow(tau, 2));
	fDist.setValue(f);
	currentRecord = runCount + "\t" + sX.toFixed(3) + "\t" + sY.toFixed(3) + "\t" + f.toFixed(3);
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
	xDistGraph.draw();
	yDistGraph.draw();
	fDistGraph.draw();
	fDistTable.value = fDistGraph.text;
}

function showDist(b){
	xDistGraph.showDist(b);
	yDistGraph.showDist(b);
	fDistGraph.showDist(b);
	fDistTable.value = fDistGraph.text;
}

