
var relationStrength = new Array();
relationStrength["convolution"] = 2;
relationStrength["transformation"] = 2;
relationStrength["linear transformation"] = 3;
relationStrength["special case"] = 4;
relationStrength["conditioning"] = 5;
relationStrength["central limit theorem"] = 3;
relationStrength["conditional distribution"] = 5;
relationStrength["parameter limit"] = 6;
relationStrength["inverse stochastic process"] = 4;
relationStrength["location-scale transformation"] = 3;
relationStrength["scale transformation"] = 2;
relationStrength["nonlinear transformation"] = 3;
relationStrength["mixture and transformation"] = 2;
relationStrength["limiting distribution"] = 3;
relationStrength["limiting conditional distribution"] = 4;
relationStrength["limiting distribution"] = 2;
relationStrength["location-scale transformation"] = 3;
relationStrength["tbd"] = 3;
relationStrength["mixture"] = 4;
relationStrength["limiting distribution with respect to parameter"] = 5;
relationStrength["inverse stochastic process"] = 4;
relationStrength["stochastic process"] = 3;
relationStrength["compound poisson transformation"] = 2;

var group = new Array();
group["continuous"] = 2;
group["discrete"] = 3;

/*************** Ajax request seperated for IE and others **************/
function createAjaxRequest(){
	var xmlHttp;
	try{
	 // use the ActiveX control for IE5.x and IE6.
		xmlHttp = new ActiveXObject('MSXML2.XMLHTTP.3.0');
	}catch (e){		 
		try{
			xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');	// Internet Explorer 6+
		}catch(e){
			try{
				xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');   // Internet Explorer 5.5
			}catch(e2){
				try{
					xmlHttp = new XMLHttpRequest();	//  Firefox, Opera 8.0+, Safari
				}catch(e3){
					xmlHttp = false;
				}
			}
		}
	}
	return xmlHttp;
}


/******* Remove the starting and leading White Spaces *******/
function trim(inputString) {
	if(typeof inputString != "string"){
		return inputString; 
	}
	inputString = inputString.replace(/^[\s\xA0]+/,''); 
	inputString = inputString.replace(/[\s\xA0]+$/,'');
	return inputString; 
}

