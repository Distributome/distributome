//Coupon collector distribution calculator
var dist, distGraph;
var xParam, pParam, graphSelect;
var m = 20, k = 10, mParam, kParam;
var x, p = 0.5;

function initialize(){
	distCanvas = document.getElementById("distCanvas");
	graphSelect = document.getElementById("graphSelect");
	distSelect = document.getElementById("distSelect");
	mParam = new Parameter(document.getElementById("mInput"), document.getElementById("mLabel"));
	mParam.setProperties(1, 25, 1, m, "<var>m</var>");
	kParam = new Parameter(document.getElementById("kInput"), document.getElementById("kLabel"));
	kParam.setProperties(1, m, 1, k, "<var>k</var>");	
	pParam = new Parameter(document.getElementById("pInput"), document.getElementById("pLabel"));
	pParam.setProperties(0.001, 0.999, 0.001, 0.5, "<var>p</var>");
	xParam = new Parameter(document.getElementById("xInput"), document.getElementById("xLabel"));
	setDist();	
}

function setDist(){
	m = mParam.getValue();
	if (kParam.getMax() != m) kParam.setProperties(1, m, 1, Math.min(k, m), "<var>k</var>");
	k = kParam.getValue();
	dist = new CouponDistribution(m, k);
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



