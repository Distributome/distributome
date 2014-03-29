//Card Experiment
var stepID, runID;
var runCount = 0, stopCount = 0, stopFreq = 10;
var recordTable, currentRecord, header = "Run\t", completeRecord = "";
var nParam, n = 14, deck, hand, suit, value;
var d, count;
var stepButton, runButton, stopSelect;

function initializeExperiment(){
	runButton = document.getElementById("runButton");
	stepButton = document.getElementById("stepButton");
	stopSelect = document.getElementById("stopSelect");
	recordTable = document.getElementById("recordTable");
	stopSelect.value = "10";
	hand = new Array(14);
	for (var i = 0; i < 14; i++) hand[i] = new Card(document.getElementById("card" + i));
	deck = new Array(52);
	for (var i = 0; i < 52; i++) deck[i] = i + 1;
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, 14, 1, n, "<var>n</var>");
	resetExperiment();
}

function stepExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	count = 0;
	for (var i = 0; i < n; i++) hand[i].setValue(0);
	d = sample(deck, n, 0);
	stepID = setInterval(dealCard, 100);
}

function runExperiment(){
	stepButton.disabled = true;
	runButton.disabled = true;
	stopSelect.disabled = true;
	runID = setInterval(dealHand, 20);
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

function resetExperiment(){
	stopExperiment();
	runCount = 0; stopCount = 0;
	n = nParam.getValue();
	header = "Run";
	for (var i = 0; i < n; i++) header = header + "\tX" + (i + 1);
	completeRecord = header;
	recordTable.value = completeRecord;
	for (var i = 0; i < 14; i++){
		if (i < n) hand[i].setValue(0);
		else hand[i].setValue(-1);
	}
}

function dealHand(){
	stopCount++;
	d = sample(deck, n, 0);
	for (var i = 0; i < n; i++)	hand[i].setValue(d[i]);	
	update();
	recordTable.value = header + "\n" + currentRecord;
	if (stopCount == stopFreq) stopExperiment();
}

function dealCard(){
	if (count < n){
		hand[count].setValue(d[count]);
		count++;
	}
	else{
		update();
		stopExperiment();
	}
}

function update(){
	runCount++;
	currentRecord = runCount;
	for (var i = 0; i < n; i++) currentRecord = currentRecord + "\t" + hand[i].denomination + hand[i].suitSymbol;
	completeRecord = completeRecord + "\n" + currentRecord;
}		
