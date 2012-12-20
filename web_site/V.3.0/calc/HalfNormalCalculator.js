//Half-Normal distribution calculator
var dist, distGraph;
var xParam, pParam, graphSelect;
var sigma = 1, sigmaParam;
var x, p = 0.5;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	sigmaParam = new Parameter(document.getElementById("sigmaInput"), document.getElementById("sigmaLabel"));
	sigmaParam.setProperties(0.1, 10, 0.1, sigma, "<var>\u03C3</var>");
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>p</var>");
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	setDist();	
}

function setDist(){
	sigma = sigmaParam.getValue();
	dist = new FoldedNormalDistribution(0, sigma);
	xParam.setProperties(dist.quantile(0.001), dist.quantile(0.999), 0.001, dist.quantile(0.5), "<var>x</var>");
	distGraph = new QuantileGraph(distCanvas, dist, "X");
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



