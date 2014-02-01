//integers
var numGraphs, numCards, rowCards, p1bonus, p2bonus, p1score, p2score, sampleSize, perfectSquare, graphTypes, roundsLeft, enemyDiff,gameSpeed, currRound;
//booleans
var simpleGame, roundOn;

//arrays
var cardUsed, cardList, chosenGraph, masterParms, roundCard,downCards, downColor, numRight, numWrong;

var distCard;

//jquery calls
$(document).ready(function() {
	
	$('#startButton').click(function() {
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
			cardList[Number(this.id.substring(4,this.id.length))].p1select();
	}); 
});

//sets up board for a new game
function boardSetup()
{
	
	//initialize variables and arrays
	p1score=0;p2score=0;p1bonus=1;p2bonus=1;
	numRight=new Array();
	numWrong=new Array();
	downCards=new Array();
	downColor=new Array();
	roundOn=false;
	currRound=0;
	numGraphs=Number(document.getElementById("numgraphs").value);
	sampleSize=Number(document.getElementById("samplesize").value);
	numCards=numGraphs*2;
	roundsLeft=numGraphs;
	chosenGraph=new Array();
	roundCard=new Array();
	cardUsed=new Array();
	cardList=new Array();
	gameSpeed=Number($('input[name="gamespeed"]:checked').val());
	enemyDiff=Number($('input[name="enemydiff"]:checked').val());
	masterParms=new Array()
	for(var j=0;j<31;j++)
	{
		masterParms[j]=getParms(j+1);
	} 
	
	
	//determines board dims
	rowCards=Math.floor(Math.sqrt(numCards));
	for(perfectSquare=0;rowCards*(rowCards+perfectSquare)<numCards;perfectSquare++)
	{}
	
	//checks for simplified or general veresion
	if($('input[name="gametype"]:checked').val()==1)
		simpleGame=false;
	else
		simpleGame=true;
	
	//determines list of selectable graphs
	if(simpleGame)
		graphTypes=22;
	else
		graphTypes=31;
	var graphTaken=new Array()
	
	for(var j=0;j<graphTypes;j++)
	{
		graphTaken[j]=false;
	}	
	
	//selects graph for each card
	for(var j=0;j<numGraphs;j++)
	{
		cardUsed[j]=false;
		var k;
		do
		{
			k=Math.floor(Math.random()*graphTypes);
		}while (graphTaken[k]);
		graphTaken[k]=true;
		chosenGraph[j]=k;
	}
	
	//duplicates cards
	for(var j=numGraphs;j<numCards;j++)
	{
		var k;
		do
		{
			k=Math.floor(Math.random()*numGraphs);
		}while (cardUsed[k]);
		cardUsed[k]=true;
		chosenGraph[j]=chosenGraph[k];
	}
	
	for(var j=0;j<numGraphs;j++)
		cardUsed[j]=false;
	
	//populates card list
	for(var j=0;j<numCards;j++)
	{
		cardList[j]=new Card(j);
	}
	
	for(var j=0;j<numGraphs;j++)
	{
		var k;
		do
		{
			k=Math.floor(Math.random()*numGraphs);
		}while (cardUsed[k]);
		cardUsed[k]=true;
		roundCard[j]=chosenGraph[k];
	}
	
	//wipes instructions and creates board	
	$("#intro").empty();
	setBoard();
	$("#scores").html('P1 Score: <b>'+p1score+'</b> P2 Score: <b>'+p2score+'</b><br>P1 Combo Multiplier: <b>x'+p1bonus+'</b> P2 Combo Multiplier: <b>x'+p2bonus+"</b>");
	$('#facecard').append('<img src="scripts/images/cardBack.jpg" id="backimage"></img>');
	$("#backimage").css({"width":"300","height":"150"});
	$("#facecard").css({"position":"inline","width":"300","background-color":"white","height":"150"});
	$("#matchtimer").css({"position":"inline","width":"300"});
	//revealAll();
	
	window.setTimeout(function(){startRound()},3000);
}

//starts next round
function startRound()
{
	$("#facecard").flip({
		direction:'tb',
		onEnd:function(){
			$("#backimage").hide();
			$('#facecard').append('<canvas id="distcanv"></canvas>');
			$("#distcanv").css({"width":"300","background-color":"white","height":"150"});
			distCard=new distMaker(roundCard[currRound]+1,masterParms[roundCard[currRound]]);
			distCard.initialize();
		}
	});
	window.setTimeout(function(){startTimer(gameSpeed)},1000);
	window.setTimeout(function(){AIselect()},1000+gameSpeed*1000*enemyDiff);
	roundOn=true;
}

//ends current round
function endRound()
{
	currRound++;
	roundOn=false;
	$("#facecard").flip({
		direction:'bt',
		onEnd:function(){
			$("#backimage").show();
			$("#distcanv").remove();
			
		}
	});
	flipDown();
	reconcileBoard();
	if(currRound<numGraphs)
		window.setTimeout(function(){startRound()},1500);
	else
	{
		window.setTimeout(function()
		{
			$("#game").empty();
			if(p1score>p2score)
				$("#intro").html('<b>P1 Wins!</b>');
			else if(p2score>p1score)
				$("#intro").html('<b>P2 Wins!</b>');
			else
				$("#intro").html("<b>It's a tie!</b>");
		},1000);
	}
}

function AIselect()
{
	for(var i=0;i<numCards;i++)
	{
		if(chosenGraph[i]==roundCard[currRound])
		{
			cardList[i].p2select();
		}
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
				numRight[(cardList[i].controller==1)?0:1]++;
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
					$("#card"+flipDex).remove();
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
	$("#board").css({"width":((200*(rowCards))+"px"),"z-index":"0","height":(100*(rowCards+perfectSquare))+"px","background-color":"rgb(194, 194, 208)","padding":"5px"});
	for(var j=0;j<numCards;j++)
	{
		cardList[j].placeCard();
		cardList[j].setHist(chosenGraph[j]+1,sampleSize,j, masterParms);
	}
}

//function to reveal field cards
function revealAll()
{
	for(var j=0;j<numCards;j++)
	{
		revealCard(j);
	}
}

function revealCard(num2)
{
		window.setTimeout(function(){$("#card"+num2).css({"border-color":"yellow"});},500*(num2+1));
}