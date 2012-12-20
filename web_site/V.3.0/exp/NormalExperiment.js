//Normal Experiment
var runCount = 0, stopCount = 0, stopFreq = 10,  runID, stepID;
var pathCanvas, pathGraph, distCanvas, distGraph, distTable, rvSelect, showCheck;
var dxDist, yDist;
var x, y, s, ds, n = 200, xMin, xMax, t = 1, mu = 0, sigma = 1, step;
var recordTable, currentRecord, completeRecord = "", header = "Run\tX";
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
	muParam = new Parameter(document.getElementById("muInput"), document.getElementById("muLabel"));
	muParam.setProperties(-5, 5, 0.1, mu, "<var>\u03BC</var>");
	sigmaParam = new Parameter(document.getElementById("sigmaInput"), document.getElementById("sigmaLabel"));
	sigmaParam.setProperties(0.5, 5, 0.1, sigma, "<var>\u03C3</var>");
	
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	initializeGraph();
	step = 0;
	x = 0, s = 0, v = 1; 
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
	mu = muParam.getValue();
	sigma = sigmaParam.getValue();
	ds = 1 / n;
	dxDist = new NormalDistribution(0, sigma * Math.sqrt(ds));
	yDist = new NormalDistribution(mu, sigma);
	xMin = Math.min(0, yDist.mean() - 3 * yDist.stdDev());
	xMax = Math.max(yDist.mean() + 3 * yDist.stdDev(), 0);
	pathGraph = new Graph(pathCanvas, 0, t, xMin, xMax);
	pathGraph.setMargins(30, 20, 20, 10);
	initializeGraph();
	distGraph = new DistributionGraph(distCanvas, yDist, "X");
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text();
	completeRecord = ""; recordTable.value = header;
}

function walk(){
	var x0, dx;
	stopCount++;
	initializeGraph();
	for (var i = 1; i <= n; i++){
		x0 = x;
		s = s + ds;
		dx = dxDist.simulate();
		x = x + dx;
		y = mu * s + x;
		pathGraph.lineTo(s, y);
	}
	pathGraph.stroke();
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function initializeGraph(){
	s = 0; x = 0; y = 0;
	pathGraph.clear();
	pathGraph.strokeStyle("gray"); 
	pathGraph.fillStyle("gray");
	pathGraph.drawAxis(0, t, 0, 0.1, HOR);
	pathGraph.drawText("0", 0, 0, LEFT);
	pathGraph.drawText(t.toFixed(1), t, 0, BELOW);
	pathGraph.drawAxis(xMin, xMax, 0, 1, VERT);
	pathGraph.drawText(xMin.toFixed(1), 0, xMin, LEFT);
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
		y = mu * s + x;
		pathGraph.lineTo(s, y);
		pathGraph.stroke();	
	}
	else {
		update();
		stopExperiment();
	}		
}

function update(){
	runCount++;
	pathGraph.drawPoint(1, y, 3);
	yDist.setValue(y);
	distGraph.draw();
	distTable.value = distGraph.text();
	currentRecord = runCount + "\t" + y.toFixed(2);
	completeRecord = completeRecord + "\n" + currentRecord;
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text();
}

