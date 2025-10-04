//Exponential Calculator
var dist, distGraph, bParam;
var xParam, qParam, graphSelect;
var x, q;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(1, 50, 0.1, 1, "<var>b</var>");
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	qParam = new Parameter(document.getElementById("qInput"), document.getElementById("qLabel"));
	qParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>q</var>");
	setDist();
}

function setDist(){
	dist = new ExponentialDistribution(bParam.getValue());
	xParam.setProperties(dist.quantile(0.001), dist.quantile(0.999), 0.001, dist.quantile(0.5), "<var>x</var>");
	distGraph = new QuantileGraph(distCanvas, dist, "X");
	distGraph.setGraphType(graphSelect.value);
	setProb();	
}

function setValue(){
	x = xParam.getValue();
	q = dist.CDF(x);
	qParam.setValue(q);
	distGraph.setValue(x);
}

function setProb(){
	q = qParam.getValue();
	x = dist.quantile(q);
	xParam.setValue(x);
	distGraph.setProb(q);
}