/*************** Removing special characters like -,spaces **************/
function trimSpecialCharacters(inputString) {
	if(typeof inputString != "string"){
		return inputString; 
	}
	var index = inputString.indexOf("dist");
	if(index!=-1)
		inputString = inputString.substring(0,index-1);
	inputString = inputString.replace(/[\s\xA0]+/g,''); 
	inputString = inputString.replace(/[-]/g,'');
	inputString = inputString.replace(/\'/g,'');
	return inputString; 
}

function trimDistribution(inputString){
	if(typeof inputString != "string"){
		return inputString; 
	}
	var index = inputString.indexOf("dist");
	if(index!=-1)
		inputString = inputString.substring(0,index-1);
	return inputString;
}


/*************** Fetch group information for node **************/
function getGroup(type){
	return (group[type] != undefined)?group[type]:1;
}

/*************** Get relation strength for edges **************/
function getRelationStrength(type){
	type = type.toLowerCase();
	return (relationStrength[type] != undefined)?relationStrength[type]:1;
}

/*************** Truncate distribution name to save for further use **************/
function getDistributionName(nodeName){
	nodeName = nodeName.toLowerCase();
	nodeName = trimSpecialCharacters(nodeName);
	return nodeName;
}

/*************** Apply Math Jax **************/
function renderMath(){
	MathJax.Hub.Typeset();
}


/*************** Get node index for the distribution name **************/
function getNodeIndex(nodeName){
	return (distributomeNodes[nodeName] != undefined)?distributomeNodes[nodeName]:0;
}

/*************** Get the reference of the nodes wrt browser **************/
function getObjectReferenceNumber(object){
	var browser = navigator.appName;
	if(browser == "Microsoft Internet Explorer"){
		if(object == 'node') return 0;
		else if(object == 'relation') return 1;
		else return 2;
	}else{
		if(object == 'node') return 1;
		else if(object == 'relation') return 3;
		else return 5;
	}
}

/*************** Parse XML to fetch information per node in the XML **************/
function XMLParser(i, nodeNameIndex, index, reference, XML_Objects){
	var html = new Array();
	var referenceName = null;
	if (XML_Objects[i].nodeType==1) {
		
		var Level1Prop=xmlDoc.getElementsByTagName(XML_Objects[i].nodeName)[0].childNodes;
		var currLevel1Prop=xmlDoc.getElementsByTagName(XML_Objects[i].nodeName)[0].firstChild;

		var Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[nodeNameIndex].nodeName)[index].childNodes;
		var currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[nodeNameIndex].nodeName)[index].firstChild;
		
		var k_corr=0;
		var nameText = ''; var nameFlag = true; var typeFlag = false; var typeText = '';
		for (k=0;k<Level2Prop.length;k++) {
			try {
				if (currLevel2Prop.nodeType==1) {
					//Process only level=3 element nodes (type 1)
					if(reference){
						if(currLevel2Prop.nodeName == "cite"){
							referenceName = trim(currLevel2Prop.childNodes[0].nodeValue);
						}
					}
					if(currLevel2Prop.nodeName == 'name' && nameFlag){
						if(nameText == ''){
							nameText = '<b>'+trim(currLevel2Prop.nodeName)+"</b>: "+
							trim(currLevel2Prop.childNodes[0].nodeValue);
						}else{
							nameText = nameText+ ', '+trim(currLevel2Prop.childNodes[0].nodeValue);
						}
					}else if(currLevel2Prop.nodeName == 'type'){
						if(typeText == ''){
							typeText = '<b>'+trim(currLevel2Prop.nodeName)+"</b>: "+
							trim(currLevel2Prop.childNodes[0].nodeValue);
						}else{
							typeText = typeText+ ', '+trim(currLevel2Prop.childNodes[0].nodeValue);
						}
						typeFlag = true;
					}else{
						if(nameFlag){
							html.push('<div style="padding-left:3px">'+nameText+'</div>');
							html.push("<div style='height:5px'></div>");
						}
						nameFlag = false;
						if(typeFlag){
							html.push('<div style="padding-left:3px">'+typeText+'</div>');
							html.push("<div style='height:5px'></div>");
						}
						typeFlag = false;
						html.push('<div style="padding-left:3px"><b>'+trim(currLevel2Prop.nodeName)+"</b>: "+
							trim(currLevel2Prop.childNodes[0].nodeValue)+'</div>');
						html.push("<div style='height:5px'></div>");
					}
				} else k_corr++;
				currLevel2Prop=currLevel2Prop.nextSibling;
			} catch (err) {
				html.push("Empty tag" + currLevel2Prop.nodeValue + "<br />");
			}
		}
		if(typeFlag){	//handling the border case when type occurs last
			html.push('<div style="padding-left:3px">'+typeText+'</div>');
			html.push("<div style='height:5px'></div>");
		}
	}
	return new Array(html.join(''), referenceName);
}


