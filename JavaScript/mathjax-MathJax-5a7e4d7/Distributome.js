<script type="text/javascript" src="./MathJax.js?config=default"></script>

<script type="text/x-mathjax-config">
  MathJax.Hub.Config({
    extensions: ["tex2jax.js"],
    jax: ["input/TeX","output/HTML-CSS"],
    tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]}
  });
</script>

<script type="text/javascript">

xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET","Distributome.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;

var DistributomeXML_Objects=xmlDoc.documentElement.childNodes;
// document.write("Distributome Level=1 Tags: <br />");

for (i=0;i<DistributomeXML_Objects.length;i++)
{   	if (DistributomeXML_Objects[i].nodeType==1)
  	{	//Process only level=1 element nodes (type 1) 
  		//DistributomeXML_Objects[i].nodeName+": "+DistributomeXML_Objects[i].childNodes[0].nodeValue);

		// Level1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].childNodes;
		// currLevel1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].firstChild;

		for (j=0;j<Level1Prop.length;j++)
		{	if (currLevel1Prop.nodeType==1)
  			{ //Process only level=2 element nodes (type 1)
  			  // currLevel1Prop.nodeName+": "+currLevel1Prop.childNodes[0].nodeValue);

				//Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[0].childNodes;
				//currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[0].firstChild;

				for (k=0;k<Level2Prop.length;k++)
				{	if (currLevel2Prop.nodeType==1)
  					{ //Process only level=3 element nodes (type 1)
  					  // currLevel2Prop.nodeName+": "+currLevel2Prop.childNodes[0].nodeValue);
					}
				//currLevel2Prop=currLevel2Prop.nextSibling;
				}

  			}
			//currLevel1Prop=currLevel1Prop.nextSibling;
		}
	} 
}

</script>
