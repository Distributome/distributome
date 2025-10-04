//Maxwell-Boltzmann Distribution Experiment
var runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tX1\tX2\tX3\tZ";
var normalDist, maxwellBoltzmannDist, normalDistGraph, maxwellBoltzmannDistGraph;
var aParam, a = 1;
var recordTable, maxwellBoltzmannDistTable;
var runButton, stepButton, normalDistCanvas, maxwellBoltzmannDistCanvas, stopSelect, showSelect;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	recordTable = document.getElementById("recordTable");
	normalDistCanvas = document.getElementById("normalDistCanvas");
	maxwellBoltzmannDistCanvas = document.getElementById("maxwellBoltzmannDistCanvas");
	maxwellBoltzmannDistTable = document.getElementById("maxwellBoltzmannDistTable");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(0.5, 10, 0.1, a, "<var>a</var>");
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
	completeRecord = "";
	recordTable.value = header;
	normalDist = new NormalDistribution(0, a);
	normalDistGraph = new DistributionGraph(normalDistCanvas, normalDist, "X");
	normalDistGraph.showDist(showCheck.checked);
	maxwellBoltzmannDist = new MaxwellBoltzmannDistribution(a);
	maxwellBoltzmannDistGraph = new DistributionGraph(maxwellBoltzmannDistCanvas, maxwellBoltzmannDist, "Z");
	maxwellBoltzmannDistGraph.showDist(showCheck.checked);
	maxwellBoltzmannDistTable.value = maxwellBoltzmannDistGraph.text();
}

function simulate(){
	runCount++;
	stopCount++;
	normalDist.data().reset();
	var x1, x2, x3, z;
	x1 = normalDist.simulate();
	x2 = normalDist.simulate();
	x3 = normalDist.simulate();
	z = Math.sqrt(x1 * x1 + x2 * x2 + x3 * x3);
	maxwellBoltzmannDist.setValue(z);
	currentRecord = runCount + "\t" + x1.toFixed(3) + "\t" + x2.toFixed(3) + "\t" + x3.toFixed(3) + "\t" + z.toFixed(3);;
	recordTable.value = header + "\n" + currentRecord;
	completeRecord = completeRecord + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
	normalDistGraph.draw();
	maxwellBoltzmannDistGraph.draw();
	maxwellBoltzmannDistTable.value = maxwellBoltzmannDistGraph.text();
}

function showDist(b){
	normalDistGraph.showDist(b);
	maxwellBoltzmannDistGraph.showDist(b);
	maxwellBoltzmannDistTable.value = maxwellBoltzmannDistGraph.text();
}

