function monteClass(num1)
{
	this.cardID=num1;
	this.dist=0;
	this.used=false;
	this.dropCode='<section id="space'+this.cardID+'"><img src="scripts/images/cardBack.jpg" class="backimage boardcard"  id="card' + this.cardID + '" ></img></section>';
	this.backColor="rgb("+(Math.floor((Math.random()-.5)*60)+74)+", "+(Math.floor((Math.random()-.5)*60)+74)+", "+(Math.floor((Math.random()-.5)*100)+194)+")";
	
	//place card on board
	this.placeCard=function()
	{
		$('#board').append(this.dropCode);
		$("#card"+this.cardID).css({"width":"190px","height":"90px","border-style":"solid","border-width":"5px","background-color":"white","border-color":"rgb(255, 255, 255)"});
		$("#space"+this.cardID).css({"width":"200px","position":"relative", "bottom":(90*this.cardID-30)+"px","left":((this.cardID*(190+40))+"px")});

	};
	
	//handles highlighting of cards in UI
	this.highlight=function()
	{
		$("#card"+this.cardID).css({"border-color":"black"});
	};
	this.unhighlight=function()
	{
		var borderColor="rgb(255, 255, 255)";
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
	
	
	//displays card histogram
	this.setDist=function(num1,num2,arr1)
	{
		this.dist=new distMaker(num1,num2,arr1[num1-1]);
		this.dist.initialize();
	}
}