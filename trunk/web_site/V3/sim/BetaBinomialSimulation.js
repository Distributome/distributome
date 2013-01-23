//Beta-Binomial distribution smulation
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tX";
var dist, distGraph;
var recordTable, distTable;
var runButton, stepButton, distCanvas, stopSelect, showSelect;
var aParam, bParam, nParam;
var a = 1, b = 1, n = 10;

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
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, 50, 1, n, "<var>n</var>");
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(0.5, 50, 0.1, a, "<var>a</var>");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(0.5, 50, 0.1, b, "<var>b</var>");
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
	n = nParam.getValue()
	dist = new BetaBinomialDistribution(a, b, n);
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

