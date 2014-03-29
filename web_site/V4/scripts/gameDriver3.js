//bools
var simpleGame, roundOn, textMode, needSwap;

//integers
var numCards, gameSpeed, roundsLeft, p1score, numGraphs, curCard, swapsLeft, correctCard, answeredCard, numRounds, longestStreak, currStreak;

//arrays
var graphTypes, graphChosen, cardList, masterParms, distCard;

var distributions, intervalKey;

//jquery calls
$(document).ready(function() {
	
	$('#startup-modal').modal('show');
    
	//printer button
	$('#printResultsButton').click(function() { window.print(); });
	
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
			answeredCard=Number(this.id.substring(4,this.id.length));
			console.log(answeredCard);
			endRound();
		}
	}); 
});

//sets up board for a new game
function boardSetup()
{
	needSwap=true;
	longestStreak=0;
	currStreak=0;
	numCards=Number($('input[name="numcards"]:checked').val());
	gameSpeed=Number($('input[name="gamespeed"]:checked').val());
	roundsLeft=Number($('input[name="gamelength"]:checked').val());
	cardList=new Array();
	masterParms=new Array();
	makeBar((190*(numCards)+50*(numCards-1)),2)
	numRounds=roundsLeft;
	for(var j=0;j<31;j++)
	{
		masterParms[j]=getParms(j+1);
	} 
	
	//checks for simplified or general veresion
	if($('input[name="gametype"]:checked').val()==1)
		simpleGame=false;
	else
		simpleGame=true;
		
	if($('input[name="textmode"]:checked').val()==1)
		textMode=true;
	else
		textMode=false;
	
	console.log(textMode)
	
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
	window.setTimeout(function(){startRound()},2000);
}

//starts next round
function startRound()
{
	getGraphs();
	distCard=new Array()
	curCard=0;
	
	//shows identity of each card, then hides again
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
	swapsLeft=5;
	roundOn=false;
 	window.setTimeout(function(){swapNext()},3200); 
}

function swapNext()
{
	if(swapsLeft>0)
	{
		//select cards to be swapped
		var c1=Math.floor(Math.random()*numCards);
		var c2;
		
		//check to make sure 2 different cards are selected
		do{c2=Math.floor(Math.random()*numCards)}while(c2==c1)
		
		//sort cards in ascending order
		if(c1>c2)
		{
			var tempc=c1;
			c1=c2;
			c2=tempc
		}
		
		swapsLeft--;
		//swap cards
		swapCards("#space"+c1,"#space"+c2,(c1*(190+40)),(c2*(190+40)));
		
	}
	else
	{
		console.log("flip done")
		correctCard=Math.floor(Math.random()*numCards);
		roundOn=true;
		if(textMode)
		{
			$("#facecard").flip({
				direction:"tb", 
				color:"#008B8B", 
				content:("Select the "+(cardList[correctCard].dist.getDist())+" distribution")
			})
		}
		else
		{
			$("#facecard").flip({
				direction:"tb", 
				onEnd: function()
				{
					var histogram=new histMaker(graphTypes[correctCard]+1,500,correctCard, masterParms[correctCard] )
				$("#flipsection").append('<canvas id="hist'+correctCard+'"></canvas>');
				histogram.initializeExperiment();
				$("#hist"+correctCard).css({"width":"400","background-color":"white","height":"200"});
				$("#facecard").hide();				
				}
			})
		}
		console.log("Correct card: "+correctCard);
	}
}

