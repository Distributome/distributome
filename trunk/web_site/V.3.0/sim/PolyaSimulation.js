//Polya distribution smulation
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var a = 1, b = 1, c = 1, n = 10;
var currentRecord, completeRecord = "", header = "Run\tX";
var dist, distGraph, aParam, bParam, cParam, nParam;
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
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(1, 50, 1, a, "<var>a</var>");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(1, 50, 1, b, "<var>b</var>");	
	cParam = new Parameter(document.getElementById("cInput"), document.getElementById("cLabel"));
	cParam.setProperties(1, 50, 1, c, "<var>c</var>");	
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, 50, 1, n, "<var>n</var>");	
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
	a = aParam.getValue();
	b = bParam.getValue();
	c = cParam.getValue();
	n = nParam.getValue();
	dist = new PolyaDistribution(a, b, c, n);
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

function showDist(bool){
	distGraph.showDist(bool);
	distTable.value = distGraph.text();
}

