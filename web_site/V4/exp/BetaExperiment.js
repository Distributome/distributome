//Beta experiment
var runID, stepID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header;
var dist0, dist0Canvas, dist0Graph, dist, distCanvas, distGraph;
var nParam, kParam;
var recordTable, distTable;
var runButton, stepButton, distCanvas, stopSelect, distSelect, showCheck;
var n = 5, k = 1;
var x = new Array(n), s = new Array(n);

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	dist0Canvas = document.getElementById("dist0Canvas");
	distCanvas = document.getElementById("distCanvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, 50, 1, n, "<var>n</var>");
	kParam = new Parameter(document.getElementById("kInput"), document.getElementById("kLabel"));
	kParam.setProperties(1, n, 1, k, "<var>k</var>");
	setDist();
}

function stepExperiment(){
	experiment();
	stopExperiment();
}

function runExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	stopSelect.disabled = true;
	runID = setInterval(experiment, 20);
}

function stopExperiment(){
	stopCount = 0;
	clearInterval(runID);
	clearInterval(stepID);
	stepButton.disabled = false;
	runButton.disabled = false;
	stopSelect.disabled = false;
	if (runCount > 0) recordTable.value = header + completeRecord;
}

function resetExperiment(){
	stopExperiment();
	runCount = 0; stopCount = 0;
	completeRecord = "";
	header = "Run";
	for (var i = 1; i <= n; i++) header = header + "\tX(" + i + ")"; 
	recordTable.value = header;
	dist0.data().reset();
	dist.data().reset();
	dist0Graph.showDist(showCheck.checked);
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text();
}

function setSample(){
	n = nParam.getValue();
	x = new Array(n); s = new Array(n);
	kParam.setProperties(1, n, 1, Math.min(n, k), "<var>k</var>");
	setDist();
}

function setDist(){
	k = kParam.getValue();
	dist0 = new UniformDistribution(0, 1);
	dist = new BetaDistribution(k, n - k + 1);
	dist0Graph = new DistributionGraph(dist0Canvas, dist0, "X");
	distGraph = new DistributionGraph(distCanvas, dist, "X(" + k + ")");
	resetExperiment();
}

function experiment(){
	runCount++;
	stopCount++;
	currentRecord = "\n" + runCount;
	dist0.data().reset();
	for (var i = 0; i < n; i++) s[i] = dist0.simulate();
	dist0Graph.draw();
	x = s.sort(ascend);
	for (var i = 0; i < n; i++) currentRecord = currentRecord + "\t" + x[i].toFixed(2);
	completeRecord = completeRecord + currentRecord;
	dist.setValue(x[k - 1]);
	distGraph.draw();
	distTable.value = distGraph.text();
	recordTable.value = header + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text();
}

