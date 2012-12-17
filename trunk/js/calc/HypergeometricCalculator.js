//Hypergeometric Calculator
var dist, distGraph, mParam, kParam, nParem;
var xParam, qParam, graphSelect;
var m = 50, k = 25, n = 10;
var x, q;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	mParam = new Parameter(document.getElementById("mInput"), document.getElementById("mLabel"));
	mParam.setProperties(1, 200, 1, m, "<var>m</var>");
	kParam = new Parameter(document.getElementById("kInput"), document.getElementById("kLabel"));
	kParam.setProperties(1, m, 1, k, "<var>k</var>");
    nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, m, 1, n, "<var>n</var>");
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	qParam = new Parameter(document.getElementById("qInput"), document.getElementById("qLabel"));
	qParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>q</var>");
	setDist();
}

function setDist(){
	m = mParam.getValue();
	if (kParam.getMax() != m) kParam.setProperties(1, m, 1, Math.min(k, m), "<var>k</var>");
	if (nParam.getMax() != m) nParam.setProperties(1, m, 1, Math.min(n, m), "<var>n</var>");
	k = kParam.getValue();
    n = nParam.getValue();
	dist = new HypergeometricDistribution(m, k, n);
	xParam.setProperties(dist.quantile(0.001), dist.quantile(0.999), 0.001, dist.quantile(0.5), "<var>x</var>");
	distGraph = new QuantileGraph(distCanvas, dist, "X");
	distGraph.xFormat = 2;
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



