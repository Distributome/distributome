//Beta-binomial distribution calculator
var dist, distGraph;
var xParam, pParam, graphSelect;
var a = 1, b = 1, n = 10;
var nParam, aParam, bParam;
var x, p = 0.5;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	nParam = new Parameter(document.getElementById("nInput"), document.getElementById("nLabel"));
	nParam.setProperties(1, 50, 1, n, "<var>n</var>");
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(0.5, 50, 0.1, a, "<var>a</var>");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(0.5, 50, 0.1, b, "<var>b</var>");
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>p</var>");
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	setDist();	
}

function setDist(){
	n = nParam.getValue();
	a = aParam.getValue();
	b = bParam.getValue()
	dist = new BetaBinomialDistribution(a, b, n);
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



