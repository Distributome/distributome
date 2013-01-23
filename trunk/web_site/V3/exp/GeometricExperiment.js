//Geometric Experiment
var stepID, runID, time, sum;
var runCount = 0, stopCount = 0, stopFreq = 10;
var currentRecord, completeRecord = "", header = "Run\tV";
var dist, distGraph, pParam;
var recordTable, distTable, timeline;
var runButton, stepButton, distCanvas, stopSelect, rvSelect, showCheck;
var p = 0.5;

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
	distCanvas = document.getElementById("distCanvas");
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0.05, 1, 0.01, p, "<var>p</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	time = 0; sum = 0;
	timeline.reset();
	stepID = setInterval(doTrial, 50);
}

function runExperiment(){
	runID = setInterval(doTrials, 20);
	stepButton.disabled = true;
	runButton.disabled = true;
	stopSelect.disabled = true;
}

function stopExperiment(){
	stopCount = 0;
	clearInterval(stepID);
	clearInterval(runID);
	stepButton.disabled = false;
	runButton.disabled = false;
	stopSelect.disabled = false;
	if (runCount > 0) recordTable.value = completeRecord;
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text();
}

function resetExperiment(){
	stopExperiment();
	runCount = 0; stopCount = 0;
	completeRecord = header;
	recordTable.value = completeRecord;
	p = pParam.getValue();
	dist = new NegativeBinomialDistribution(1, p);
	distGraph = new DistributionGraph(distCanvas, dist, "V");
	timeline = new Timeline(document.getElementById("timeline"), 1, dist.maxValue(), 1);
	timeline.setFormat(0);
	timeline.setPointSize(3);
	timeline.setMargins(30, 10, 10, 10);
	timeline.draw(1);
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text();
}

function doTrial(){
	if (sum < 1) {
		time++;
		if (Math.random() < p){
			sum++;
			timeline.addArrival(time, "red");
		}
		else timeline.addArrival(time, "green");
		timeline.draw(time);
	}
	else {
		update();
		stopExperiment();
	}
}
	

function doTrials(){
	stopCount++; sum = 0; time = 0;
	timeline.reset();
	while (sum < 1) {
		time++;
		if (Math.random() < p) {
			sum++;
			timeline.addArrival(time, "red");
		}
		else timeline.addArrival(time, "green");
	}
	timeline.draw(time);
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function update(){
	runCount++;
	dist.setValue(time);
	currentRecord = runCount + "\t" + time;
	completeRecord = completeRecord + "\n" + currentRecord;
	distGraph.draw();
	distTable.value = distGraph.text();
}	
