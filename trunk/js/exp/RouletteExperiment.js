//Roulette Experiment
var runCount = 0, stopCount = 0, stopFreq = 10, runID, stepID;
var wheel, wheelImage, dist, distCanvas, distGraph, distTable, betSelect, showCheck;
var x, bet, win, index;
var recordTable, currentRecord, completeRecord = "", header = "Run\tX\tW";
var runButton, stepButton, stopSelect;
var scoreX, scoreY, score;
var width = 210, height = 210;
var	ctx;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	stopSelect = document.getElementById("stopSelect");
	stopSelect.value = "10";
	betSelect = document.getElementById("betSelect");
	betSelect.value = "1";
	recordTable = document.getElementById("recordTable");
	scoreX = [94, 119, 84, 156, 47, 170, 32, 157, 46, 120, 84, 149,	55, 130, 73, 162, 41, 172, 32, 41, 163, 33, 170, 56, 150, 74, 129, 95, 106, 63, 140, 36, 167, 37, 168, 65, 141, 106];
	scoreY = [31, 168, 33, 142, 57, 100, 99, 56, 142, 32, 167, 47, 151, 163, 36, 132, 65, 87, 111, 132, 65, 88, 110, 46, 149, 162, 34, 168, 30, 157, 40, 122, 76, 76, 122, 40, 157, 169];
	score = [0, 2, 14, 35, 23, 4, 16, 33, 21, 6, 18, 31, 19, 8, 12, 29, 25, 10, 27, 37, 1, 13, 36, 24, 3, 15, 34, 22, 5, 17, 32, 20, 7, 11, 30, 26, 9, 28];
	wheel = document.getElementById("wheel");
	ctx = wheel.getContext("2d");
	distCanvas = document.getElementById("distGraph");
	distTable = document.getElementById("distTable");
	showCheck = document.getElementById("showCheck");
	showCheck.checked = true;
	wheelImage =  new Image(width, height);
	wheelImage.src = "../images/RouletteWheel.png";
	wheelImage.onload = function(){
		ctx.drawImage(wheelImage, 0, 0, width, height, 0, 0, width, height);
	}
	setBet();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	x = Math.floor(38 * Math.random());
	index = 0;
	stepID = setInterval(spinWheel, 20);
}

function runExperiment(){
	stepButton.disabled = true; 
	runButton.disabled = true;
	stopSelect.disabled = true;
	runID = setInterval(getOutcome, 20);
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
	stopExperiment(); runCount = 0;
	completeRecord = ""; recordTable.value = header;
	dist.data.reset();
	drawWheel(-1);
	distGraph.showDist(showCheck.checked);
	distTable.value = distGraph.text;
}

function getOutcome(){
	stopCount++;
	x = Math.floor(38 * Math.random());
	drawWheel(x);
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function spinWheel(){
	var i = index % 38;
	if (index < 118){
		drawWheel(score[i]);
		index++;
	}
	else if (i < score.indexOf(x)){
		drawWheel(score[i]);
		index++;
	}
	else {
		drawWheel(x);
		update();
		stopExperiment();
	}
}

function drawWheel(t){
	ctx.clearRect(0, 0, width, height);
	ctx.drawImage(wheelImage, 0, 0, width, height, 0, 0, width, height);
	ctx.fillStyle = "blue";
	if (0 <= t && t <= 37){
		ctx.beginPath();
		ctx.arc(scoreX[t] + 3, scoreY[t] + 3, 5, 0, 2 * Math.PI, true);
		ctx.fill();
	}
}	

function update(){
	runCount++;
	if (bet.indexOf(x) == -1) win = -1;
	else win = winMax;
	dist.setValue(win);
	distGraph.draw();
	distTable.value = distGraph.text;
	if (x == 37) x = "00";
	currentRecord = runCount + "\t" + x + "\t" + win;
	completeRecord = completeRecord + "\n" + currentRecord;
}

function setBet(){
	switch(betSelect.value){
	case "1":
		prob = new Array(37);
		prob[0] = 37/38;
		for (var i = 1; i < 36; i++) prob[i] = 0;
		prob[36] = 1/38;
		winMax = 35;
		bet = [1];
		break;
	case "2":
		prob = new Array(19);
		prob[0] = 36/38;
		for (var i = 1; i < 18; i++) prob[i] = 0;
		prob[18] = 2/38;
		winMax = 17;
		bet = [1, 2];
		break;
	case "3":
		prob = new Array(13);
		prob[0] = 35/38;
		for (var i = 1; i < 12; i++) prob[i] = 0;
		prob[12] = 3/38;
		winMax = 11;
		bet = [1, 2, 3];
		break;
	case "4":
		prob = new Array(10);
		prob[0] = 34/38;
		for (var i = 1; i < 9; i++) prob[i] = 0;
		prob[9] = 4/38;
		winMax = 8;
		bet = [1, 2, 4, 5];
		break;
	case "6":
		prob = new Array(7);
		prob[0] = 32/38;
		for (var i = 1; i < 6; i++) prob[i] = 0;
		prob[6] = 6/36;
		winMax = 5;
		bet = [1, 2, 3, 4, 5, 6];
		break;
	case "12":
		prob = new Array(4);
		prob[0] = 26/38;
		prob[1] = 0; prob[2] = 0; 
		prob[3] = 12/38;
		winMax = 2;
		bet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		break;
	case "18":
		prob = new Array(3);
		prob[0] = 20/38;
		prob[1] = 0;
		prob[2] = 18/38;
		winMax = 1;
		bet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
		break;
	}
	dist = new Distribution(-1, winMax, 1, 0, prob);
	distGraph = new DistributionGraph(distCanvas, dist, "W");
	resetExperiment();
}

function showDist(b){
	distGraph.showDist(b);
	distTable.value = distGraph.text;
}