//ends current round
function endRound()
{
	roundsLeft--;
	roundOn=false;
	smartTime=0;
	
	//compares selected card to actual card
	if(answeredCard==correctCard)
	{console.log("correct");
		currStreak++;
		p1score++;
		if(textMode)
			$("#facecard").flip({
				direction:"tb", 
				color:"rgb(50,200,60)", 
				content:"Correct!"
			})
		else
		{
			$("#facecard").css({"background-color":"rgb(50,200,60)"})
			$("#facecard").text("Correct!")
			$("#hist"+correctCard).flip({
				direction:"tb", 
				color:"rgb(50,200,60)", 
				onEnd:function(){
					$("#hist"+correctCard).remove()
					$("#facecard").show()
				}
			})
		}
	}
	
	else
	{
		if(currStreak>longestStreak)
			longestStreak=currStreak;
		currStreak=0;
		if(textMode)
			$("#facecard").flip({
				direction:"tb", 
				color:"red", 
				content:"Incorrect! Too Bad!"
			})
		else
		{console.log("wrong")
			$("#facecard").css({"background-color":"red"})
			$("#facecard").text("Incorrect! Too Bad!")
			$("#hist"+correctCard).flip({
				direction:"tb", 
				color:"rgb(50,200,60)", 
				onEnd:function(){
					$("#hist"+correctCard).remove()
					$("#facecard").show()
				}
			})
		}
	}
	changeBar([p1score,numRounds-roundsLeft-p1score],numRounds)
	console.log("streak"+currStreak+" longest: "+longestStreak);
	//checks to see if game is over
	if(roundsLeft>0)
	{
		window.setTimeout(function(){startRound()},1500);
	}
	
	//endgame sequence
	else
	{
		window.setTimeout(function()
		{
			$("#game").empty();
			$("#yourscore").html(p1score);
			console.log(numRounds+" score: "+p1score);
			$("#stats").html("<h4>Longest Streak:</h4><p>"+longestStreak+"</p><h4>Accuracy:</h4><p>"+(p1score*100/numRounds).toFixed(2)+"%</p>");
			if(p1score<numRounds/2)
				$("#finalmess").html("<b>You need more practice!</b>");
			else if(p1score<numRounds)
				$("#finalmess").html("<b>Great Job! Try to get a perfect score next time!</b>");
			else
				$("#finalmess").html("<b>Wow! Perfect Score!</b>");
			$('#results-modal').modal('show');
			
		},1000);
	}
	$("#scores").html('<p>Score: '+p1score+'</p><p>Current Round: '+(numRounds-roundsLeft+1)+'</p><p>Rounds Left: '+(roundsLeft-1)+'</p><p>Longest Streak: '+longestStreak+'</p>')

}

//creates gameboard using recieved parameters;
function setBoard()
{
	$("#facecard").html("Let's play a game!");
	$("#scores").html('<p>Score: 0</p><p>Current Round: 1</p><p>Rounds Left: '+numRounds+'</p><p>Longest Streak: 0</p>')
	$("#scores").css({"position":"relative", "left":(((textMode)?1000:400)+15)+"px", "top":"50px","border-style":"solid", "width":"200px"})
	$("#facecard").css({"position":"relative","top":"0px","height":"200px","width":"1000px", "background-color":"rgb(50,200,60)", "text-align":"center", "line-height":"200px", "font-family":"Verdana","font-size":"2.5em", "color":"white"})
	$("#flipsection").css({"position":"relative","top":"250px","height":"200px","width":"1000px"})
	if(!textMode)
	{
		$("#facecard").css({"height":"200px","width":"400px", "top":"0px"})
	}
	$("#board").css({"position":"relative", "top":"110px","width":((190*(numCards)+50*(numCards-1))+"px"),"z-index":"0","height":(110)+"px","background-color":"rgb(255, 255, 255)"});
	for(var j=0;j<numCards;j++)
	{
		cardList[j].placeCard();
	}
}

//obtains random graph types for each card on board
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

function swapID(name1, name2)
{
	needSwap=!needSwap;
	if(needSwap)
	{
		$(name1).attr('id',"temp")
		$(name2).attr('id',name1.substring(1))
		$("#temp").attr('id',name2.substring(1)) 
		swapNext();
	}
}

//function to animate any HTML object in an elliptical path
//total time:1000/speed
function animateAround(name,radius,startX, startY, dir, theta, speed, swapstring)
{
	theta+=.01;
	var nextX=(Math.cos(theta*Math.PI+Math.PI)+1)*radius*dir+startX;
	var nextY=startY+(-1)*Math.sin(theta*Math.PI+Math.PI)*100*dir;
	$(name).css({"left":nextX+"px"});
	$(name).css({"bottom":nextY+"px"});
	if(theta<1)
	{
		window.setTimeout(function(){animateAround(name, radius, startX, startY, dir, theta, speed, swapstring)}, 10/speed)
	}
	else
	{
		swapID(name, swapstring);
	}
}

//function to swap 2 cards, and prompt for choice
function swapCards(card1, card2, card1x, card2x)
{
	animateAround(card1, (card2x-card1x)/2, card1x, 90*Number($(card1).children().attr('id').substring(4,$(card1).children().attr('id').length))-30, 1, 0,gameSpeed, card2)
	animateAround(card2, (card2x-card1x)/2, card2x, 90*Number($(card2).children().attr('id').substring(4,$(card2).children().attr('id').length))-30, -1, 0,gameSpeed, card1)
}
