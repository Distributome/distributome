//Walk Max Experiment
var runCount = 0, stopCount = 0, stopFreq = 10,  runID, stepID;
var walkCanvas, walkGraph, dist, distCanvas, distGraph, distTable, showCheck;
var y, m, n = 10, yMax, time;
var recordTable, currentRecord, completeRecord = "", header = "Run\tM";
var runButton, stepButton, stopSelect, nParam;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	recordTable = document.getElementById("recordTable");
	walkCanvas = document.getElementById("walkCanvas");
	distCanvas = document.getElementById("distCanvas");
	distTable = document.getElementById("distTable");
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(10, 100, 2, n, "<var>n</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	initializeWalkGraph();
	time = 0; y = 0; m = 0; 
	stepID = setInterval(takeStep, 50);
}

function runExperiment(){
	stepButton.disabled = true; stopSelect.disabled = true;
	runID = setInterval(walk, 20);
}

function stopExperiment(){
	stopCount = 0;
	clearInterval(stepID)
	clearInterval(runID);
	stepButton.disabled = false; stopSelect.disabled = false; runButton.disabled = false;
	if (runCount > 0) recordTable.value = header + completeRecord;
}

function resetExperiment(){
	stopExperiment(); runCount = 0;
	n = nParam.getValue();
	dist = new WalkMaxDistribution(n);
	distGraph = new DistributionGraph(distCanvas, dist, "M");
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
	yMax = 3 * Math.sqrt(n);
	walkGraph = new Graph(walkCanvas, 0, n, - yMax, yMax);
	walkGraph.xFormat = 0;
	walkGraph.yFormat = 0;
	walkGraph.setMargins(20, 20, 10, 10);
	initializeWalkGraph();
	completeRecord = ""; recordTable.value = header;
}

function walk(){
	stopCount++;
	y = 0, m = 0;
	var step;
	initializeWalkGraph();
	for (var i = 1; i <= n; i++){
		if (Math.random() < 0.5) step = 1;
		else step = -1;
		y = y + step;
		walkGraph.lineTo(i, y);
		if (y > m) m = y;
	}
	walkGraph.stroke();
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function initializeWalkGraph(){
	walkGraph.clear();
	walkGraph.strokeStyle("gray"); walkGraph.fillStyle("gray");
	walkGraph.drawAxis(0, n, 0, 1, "hor");
	walkGraph.drawText("0", 0, 0, "left");
	walkGraph.drawText(n.toFixed(0), n, 0, "below");
	walkGraph.drawAxis(-yMax, yMax, 0, 1, "vert");
	walkGraph.drawText((-yMax).toFixed(0), 0, -yMax, "left");
	walkGraph.drawText(yMax.toFixed(0), 0, yMax, "left");
	walkGraph.strokeStyle("red");
	walkGraph.fillStyle("red");
	walkGraph.beginPath();
	walkGraph.moveTo(0, 0);
}

function takeStep(){
	if (time < n){
		time++;
		if (Math.random() < 0.5) step = 1;
		else step = -1;
		y = y + step;
		if (y > m) m = y;
		walkGraph.lineTo(time, y);
		walkGraph.stroke();	
	}
	else {
		update();
		stopExperiment();
	}		
}

function update(){
	runCount++;
	walkGraph.drawPoint(0, m, 3, "red");
	dist.setValue(m);	
	distGraph.draw();
	distTable.value = distGraph.text;
	currentRecord = runCount + "\t" + m;
	completeRecord = completeRecord + "\n" + currentRecord;
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text;
}

