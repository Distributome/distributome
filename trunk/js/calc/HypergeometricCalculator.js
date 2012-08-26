//Bernoulli Distribution Calculator
var dist, distGraph, bParam;
var xParam, pParam, graphSelect;
var x, p;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	
	popParam = new Parameter(document.getElementById("popInput"), document.getElementById("popLabel"));
	popParam.setProperties(1, 100, 1, 50, "<var>population</var>");
	redParam = new Parameter(document.getElementById("redInput"), document.getElementById("redLabel"));
	redParam.setProperties(1, popParam.getValue(), 1, 25, "<var>tagged(red)</var>");
	sampleParam = new Parameter(document.getElementById("sampleInput"), document.getElementById("sampleLabel"));
	sampleParam.setProperties(1, 100, 1, 40, "<var>sample</var>");
	
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	xParam.setProperties(1, 200, 1, 3, "<var>p</var>");
	
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>p</var>");
	setDist();
}

function setDist(){
	dist = new HypergeometricDistribution(popParam.getValue(), redParam.getValue(), sampleParam.getValue());
	xParam.setProperties(dist.quantile(0.001), dist.quantile(0.999), 0.001, dist.quantile(0.5), "<var>x</var>");
	distGraph = new QuantileGraph(distCanvas, dist, "X");
	distGraph.xFormat = 2;
	distGraph.setGraphType(graphSelect.value);
	setProb();	
}

function setValue(){
	x = xParam.getValue();
	p = dist.CDF(x);
	pParam.setValue(p);
	distGraph.setValue(x);
}

function setProb(){
	p = pParam.getValue();
	x = dist.quantile(p);
	xParam.setValue(x);
	distGraph.setProb(p);
}



