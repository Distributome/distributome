function CardClass(num1)
{
	this.cardID=num1;
	this.controller=0;
	this.hist=0;
	this.used=false;
	this.dropCode='<section id="space'+this.cardID+'"><canvas id="card' + this.cardID + '" class="boardcard"></canvas></section>';
	this.backColor="rgb("+(Math.floor((Math.random()-.5)*60)+74)+", "+(Math.floor((Math.random()-.5)*60)+74)+", "+(Math.floor((Math.random()-.5)*100)+194)+")";
	
	//place card on board
	this.placeCard=function()
	{
		$('#board').append(this.dropCode);
		$("#card"+this.cardID).css({"width":"190px","height":"90px","float":"left","border-style":"solid","border-width":"5px","background-color":"white","border-color":"rgb(194, 194, 208)"});
	};
	
	//handles highlighting of cards in UI
	this.highlight=function()
	{
		$("#card"+this.cardID).css({"border-color":"black"});
	};
	this.unhighlight=function()
	{
		var borderColor="rgb(194, 194, 208)";
		if(this.controller==1)
			borderColor="darkGreen";
		if(this.controller==-1)
			borderColor="darkRed";
		$("#card"+this.cardID).css({"border-color":borderColor});
	};
	
	//selecting of cards by user
	this.p1select=function()
	{
		if(this.controller==0)
		{
			this.controller=1;
			$("#card"+this.cardID).css({"border-color":"darkGreen"});
			return fields()[0].value;
		}
		return 0;
	};
	
	//selecting of cards by AI
	this.p2select=function()
	{
		if(this.controller==0)
		{
			this.controller=-1;
			$("#card"+this.cardID).css({"border-color":"darkRed"});
			return true;
		}
		return false
	};
	
	this.deselect=function()
	{
		if(!(this.used))
		{
			this.controller=0;
			$("#card"+this.cardID).css({"border-color":"rgb(194, 194, 208)"});
		}
	}
	
	//displays card histogram
	this.setHist=function(num1,num2,num3, arr1)
	{
		this.hist=new histMaker(num1,num2,num3,arr1[num1-1]);
		this.hist.initializeExperiment();
	}
}