//Arcsine Experiment
var runCount = 0, stopCount = 0, stopFreq = 10,  runID, stepID;
var pathCanvas, pathGraph, distCanvas, distGraph, distTable, showCheck;
var dxDist, zDist;
var x, z, s, ds, n = 200, xMax, t = 1, step;
var recordTable, currentRecord, completeRecord = "", header = "Run\tZ";
var runButton, stepButton, stopSelect, tParam;


function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	recordTable = document.getElementById("recordTable");
	pathCanvas = document.getElementById("pathCanvas");
	distCanvas = document.getElementById("distCanvas");
	distTable = document.getElementById("distTable");
	tParam = new Parameter(document.getElementById("tInput"), document.getElementById("tLabel"));
	tParam.setProperties(1, 5, 0.1, t, "<var>t</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	initializeGraph();
	step = 0;
	x = 0, s = 0, z = 0; 
	stepID = setInterval(takeStep, 50);
}

function runExperiment(){
	stepButton.disabled = true; 
	runButton.disabled = true;
	stopSelect.disabled = true;
	runID = setInterval(walk, 20);
}

function stopExperiment(){
	stopCount = 0;
	clearInterval(stepID)
	clearInterval(runID);
	stepButton.disabled = false;
	stopSelect.disabled = false; 
	runButton.disabled = false;
	if (runCount > 0) recordTable.value = header + completeRecord;
}

function resetExperiment(){
	stopExperiment(); 
	runCount = 0;
	t = tParam.getValue();
	ds = t / n;
	dx = Math.sqrt(ds);
	dxDist = new NormalDistribution(0, Math.sqrt(ds));
	zDist = new ArcsineDistribution(0, t);
	xMax = 3 * Math.sqrt(t);
	pathGraph = new Graph(pathCanvas, 0, t, -xMax, xMax);
	pathGraph.setMargins(20, 20, 10, 10);
	initializeGraph();
	distGraph = new DistributionGraph(distCanvas, zDist, "Z");
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text();
	completeRecord = ""; recordTable.value = header;
}

function walk(){
	var x0, dx;
	stopCount++;
	x = 0;
	z = 0;
	initializeGraph();
	for (var i = 1; i <= n; i++){
		x0 = x;
		s = s + ds;
		dx = dxDist.simulate();
		x = x + dx;
		if (x == 0) z = s;
		else if ((x0 <= 0 && x > 0) || (x0 >= 0 && x < 0)) z = s - ds - x0 * ds / dx;
		pathGraph.lineTo(s, x);
	}
	pathGraph.stroke();
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function initializeGraph(){
	s = 0; x = 0;
	pathGraph.clear();
	pathGraph.strokeStyle("gray"); 
	pathGraph.fillStyle("gray");
	pathGraph.drawAxis(0, t, 0, 0.1, HOR);
	pathGraph.drawText("0", 0, 0, LEFT);
	pathGraph.drawText(t.toFixed(1), t, 0, BELOW);
	pathGraph.drawAxis(-xMax, xMax, 0, 1, VERT);
	pathGraph.drawText((-xMax).toFixed(1), 0, -xMax, LEFT);
	pathGraph.drawText(xMax.toFixed(1), 0, xMax, LEFT);
	pathGraph.strokeStyle("red");
	pathGraph.fillStyle("red");
	pathGraph.beginPath();
	pathGraph.moveTo(0, 0);
}

function takeStep(){
	var x0, dx;
	if (step < n){
		step++;
		x0 = x;
		s = s + ds;
		dx = dxDist.simulate();
		x = x + dx;
		if (x == 0) z = s;
		else if ((x0 <= 0 && x > 0) || (x0 >= 0 && x < 0)) z = s - ds - x0 * ds / dx;
		pathGraph.lineTo(s, x);
		pathGraph.stroke();	
	}
	else {
		update();
		stopExperiment();
	}		
}

function update(){
	runCount++;
	pathGraph.drawPoint(z, 0, 3, "red");
	zDist.setValue(z);
	distGraph.draw();
	distTable.value = distGraph.text();
	currentRecord = runCount + "\t" + z.toFixed(2);
	completeRecord = completeRecord + "\n" + currentRecord;
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text();
}

