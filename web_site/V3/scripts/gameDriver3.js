//bools
var simpleGame

//integers
var numCards, gameSpeed, roundsLeft, p1score, numGraphs, curCard, swapsLeft;

//arrays
var graphTypes, graphChosen, cardList, masterParms, distCard;

var distributions, intervalKey;

//jquery calls
$(document).ready(function() {
	
	$('#startup-modal').modal('show');
	
	$('#startup-modal').on('hidden.bs.modal', function (e) {
		boardSetup();
	});
	$(document).on('mouseenter', ".boardcard", function() 
	{ 
		cardList[Number(this.id.substring(4,this.id.length))].highlight();
	}); 
	$(document).on('mouseleave', ".boardcard", function() 
	{ 
		cardList[Number(this.id.substring(4,this.id.length))].unhighlight();
	}); 
	$(document).on('click', ".boardcard", function() 
	{ 
		if(roundOn)
		{
			answerTimes[Number(this.id.substring(4,this.id.length))]=1-cardList[Number(this.id.substring(4,this.id.length))].p1select();
		}
	}); 
});

//sets up board for a new game
function boardSetup()
{
	numCards=Number($('input[name="numcards"]:checked').val());
	gameSpeed=Number($('input[name="gamespeed"]:checked').val());
	roundsLeft=Number($('input[name="gamelength"]:checked').val());
	cardList=new Array();
	masterParms=new Array();
	for(var j=0;j<31;j++)
	{
		masterParms[j]=getParms(j+1);
	} 
	
	//checks for simplified or general veresion
	if($('input[name="gametype"]:checked').val()==1)
		simpleGame=false;
	else
		simpleGame=true;
	
	//determines list of selectable graphs
	if(simpleGame)
		numGraphs=22;
	else
		numGraphs=31;
	
	p1score=0;
	
	for(var j=0;j<numCards;j++)
	{
		cardList[j]=new monteClass(j);
	}
	
	//wipes instructions and creates board	
	setBoard();
/* 	$("#scores").html('P1 Score: <b>'+p1score+'</b> P2 Score: <b>'+p2score+'</b><br>P1 Combo Multiplier: <b>x'+p1bonus+'</b> P2 Combo Multiplier: <b>x'+p2bonus+"</b>"); */
	
	window.setTimeout(function(){startRound()},2000);
}

//starts next round
function startRound()
{
	getGraphs();
	distCard=new Array()
	curCard=0;
	for(var j=0;j<numCards;j++)
	{
		$("#card"+j).flip({
			direction:'tb',
			onEnd:function()
			{
				$("#card"+curCard).hide();
				$("#space"+curCard).append('<canvas id="distcanv'+curCard+'"></canvas>');
				$("#distcanv"+curCard).css({"width":"190","background-color":"white","height":"90"});
				cardList[curCard].setDist(graphTypes[curCard]+1,curCard, masterParms);
				curCard++;
			}
		})
		window.setTimeout(function(){
			$("#distcanv"+(curCard-numCards)).flip({
				direction:'tb',
				onEnd:function()
				{
					$("#card"+(curCard-numCards-numCards)).show();
					$("#distcanv"+(curCard-numCards-numCards)).remove();
					curCard++;
				}
			})
			curCard++;
		},2000);
	}
	swapsLeft=1;
 	window.setTimeout(function(){
		intervalKey=window.setInterval(function(){
		var c1=Math.floor(Math.random()*numCards);
		var c2;
		do{c2=Math.floor(Math.random()*numCards)}while(c2==c1)
		if(c1>c2)
		{
			var tempc=c1;
			c1=c2;
			c2=tempc
		}
		swapCards("#space"+c1,"#space"+c2,(c1*(190+40)),(c2*(190+40)));
		},1000/gameSpeed+120);
	},3200); 
	
	
	roundOn=true;
}

//ends current round
function endRound()
{
	currRound++;
	roundOn=false;
	smartTime=0;
	$("#facecard").flip({
		direction:'bt',
		onEnd:function(){
			$("#backimage").show();
			$("#distcanv").remove();
			
		}
	});
	if(hideCards)
	flipDown();
	reconcileBoard();
	if(answerFound)
	{
		weightedAverage+=smartTime;
		weightedAverage/=2;
	}
	if(smartAI)
	{
		startTimes[enemyDiff]+=(weightedAverage-startTimes[enemyDiff]+smartAdd[enemyDiff])*smartMult[enemyDiff];
		if(startTimes[enemyDiff]<0)
			startTimes[enemyDiff]=.05;
		if(startTimes[enemyDiff]>1)
			startTimes[enemyDiff]=.95;
	}
	if(currRound<numGraphs)
		window.setTimeout(function(){startRound()},1500);
	else
	{
		window.setTimeout(function()
		{
			$("#game").empty();
			$("#yourscore").html(p1score);
			$("#hisscore").html(p2score);
			if(p1score>p2score)
				$("#finalmess").html('<b>Congratulations, you win!</b>');
			else if(p2score>p1score)
				$("#finalmess").html('<b>You lose. Better luck next time!</b>');
			else
				$("#finalmess").html("<b>It's a tie!</b>");
			$('#results-modal').modal('show');
			
		},1000);
	}
}


