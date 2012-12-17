//Exponential-Logarithmic Distribution Calculator
var dist, distGraph, bParam, pParam;
var xParam, qParam, graphSelect;
var b = 1, p = 0.5;
var x, p;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(1, 10, 0.1, b, "<var>b</var>");
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0.1, 0.9, 0.01, p, "<var>p</var>");
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	qParam = new Parameter(document.getElementById("qInput"), document.getElementById("qLabel"));
	qParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>q</var>");
	setDist();
}

function setDist(){
	p = pParam.getValue();
	b = bParam.getValue();
	dist = new ExponentialLogarithmicDistribution(p, b);
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
