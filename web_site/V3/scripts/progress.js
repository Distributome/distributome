var svg, bars, data, limit, width, numNums, fillCol=["#00FF00","red"]

//creates progress bar area
function makeBar(w, n)
{
	width=w
	numNums=n
	svg=d3.select("#progressbar").attr("width", width+"px").attr("height", "20px")
	for(var j=0;j<n;j++)
		svg.append("g")
		
	svg.selectAll("g").append("rect")
	.attr("height", "20px")
	.attr("width", "0px")
}

//transitions changes to red/green areas
function changeBar(vals, total)
{
	data=vals;
	limit=total;
	bars=svg.selectAll("rect").data(vals)
	.attr("fill",function(d,i){return fillCol[i]})
	.transition()
	.duration(1000)
	.attr("transform", function(d, i) { return "translate("+calcLength(i)+",0)"; })
	.attr("width", function(d,i){return (d/limit*width)+"px"});
	
}

//calculates length of each segment
function calcLength(index)
{
	var tot=0;
	for(var j=0;j<index;j++)
		tot+=data[j]*width/limit
	return tot;
}