//determines scores and performs board cleanup
function reconcileBoard()
{
	for(var i=0;i<2;i++)
	{
		numRight[i]=0;
		numWrong[i]=0;
	}
	for(var i=0;i<numCards;i++)
	{
		if(cardList[i].controller!=0)
		{
			if(chosenGraph[i]==roundCard[currRound-1])
			{
				numRight[(cardList[i].controller==1)?0:1]++;
				if(cardList[i].controller==1)
				{
					if(answerFound)
					{
						smartTime+=answerTimes[i];
						smartTime/=2;
					}
					else
					{
						smartTime+=answerTimes[i];
						answerFound=true;
					}
				}
			}
			else
				numWrong[(cardList[i].controller==1)?0:1]++;
		}
	}
	p1bonus*=(numRight[0]>0)?numRight[0]:1;
	p2bonus*=(numRight[1]>0)?numRight[1]:1;
	if(numWrong[0]>0)
		p1bonus=1;
	if(numWrong[1]>0)
		p2bonus=1;
	p1score+=(numRight[0]-numWrong[0])*p1bonus;
	p2score+=(numRight[1]-numWrong[1])*p2bonus;
	$("#scores").html('P1 Score: <b>'+p1score+'</b> P2 Score: <b>'+p2score+'</b><br>P1 Combo Multiplier: <b>x'+p1bonus+'</b> P2 Combo Multiplier: <b>x'+p2bonus+"</b>");
	for(var i=0;i<numCards;i++)
	{
		cardList[i].deselect();
	}
}

//flips down correct cards
function flipDown()
{
	var curDown=0,nextFlip=0;
	for(var j=0;j<numCards;j++)
	{
		if(chosenGraph[j]==roundCard[currRound-1])
		{
			downCards[curDown]=j;
			var color;
			if(cardList[j].controller==1)
			{
				downColor[curDown]="green";
			}
			else if(cardList[j].controller==-1)
			{
				downColor[curDown]="red";
			}
			else
			{
				downColor[curDown]="black";
			}
			curDown++;
			$("#card"+j).flip({
				direction:'tb',
				onEnd:function(){
				var flipDex=downCards[nextFlip];
				nextFlip++;
					$("#card"+flipDex).hide();
					$("#space"+flipDex).append('<img src="scripts/images/'+downColor[nextFlip-1]+'.jpg" id="color'+flipDex+'"></img>');
					$("#color"+flipDex).css({"width":"190","height":"90", "float":"left","border-style":"solid","border-width":"5px","border-color":"rgb(194, 194, 208)"}); 
				}
			});
		}
	}
};

//creates gameboard using recieved parameters;
function setBoard()
{
	$("#facecard").html("Let's play a game!");
	$("#facecard").css({"position":"relative","top":"350px","height":"200px","width":"500px", "background-color":"rgb(50,200,60)", "text-align":"center", "line-height":"200px", "font-family":"Verdana","font-size":"2.5em", "color":"white"})
	$("#board").css({"position":"relative", "top":"110px","width":((190*(numCards)+50*(numCards-1))+"px"),"z-index":"0","height":(110)+"px","background-color":"rgb(255, 255, 255)"});
	for(var j=0;j<numCards;j++)
	{
		cardList[j].placeCard();
	}
}

function getGraphs()
{
	graphTypes=new Array();
	graphChosen=new Array();
	for(var j=0;j<numGraphs;j++)
	{
		graphChosen[j]=false;
	}
	for(var j=0;j<numCards;j++)
	{
		var k;
		
		do
		{
			k=Math.floor(Math.random()*numGraphs);
		}while (graphChosen[k]);
		graphChosen[k]=true;
		graphTypes[j]=k;
	}
}

//total time:1000/speed
function animateAround(name,radius,startX, startY, dir, theta, speed)
{
	theta+=.01;
	var nextX=(Math.cos(theta*Math.PI+Math.PI)+1)*radius*dir+startX;
	var nextY=(-1)*Math.sin(theta*Math.PI+Math.PI)*100*dir+startY;
	$(name).css({"left":nextX+"px"});
	$(name).css({"top":nextY+"px"});
	if(theta<1)
	{
		window.setTimeout(function(){animateAround(name, radius, startX, startY, dir, theta, speed)}, 10/speed)
	}
}
function swapCards(card1, card2, card1x, card2x)
{console.log(card1+" "+card2);
	animateAround(card1, (card2x-card1x)/2, card1x, 210, 1, 0,gameSpeed)
	animateAround(card2, (card2x-card1x)/2, card2x, 210, -1, 0,gameSpeed)
	swapsLeft--;
	if(swapsLeft<1)
		window.clearInterval(intervalKey)
	window.setTimeout(function(){
		var temp=card1;
		var temp2=card2;
		$(card1).attr('id',"temp")
		$(card2).attr('id',"HHH")
		$("#temp").attr('id',temp2) 
	},1000/gameSpeed+70)
}
