//Triangle distribution calculator
var dist, distGraph, aParam, wParam, pParam;
var xParam, qParam, graphSelect;
var x, q, a = 0, w = 1, p = 0.5;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(-10, 10, 0.1, a, "<var>a</var>");
	wParam = new Parameter(document.getElementById("wInput"), document.getElementById("wLabel"));
	wParam.setProperties(0.5, 10, 0.1, w, "<var>w</var>");
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0, 1, 0.01, p, "<var>p</var>");
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	qParam = new Parameter(document.getElementById("qInput"), document.getElementById("qLabel"));
	qParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>q</var>");
	setDist();
}

function setDist(){
	a = aParam.getValue();
	w = wParam.getValue();
	p = pParam.getValue();
	dist = new TriangleDistribution(a, w, p);
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



