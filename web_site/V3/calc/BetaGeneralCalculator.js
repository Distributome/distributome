//Generalized Beta Calculator
var dist, distGraph, aParam, bParam, leftParam, rightParam;
var xParam, pParam, graphSelect;
var x, p;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	
	aParam = new Parameter(document.getElementById("aInput"), document.getElementById("aLabel"));
	aParam.setProperties(1, 50, 0.1, 1, "<var>a</var>");
	bParam = new Parameter(document.getElementById("bInput"), document.getElementById("bLabel"));
	bParam.setProperties(1, 50, 0.1, 1, "<var>b</var>");
	
	leftParam = new Parameter(document.getElementById("leftLimitInput"), 
			document.getElementById("leftLimitLabel"));
	leftParam.setProperties(-100, 100, 0.1, 0, "<var>L</var>");
	rightParam = new Parameter(document.getElementById("rightLimitInput"), 
			document.getElementById("rightLimitLabel"));
	rightParam.setProperties(leftParam.getValue()+1, 100+1, 0.1, 1, "<var>R</var>");
	
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>p</var>");
	setDist();
}

function setDist(){
	dist = new BetaGeneralDistribution(aParam.getValue(), bParam.getValue(), 
			leftParam.getValue(), rightParam.getValue());
	xParam.setProperties(dist.quantile(0.001), dist.quantile(0.999), 0.001, dist.quantile(0.5), 
			"<var>x</var>");
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



