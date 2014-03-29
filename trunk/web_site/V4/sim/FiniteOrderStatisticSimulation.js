//Finite order statistic distribution smulation
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var m = 10, n = 5, k = 1;
var currentRecord, completeRecord = "", header = "Run\tX";
var dist, distGraph, mParam, nParam, kParam;
var recordTable, distTable;
var runButton, stepButton, distCanvas, stopSelect, showSelect;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	distCanvas = document.getElementById("distCanvas");
	distTable = document.getElementById("distTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	mParam = new Parameter(document.getElementById("mInput"), document.getElementById("mLabel"));
	mParam.setProperties(1, 100, 1, m, "<var>m</var>");
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, m, 1, n, "<var>n</var>");	
	kParam = new Parameter(document.getElementById("kInput"), document.getElementById("kLabel"));
	kParam.setProperties(1, n, 1, k, "<var>k</var>");	
	resetExperiment();
}

function stepExperiment(){
	simulate();
	recordTable.value = header + completeRecord;
}

function runExperiment(){
	runID = setInterval(simulate, 20);
	stepButton.disabled = true;
	runButton.disabled = true;
	stopSelect.disabled = true;
}

function stopExperiment(){
	stopCount = 0;
	clearInterval(runID);
	stepButton.disabled = false;
	stopSelect.disabled = false;
	runButton.disabled = false;
	if (runCount > 0) recordTable.value = header + completeRecord;
}

function resetExperiment(){
	stopExperiment();
	runCount = 0; stopCount = 0;
	completeRecord = "";
	recordTable.value = header;
	m = mParam.getValue();
	if (nParam.getMax() != m) nParam.setProperties(1, m, 1, Math.min(n, m), "<var>n</var>");
	n = nParam.getValue();
	if (kParam.getMax() != n) kParam.setProperties(1, n, 1, Math.min(k, n), "<var>k</var>");
	k = kParam.getValue();
	dist = new FiniteOrderStatistic(m, n, k);
	distGraph = new DistributionGraph(distCanvas, dist, "X");
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text();
}

function simulate(){
	runCount++;
	stopCount++;
	currentRecord = runCount + "\t" + dist.simulate();
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
	distGraph.draw();
	distTable.value = distGraph.text();
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text();
}

