//Student Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10, coinCount = 10;
var currentRecord, completeRecord = "", header = "Run\tM\tS\tT";
var normalDist, studentDist, normalDistGraph, studentDistGraph, nParam;
var recordTable, studentDistTable;
var runButton, stepButton, normalDistCanvas, studentDistCanvas, stopSelect, showSelect;
var mu = 0, sigma = 1, n = 10;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	normalDistCanvas = document.getElementById("normalDistCanvas");
	studentDistCanvas = document.getElementById("studentDistCanvas");
	studentDistTable = document.getElementById("studentDistTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(5, 50, 1, n, "<var>n</var>");
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
	studentDist = new StudentDistribution(n);
	studentDistGraph = new DistributionGraph(studentDistCanvas, studentDist, "T");
	studentDistGraph.showDist(showCheck.checked);
	studentDistTable.value = studentDistGraph.text;
}

function simulate(){
	var t, m, s;
	runCount++;
	stopCount++;
	normalDist.data.reset();
	var sum = 0, z;
	for (var i = 0; i < n; i++) normalDist.simulate();
	m = normalDist.data.mean();
	s = normalDist.data.stdDev();
	t = (m - mu)/(s / Math.sqrt(n));
	studentDist.setValue(t);
	currentRecord = runCount + "\t" + m.toFixed(3) + "\t" + s.toFixed(3) + "\t" + t.toFixed(3);
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
	normalDistGraph.draw();
	studentDistGraph.draw();
	studentDistTable.value = studentDistGraph.text;
}

function showDist(b){
	normalDistGraph.showDist(b);
	studentDistGraph.showDist(b);
	studentDistTable.value = studentDistGraph.text;
}