/*************** Function to traverse the XML during initialization and search **************/
function traverseXML(searchFlag, text, XML_Objects, nodes, edges, references, nodesArray, referenceArray){
	var currentNodeIndex=0;
	var currentEdgeIndex=0;
	var currentReferencesIndex=0;

	/*** For each of the 3 main Distirbutome.xml classes of objects (1=distirbutions, 3=relations, 5-references ***/
	for (i=0;i<XML_Objects.length;i++) {
		var j_corr=0;
		if (XML_Objects[i].nodeType==1) {
			//Process only level=1 element nodes (type 1) 
			Level1Prop=xmlDoc.getElementsByTagName(XML_Objects[i].nodeName)[0].childNodes;
			currLevel1Prop=xmlDoc.getElementsByTagName(XML_Objects[i].nodeName)[0].firstChild;
			if (Level1Prop[i] && Level1Prop[i].nodeName == 'distribution') {	// for "distributions" objects
				/**  nodes:[
						{nodeName:"1:_:Standard Normal", group:0},
				 ]
				 ***/
				
				for (j=0;j<Level1Prop.length;j++) {
					var k_corr=0;					
					if (currLevel1Prop.nodeType==1) {
						if(!searchFlag) nodes[currentNodeIndex] = new Object();
						
						Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].childNodes;
						currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].firstChild;
						var nameFlag = false;
						for (k=0;k<Level2Prop.length;k++) {
							try {
								if (currLevel2Prop.nodeType==1) {
									var value = trim(currLevel2Prop.childNodes[0].nodeValue);
									if(searchFlag){
										var regex = new RegExp(trimSpecialCharacters(text),"i");
										if(trimSpecialCharacters(value).search(regex)!=-1) nodes[currentNodeIndex].selected = true; 
									}else{
										//Process only level=3 element nodes (type 1)
										if (currLevel2Prop.nodeName == "name" && !nameFlag) {
											nameFlag = true;
											nodes[currentNodeIndex].nodeName = trimDistribution(value);
											nodesArray[getDistributionName(value)] = currentNodeIndex;
										} else if(currLevel2Prop.nodeName == "name" && nameFlag){
											nodesArray[getDistributionName(value)] = currentNodeIndex;
										}else if (currLevel2Prop.nodeName == "type") {
											nodes[currentNodeIndex].group = getGroup(value.toLowerCase());
										}
									}
								} else k_corr++;
								currLevel2Prop=currLevel2Prop.nextSibling;
							} catch (err) {
							}
						}
						if(!searchFlag)	nodes[currentNodeIndex].selected = false;
						currentNodeIndex++;
					} else j_corr++;
					currLevel1Prop=currLevel1Prop.nextSibling;
				}
				// End for "distributions" objects
			
			} else if (Level1Prop[i] && Level1Prop[i].nodeName == 'relation') { // for "relations", edges
				/*** links:[
							{source:1, target:0, value:2},
					 ]
				***/	
				for (j=0;j<Level1Prop.length;j++) {
					var k_corr=0;	
					
					if (currLevel1Prop.nodeType==1) {
						if(!searchFlag) edges[currentEdgeIndex] = new Object();
						
						Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].childNodes;
						currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].firstChild;
						
						for (k=0;k<Level2Prop.length;k++) {
							try {
								if (currLevel2Prop.nodeType==1) {
									var value = trim(currLevel2Prop.childNodes[0].nodeValue);
									//Process only level=3 element nodes (type 1)
									if(searchFlag){
										var regex = new RegExp(trimSpecialCharacters(text),"i");
										if(trimSpecialCharacters(value).search(regex)!=-1) edges[currentEdgeIndex].selected = true; 
									}else{
										if (currLevel2Prop.nodeName == "from") {
											edges[currentEdgeIndex].source = getNodeIndex(getDistributionName(value));
										} else if (currLevel2Prop.nodeName == "to") {
											edges[currentEdgeIndex].target = getNodeIndex(getDistributionName(value));
										} else if (currLevel2Prop.nodeName == "type") {
											edges[currentEdgeIndex].value = getRelationStrength(value.toLowerCase());
										}
										edges[currentEdgeIndex].index = currentEdgeIndex;
									}
								} else k_corr++;
								currLevel2Prop=currLevel2Prop.nextSibling;
							} catch (err) {
							}
						}
						if(!searchFlag)	edges[currentEdgeIndex].selected = false;
						currentEdgeIndex++;
					} else j_corr++;
				currLevel1Prop=currLevel1Prop.nextSibling;
				}
				// end for relations
			
			} else 	if (Level1Prop[i] && Level1Prop[i].nodeName == 'reference' & !searchFlag)	{ // for references, citations
				for (j=0;j<Level1Prop.length;j++) {
					var k_corr=0;					
					if (currLevel1Prop.nodeType==1) {
						references[currentReferencesIndex] = new Object();
						
						Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].childNodes;
						nodeParent = xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr];
						currLevel2Prop=nodeParent.firstChild;
						referenceArray[trim(nodeParent.attributes.getNamedItem("id").value)] = currentReferencesIndex;
						for (k=0;k<Level2Prop.length;k++) {
							try {
								if (currLevel2Prop.nodeType==1) {
									
									//Process only level=3 element nodes (type 1)
									if (currLevel2Prop.nodeName == "author") {
										references[currentReferencesIndex].author = currLevel2Prop.childNodes[0].nodeValue;
									} else if (currLevel2Prop.nodeName == "title") {
										references[currentReferencesIndex].title = currLevel2Prop.childNodes[0].nodeValue;
									} else if (currLevel2Prop.nodeName == "year") {
										references[currentReferencesIndex].year = currLevel2Prop.childNodes[0].nodeValue;
									}
								} else k_corr++;
								currLevel2Prop=currLevel2Prop.nextSibling;
							} catch (err) {
							}
						}
						currentReferencesIndex++;
					} else j_corr++;
					currLevel1Prop=currLevel1Prop.nextSibling;
				}					
			}
		}	//end of nodeType = 1
		
	}	// End of for (i=0;i<XML_Objects.length;i++)

}
