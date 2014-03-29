//Poisson Calculator
var dist, distGraph, lambdaParam;
var xParam, qParam, graphSelect;
var x, q;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	lambdaParam = new Parameter(document.getElementById("lambdaInput"), document.getElementById("lambdaLabel"));
	lambdaParam.setProperties(0.5, 100, 0.1, 5, "<var>\u03bb</var>");
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	qParam = new Parameter(document.getElementById("qInput"), document.getElementById("qLabel"));
	qParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>q</var>");
	setDist();
}

function setDist(){
	dist = new PoissonDistribution(lambdaParam.getValue());
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



