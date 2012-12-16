/*
JavaScript file for Distributome project
See http://www.distributome.org
*/

//Constants
const HOR = 0, VERT = 1, LEFT = 0, RIGHT = 1, ABOVE = 2, BELOW = 3, AT = 4;
const PDF = 0, CDF = 1;

//A six-sided die
function Die(canvas){
    //Properties
	this.value = 1;
	this.backColor = "red";
	this.spotColor = "white";
	this.prob = [1/6, 1/6, 1/6, 1/6, 1/6, 1/6];
	//Local variables
	var ctx = canvas.getContext("2d");
	var size = canvas.width;
	var r = Math.round(size / 9);
	var s = Math.round(size / 12);
	var d1 = s + r;
	var d2 = 2 * s + 3 * r;
	var d3 = 3 * s + 5 * r;
	
	//Methods
	this.setValue = function(v) {
		this.value = v;
		if (v === 0) ctx.fillStyle = "rgb(100,100,100)";
		else if (v > 0) ctx.fillStyle = this.backColor;
		else ctx.fillStyle = "rgba(200, 200, 200, 1)";
		ctx.fillRect(0, 0, size, size);
		ctx.fillStyle = this.spotColor;
		switch(v){
		case 1:
			ctx.beginPath(); ctx.arc(d2, d2, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		case 2:
			ctx.beginPath(); ctx.arc(d1, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		case 3:
			ctx.beginPath(); ctx.arc(d1, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d2, d2, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		case 4:
			ctx.beginPath(); ctx.arc(d1, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d1, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		case 5:
			ctx.beginPath(); ctx.arc(d1, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d1, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d2, d2, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		case 6:
			ctx.beginPath(); ctx.arc(d1, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d1, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d1, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d3, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d1, d2, r, 0, 2 * Math.PI, true); ctx.fill();
			ctx.beginPath(); ctx.arc(d3, d2, r, 0, 2 * Math.PI, true); ctx.fill();
			break;
		}
	};
	
	this.roll = function(){
		var p = Math.random(), sum = 0, x;
		for (var i = 0; i < 6; i++){
			if ((sum < p) && (p <= sum + this.prob[i])) x = i + 1;
			sum = sum + this.prob[i];
		}
		this.setValue(x);
	};
}

//A coin
function Coin(canvas){
	//Properties
	this.backColor = "red";
	this.labelColor = "white";
	this.label = "";
	this.value = -1; //1 heads, 0 tails, otherwise not tossed
	this.prob = 0.5;
	//Local variables
	var ctx = canvas.getContext("2d");
	var size = canvas.width, r = size / 2;
	
	//Methods
	this.setValue = function(v) {
		ctx.clearRect(0, 0, size, size);
		this.value = v;
		if (this.value == 1){
			this.backColor = "red";
			this.label = "H";
		}
		else if (this.value === 0){
			this.backColor = "green";
			this.label = "T";
		}
		else if (this.value == -1){
			this.backColor = "rgb(100,100,100)";
			this.label = "";
		}
		else{
			this.backColor = "rgba(200, 200, 200, 1)";
			this.label = "";
		}
		ctx.fillStyle = this.backColor;
		ctx.beginPath();
		ctx.arc(r, r, r, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.fillStyle = this.labelColor;
		ctx.fillText(this.label, r - 5, r + 5);
	};
	
	this.toss = function(){
		var p = Math.random(), v;
		if (p <= this.prob) v = 1; else v = 0;
		this.setValue(v);
	};
}

//Ball
function Ball(canvas){
	//Properties
	this.ballColor = "red";
	this.labelColor = "white";
	this.value = -1;
	//Local variables
	var ctx = canvas.getContext("2d");
	var size = canvas.width, r = size / 2;
	var label;
	//Methods
	this.setValue = function(v) {
		ctx.clearRect(0, 0, size, size);
		this.value = v;
		if (v >= 0){
			ctx.fillStyle = this.ballColor;
			label = v;
		}
		else if (v == -1){
			ctx.fillStyle = "rgb(100, 100, 100)";
			label = "";
		}
		else{
			ctx.fillStyle = "rgba(200, 200, 200, 1)";
			label = "";
		}
		ctx.beginPath();
		ctx.arc(r, r, r, 0, 2 * Math.PI, true);
		ctx.fill();
		ctx.fillStyle = this.labelColor;
		ctx.fillText(label, r - 5, r + 5);
	};
}
	
//A playing card
function Card(canvas){
	//Properties
	this.value = 1;
	this.suit = 1;
	this.suitSymbol = "\u2663";
	this.denomination = 1;	
	var ctx = canvas.getContext("2d");
	var cardImages =  new Image(1027, 615);
	var width = 79, height = 123;
	var symbol = ["\u2663", "\u2666", "\u2665", "\u2660"];
	cardImages.src = "cards.png";
	ctx.fillStyle = "gray";

	cardImages.onload = function(){
		ctx.drawImage(cardImages, 2 * width, 4 * height, width, height, 0, 0, width, height);
	};
	
	this.setValue = function(x){
		this.value = Math.round(x);
		if (this.value > 0 && this.value < 53){
			this.suit = Math.ceil(this.value / 13);
			this.suitSymbol = symbol[this.suit - 1];
			this.denomination = this.value - 13 * (this.suit - 1);
			ctx.drawImage(cardImages, (this.denomination - 1) * width, (this.suit - 1) * height, width, height, 0, 0, width, height);
		}
		else if (this.value === 0) ctx.drawImage(cardImages, 2 * width, 4 * height, width, height, 0, 0, width, height);
		else ctx.clearRect(0, 0, width, height);
	};
}

//A basic graph
function Graph(cvs, a0, a1, b0, b1){
	var ctx, x0, x1, y0, y1, w, h;
	//Initialize
	if (-Infinity < a0 && a0 < Infinity) x0 = a0; else x0 = 0;
	if (x0 < a1 && a1 < Infinity) x1 = a1; else x1 = x0 + 1;
	if (-Infinity < b0 && b0 < Infinity) y0 = b0; else y0 = 0;
	if (y0 < b1 && b1 < Infinity) y1 = b1; else y1 = y0 + 1;

	if (cvs !== undefined){
		ctx = cvs.getContext("2d");
		w = cvs.width;
		h = cvs.height;
	}
	
	this.context = function(){
		return ctx;
	};
	
	this.setBounds = function(a0, a1, b0, b1){
		if (-Infinity < a0 && a0 < Infinity) x0 = a0; else x0 = 0;
		if (x0 < a1 && a1 < Infinity) x1 = a1; else x1 = x0 + 1;
		if (-Infinity < b0 && b0 < Infinity) y0 = b0; else y0 = 0;
		if (y0 < b1 && b1 < Infinity) y1 = b1; else y1 = y0 + 1;
	};	

	this.clear = function(){
		ctx.clearRect(0, 0, w, h);
	};
	
	//Margins and size
	var lm = 30, rm = 20, bm = 20, tm = 20;

	this.setMargins = function(lm0, rm0, bm0, tm0){
		lm = lm0; rm = rm0; bm = bm0; tm = tm0;
	};
	
	this.leftMargin = function(){
		return lm;
	};
	
	this.rightMargin = function(){
		return rm;
	};
	
	this.bottomMargin = function(){
		return bm;
	};
	
	this.topMargin = function(){
		return tm;
	};
	
	this.height = function(){
		return h;
	};
	
	this.width = function(){
		return w;
	};
	
	//Coordinates
	this.xMin = function(){
		return x0;
	};
	
	this.xMax = function(){
		return x1;
	};
	
	this.yMin = function(){
		return y0;
	};
	
	this.yMax = function(){
		return y1;
	};
	
	//This function returns the horizontal coordinate in cavnas units for a given x in scaled units
	this.xCanvas = function(x){
		return lm + Math.round(((x - x0)/(x1 - x0)) * (w - lm - rm));
	};
	
	//This function returns the vertical coordinate in canvas units for a given y in scaled units
	this.yCanvas = function(y){
		return h - bm - Math.round(((y - y0)/(y1 - y0)) * (h - bm - tm));
	};
	
	//This function returns the horizontal coordinate in scaled units for a given x in canvas units.
	this.xScale = function(x){
		return x0 + ((x - lm)/(w - lm - rm)) * (x1 - x0);
	};
	
	//This funciton returns the vertical coordinate in scaled units for a given y in canvas units.
	this.yScale = function(y){
		return y0 + ((h - y - bm)/(h  - bm - tm)) * (y1 - y0);
	};
	
	this.beginPath = function(){
		ctx.beginPath();
	};
	
	this.strokeStyle = function(c){
		ctx.strokeStyle = c;
	};
	
	this.fillStyle = function(c){
		ctx.fillStyle = c;
	};
	
	this.stroke = function(){
		ctx.stroke();
	};
	
	this.fill = function(){
		ctx.fill();
	}

	this.moveTo = function(x, y){
		ctx.moveTo(this.xCanvas(x), this.yCanvas(y));
	};

	this.lineTo = function(x, y){
		ctx.lineTo(this.xCanvas(x), this.yCanvas(y));
	};
	
	this.lineWidth = function(i){
		ctx.lineWidth = i;
	}

	this.drawLine = function(a0, b0, a1, b1){
		ctx.beginPath();
		ctx.moveTo(this.xCanvas(a0), this.yCanvas(b0));
		ctx.lineTo(this.xCanvas(a1), this.yCanvas(b1));
		ctx.stroke();
	};
	
	this.drawAxis = function(a0, a1, b, s, type){
		//lower bound, upper bound, position, step size, type (HOR horizontal or VERT vertical)
		var x, y, tick = 3;
		ctx.beginPath();
		ctx.lineWidth = 1;
		switch(type){
		case HOR:
			y = this.yCanvas(b);
			ctx.moveTo(this.xCanvas(a0), y);
			ctx.lineTo(this.xCanvas(a1), y);
			for (var t = a0; t <= a1; t = t + s){
				x = this.xCanvas(t);
				ctx.moveTo(x, y - tick);
				ctx.lineTo(x, y + tick);
			}
			break;
		case VERT:
			x = this.xCanvas(b);
			ctx.moveTo(x, this.yCanvas(a0));
			ctx.lineTo(x, this.yCanvas(a1));
			for (var t = a0; t <= a1; t = t + s){
				y = this.yCanvas(t);
				ctx.moveTo(x - tick, y);
				ctx.lineTo(x + tick, y);
			}
			break;
		}
		ctx.stroke();
	};
	
	this.drawText = function(text, x, y, pos){
		switch(pos){
		case LEFT: 
			ctx.fillText(text, this.xCanvas(x) - 5 * text.length - 5, this.yCanvas(y) + 5);
			break;
		case BELOW:
			ctx.fillText(text, this.xCanvas(x)  -  2  *  text.length, this.yCanvas(y) + 15);
			break;
		case RIGHT:
			ctx.fillText(text, this.xCanvas(x) + 5 * text.length - 5, this.yCanvas(y) - 5);
			break;
		case ABOVE:
			ctx.fillText(text, this.xCanvas(x)  -  2  *  text.length, this.yCanvas(y));
			break;
		case AT:
			ctx.fillText(text, this.xCanvas(x) - text.length, this.yCanvas(y));
			break;
		}
	}
	
	this.drawPoint = function(x, y, r){
		//(x, y): position in scale units, r: radius in pixels
		ctx.beginPath();
		ctx.arc(this.xCanvas(x), this.yCanvas(y), r, 0, 2 * Math.PI, true);
		ctx.fill();
	};
	
	this.fillCircle = function(x, y, r){
		ctx.beginPath();
		var xc = this.xCanvas(x), yc = this.yCanvas(y), rc = this.xCanvas(x + r) - xc;
		ctx.arc(xc, yc, rc, 0, 2 * Math.PI, true);
		ctx.fill();
	};
		
	this.strokeCircle = function(x, y, r){
		ctx.beginPath();
		var xc = this.xCanvas(x), yc = this.yCanvas(y), rc = this.xCanvas(x + r) - xc;
		ctx.arc(xc, yc, rc, 0, 2 * Math.PI, true);
		ctx.stroke();
	};
	
	this.strokeRect = function(a0, b0, a1, b1){
		ctx.beginPath();
		var xc = this.xCanvas(a0), yc = this.yCanvas(b0), wc = this.xCanvas(a1) - xc, hc = this.yCanvas(b1) - yc; 
		ctx.strokeRect(xc, yc, wc, hc);
	};
	
	this.fillRect = function(a0, b0, a1, b1){
		ctx.beginPath();
		var xc = this.xCanvas(a0), yc = this.yCanvas(b0), wc = this.xCanvas(a1) - xc, hc = this.yCanvas(b1) - yc; 
		ctx.fillRect(xc, yc, wc, hc);
	};
}

//Distribution graph with specified canvas, distribution, label
function DistributionGraph(cvs, dist0, l0){
	//Initialize
	var dist, data, txt, l; 
	if (dist0 instanceof Distribution) dist = dist0; else dist = new UniformDistribution(0, 1);
	l = String(l0);
	var a = dist.minValue(), b = dist.maxValue(), s = dist.step(), h = dist.maxDensity(), t = dist.type();
	Graph.call(this, cvs, a - s/2, b + s/2, 0, h);
	this.setMargins(30, 20, 30, 20);
	//Colors
	var distC = "blue", dataC = "rgba(255, 0, 0, 0.7)";
	//Number formats
	var xf, yf = 2, mf = 2; //x format, y format, moment format
	if (t == DISC) xf = 0; else xf = 2;
	//Boolean variables
	var showD = true, showM = true;
	
	this.draw = function(){
		data = dist.data();
		var n = data.size(), y;
		//y Coordinates for mean/standard dviation bar
		var y0 = this.yScale(this.height() - 8), y1 = this.yScale(this.height() - 15);
		var y2 = this.yScale(this.height() - 20), y3 = this.yScale(this.height() - 3);
		this.clear();
		//Axes
		this.strokeStyle("gray"); this.fillStyle("gray");
		this.drawAxis(this.xMin(), this.xMax(), this.yMin(), s, HOR);
		this.drawText(a.toFixed(xf), a, 0, BELOW);
		this.drawText(b.toFixed(xf), b, 0, BELOW);
		this.drawAxis(this.yMin(), this.yMax(), this.xMin(), (this.yMax() - this.yMin()) / 10, VERT);
		this.drawText("0", this.xMin(), 0, LEFT);
		this.drawText(this.yMax().toFixed(yf), this.xMin(), this.yMax(), LEFT);
		//PDF graph
		this.strokeStyle(distC);
		this.fillStyle(dataC);
		if (t == DISC){
			if (showD) for (var x = a; x <= b; x = x + s) this.strokeRect(x - s/2, 0, x + s/2, dist.density(x));
			if (n > 0) for (var x = a; x <= b; x = x + s) this.fillRect(x - s/2, 0, x + s/2, data.relFreq(x));
		}
		else if (t == CONT){
			if (showD) for (var x = a; x < b; x = x + s) this.drawLine(x, dist.density(x), x + s, dist.density(x + s));
			if (n > 0) for (var x = a; x <= b; x = x + s) this.fillRect(x, 0, x + s, data.density(x + s/2));
		}
		//Moments
		if (showM){
			if (showD){
				this.strokeRect(dist.mean() - dist.stdDev(), y0, dist.mean() + dist.stdDev(), y1);
				this.drawLine(dist.mean(), y2, dist.mean(), y3);
			}
			if (n > 0) {
				this.strokeStyle(dataC);
				this.fillRect(data.mean() - data.stdDev(), y0, data.mean() + data.stdDev(), y1);
				this.drawLine(data.mean(), y2, data.mean(), y3);
			}
		}
		//Text
		txt = l;
		if (showD) txt = txt + "\tDist";
		txt = txt + "\tData";
		for (var x = a; x <= b; x = x + s){
			txt = txt + "\n" + x.toFixed(xf);
			if (showD) txt = txt + "\t" + dist.density(x).toFixed(yf);
			if (n > 0){
				if (t === DISC) y = data.relFreq(x);
				else y = data.density(x);
				txt = txt + "\t" + y.toFixed(yf);
			}
		}
		if (showM){
			txt = txt + "\nMean";
			if (showD) txt = txt + "\t" + dist.mean().toFixed(mf);
			if (n > 0) txt = txt + "\t" + data.mean().toFixed(mf);
			txt = txt + "\nSD";
			if (showD) txt = txt + "\t" + dist.stdDev().toFixed(mf);
			if (n > 1) txt = txt + "\t" + data.stdDev().toFixed(mf);
		}
	};
	
	this.text = function(){
		return txt;
	}
	
	this.showMoments = function(i){
		showM = i;
		if (showM) bm = 30; else bm = 20;
	};
	
	this.showDist = function(i){
		showD = i;
		this.draw();
	};
	
	this.setColors = function(c0, c1){
		distC = c0;
		dataC = c1;
	}
	
	this.dist = function(){
		return dist;
	};
		
}
DistributionGraph.prototype = new Graph;
		
function Parameter(input, label){
	var min = 0, max = 1, step = 0.1, value = 0.5, text = "<var>p</var>", format = 1;
	
	this.setProperties = function(mn, mx, st, v, t){
		min = mn; max = mx; step = st; text = t;
		input.min = min;
		input.max = max;
		input.step = step;
		format = Math.round(Math.log(1 / step) / Math.log(10));
		this.setValue(v);
	};
	
	this.setValue = function(x){
		if (min <= x && x <= max){
			var n = Math.round((x - min) / step);
			value = min + n * step;
		}
		else if (x < min) value = min;
		else if (x > max) value = max;
		input.value = value.toFixed(format);
		if (input.type == "range") label.innerHTML = text + " = " + value.toFixed(format);
		else if (input.type == "hidden") label.innerHTML = "";
		else label.innerHTML = text + " = ";
	};
	
	this.getValue = function(){
		this.setValue(Number(input.value));
		return value;
	};
	
	this.setType = function(t){
		input.type = t;
		this.setValue(Number(input.value));
	};
	
	this.setDisabled = function(b){
		input.disabled = b;
	};
	
	this.getMin = function(){
		return min;
	};
	
	this.getMax = function(){
		return max;
	};
	
	this.getStep = function(){
		return step;
	};
	
	this.setTitle = function(t){
		input.title = t;
		label.title = t;
	};
	
}

function Timeline(cvs, a0, a1, s0){
	var t0, t1, s;
	if (-Infinity < a0 && a0 < Infinity) t0 = a0; else t0 = 0;
	if (t0 < a1 && a1 < Infinity) t1 = a1; else t1 = t0 + 1;
	if (0 < s0 && s0 <= t1 - t0) s = s0; else s = (t1 - t0)/10;
	Graph.call(this, cvs, t0 - s/2, t1 + s/2, -1, 1);
	var arr = new Array(0), col = new Array(0);
	var r = 2, tf = Math.max(Math.round(Math.log(1/s) / Math.log(10)), 0);
	this.setMargins(10, 10,  10, 10);
	
	this.addArrival = function(t, c){
		arr.push(t);
		col.push(c);
	};
	
	this.reset = function(){
		arr.length = 0;
		col.length = 0;
	};
	
	this.draw = function(t){
		if (t > t1) t = t1;
		this.clear();
		//Axis
		this.strokeStyle("gray"); 
		this.fillStyle("gray");
		this.drawAxis(t0, t1, 0, s, HOR);
		this.drawText(t0.toFixed(tf), t0, 0, BELOW);
		this.drawText(t1.toFixed(tf), t1, 0, BELOW);
		//Arrivals
		for (var i = 0; i < arr.length; i++){
			if (arr[i] <= t){
				this.fillStyle(col[i]);
				this.drawPoint(arr[i], 0, r);
			}
		}
		//current time
		this.strokeStyle("blue");
		this.drawLine(t, -1, t, 1);
	};
	
	this.setPointSize = function(r0){
		r = r0;
	};
	
	this.setFormat = function(n){
		tf = n;
	};
}
Timeline.prototype = new Graph;
		
//Galton Board
function GaltonBoard(canvas, n){
	this.rows = n;
	Graph.call(this, canvas, -1/2, this.rows + 1/2, 0, this.rows / 2);
	this.x = this.rows/2;
	this.y = this.rows/2;
	this.r = 2;
	this.pegColor = "blue";
	this.ballColor = "rgba(255, 0, 0, 0.7)";
	var s = this.yScale(this.yCanvas(0) - 2 * this.r);  //vertical offset for ball
	
	this.reset = function(){
		this.clear();
		this.fillStyle(this.pegColor);
		for (var y = 0; y <= this.rows/2; y = y + 1/2) {
			for (var x = y; x <= this.rows - y; x++){
				this.drawPoint(x, y, this.r);
			}
		}
		this.x = this.rows / 2;
		this.y = this.rows / 2;
		this.fillStyle(this.ballColor);
		this. drawPoint(this.x, this.y + s, this.r);
	};
	
	this.setPath = function(p){
		this.fillStyle(this.ballColor);
		this.drawPoint(this.x, this.y, this.r);
		for (var i = 0; i < this.rows; i++){
			this.y = this.y - 1/2;
			this.x = this.x - 1/2 + p[i];
			this.drawPoint(this.x, this.y + s, this.r);
		}
	};
	
	this.move = function(j){
		this.x = this.x - 1/2 + j;
		this.y = this.y - 1/2;
		this.fillStyle(this.ballColor);
		this.drawPoint(this.x, this.y + s, this.r);
	};
}
GaltonBoard.prototype = new Graph;

//State space
function StateSpace(cvs, a0, a1, s0){
	var x0, x1, s;
	if (-Infinity < a0 && a0 < Infinity) x0 = a0; else x0 = 0;
	if (x0 < a1 && a1 < Infinity) x1 = a1; else x1 = x0 + 1;
	if (0 < s0 && s0 <= x1 - x0) s = s0; else s0 = (x1 - x0)/10;
	Graph.call(this, cvs, x0 - s/2, x1 + s/2, -1, 1);
	//Point radius, current state, initial state
	var r = 3, xc = x0, xi = xc;
	//Current color, initial color, format
	var colc = "rgba(255, 0, 0, 0.7)", coli = "blue", xf = Math.max(Math.round(Math.log(1/s) / Math.log(10)), 0);
	this.setMargins(10, 10, 0, 0);
	
	
	this.setInitialState = function(x){
		xi = x;
		this.setState(xi);
	};
	
	this.setState = function(x){
		xc = x;
		this.clear();
		//Axis
		this.strokeStyle("gray");
		this.fillStyle("gray");
		this.drawAxis(x0, x1, 0, s, HOR);
		this.drawText(x0.toFixed(xf), x0, 0, BELOW);
		this.drawText(x1.toFixed(xf), x1, 0, BELOW);
		//Initial state and current states
		this.fillStyle(coli);
		this.drawPoint(xi, 0, r);
		this.fillStyle(colc)
		this.drawPoint(xc, 0, r);
	};
	
	this.setColors = function(c0, c1){
		coli = c0;
		colc = c1;
	};
	
	this.setFormat = function(n){
		xf = n;
	};
	
	this.setPointSize = function(r0){
		r = r0;
	};
}

function QuantileGraph(cvs, dist0){
	var dist;
	if (dist0 instanceof Distribution) dist = dist0; else dist = new UniformDistribution(0, 1);
	var a = dist.minValue(), b = dist.maxValue(), s = dist.step(), h = dist.maxDensity();
	//Initialize graph
	Graph.call(this, cvs, a - s/2, b + s/2, 0, h);
	this.setMargins(30, 20, 30, 20);
	var type = PDF;
	//Colors
	var distC = "blue", dataC = "rgba(255, 0, 0, 0.7)";
	//x value and p value for CDF/Quantile functions
	var value = a, prob = 0;
	//formats
	var xf = Math.max(Math.round(Math.log(1/s) / Math.log(10)), 0), yf = 3;
		
	this.draw = function(){
		var x, y, x1, y1;
		if (type == PDF) dataC = "rgba(255, 0, 0, 0.7)"; else dataC = "red";
		this.clear();
		//Draw axes
		this.strokeStyle("gray"); this.fillStyle("gray");
		this.drawAxis(a - s/2, b + s/2, 0, s, HOR);
		this.drawText(a.toFixed(xf), a, 0, BELOW);
		this.drawText(b.toFixed(xf), b, 0, BELOW);
		this.drawAxis(0, h, a - s/2, h/10, VERT);
		this.drawText("0", a - s/2, 0, LEFT);
		this.drawText(h.toFixed(yf), a-s/2, h, LEFT);
		//Draw distribution graph
		this.strokeStyle(distC);
		this.fillStyle(dataC);
		if (dist.type() === DISC){
			for (x = a; x < b + s/2; x = x + s){
				if (type == CDF) y = dist.CDF(x); else y = dist.density(x);
				this.strokeRect(x - s/2, 0, x + s/2, y);
			}
			this.strokeStyle(dataC);
			this.fillStyle(dataC);
			if (type == CDF){
				this.drawLine(a - s/2, dist.CDF(value), value, dist.CDF(value)); 
				this.drawLine(value, 0, value, dist.CDF(value));
			}
			else for (x = a; x < value + s/2; x = x + s) this.fillRect(x - s/2, 0, x + s/2, dist.density(x));
		}
		else{
			this.beginPath();
			x = a;
			if (type == CDF) y = dist.CDF(x); else y = dist.density(x);
			this.moveTo(x, y);
			for (x = a; x < b; x = x + s){
				x1 = x + s;
				if (type == CDF) y1 = dist.CDF(x1); else y1 = dist.density(x1);
				this.lineTo(x1, y1);
			}
			this.stroke();
			if (type == CDF){
				this.strokeStyle(dataC);
				this.drawLine(a - s/2, dist.CDF(value), value, dist.CDF(value)); 
				this.drawLine(value, 0, value, dist.CDF(value));
			}
			else{
				this.beginPath();
				x = a;
				this.moveTo(x, 0);
				this.lineTo(x, dist.density(x));
				for (x = a; x < value; x = x + s){
					x1 = x + s;
					this.lineTo(x1, dist.density(x1));
				}
				this.lineTo(x, 0);
				this.fill();
			}
		}
	};

	this.setValue = function(x){
		value = x;
		prob = dist.CDF(x);
		this.draw();
	};

	this.setProb = function(p){
		prob = p;
		value = dist.quantile(p);
		this.draw();
	};

	this.setXFormat = function(n){
		xf = n;
		this.draw();
	};

	this.setYFormat = function(n){
		yf = n;
		this.draw();
	};

	this.setColors = function(c1, c2){
		distC = c1;
		dataC = c2;
		this.draw();
	};

	this.setGraphType = function(t){
		type = t;
		if (type == CDF) h = 1;
		else h = dist.maxDensity();
		this.setBounds(a - s/2, b + s/2, 0, h);
		this.draw();
	};
}
QuantileGraph.prototype = new Graph;

function getMouseCoordinates(el, ev){
    var element = el;
    var event = ev;
    var offsetX = 0;
    var offsetY = 0;
    if (element.offsetParent) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }
    return [event.pageX - offsetX, event.pageY - offsetY]; 
}

