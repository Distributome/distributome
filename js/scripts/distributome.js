var distributome = new Object ();

distributome.nodes = new Array ();
distributome.edges = new Array ();
distributome.references = new Array ();
var distributomeNodes = new Array();
var referenceNodes = new Array();
var DistributomeXML_Objects;
var xmlDoc;	
var force = null;
var maxLinkDegree = 1;
var presetNodes = null;

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


function getColor(d){
	maxLinkDegree = (maxLinkDegree>d.linkDegree)?maxLinkDegree:d.linkDegree;
	if(d.selected == 'yellow'){
		return "yellow";
	}else if(d.selected == 'green'){
		return "green";
	}else if(d.selected){
		return "red";
	}
	else return colors(d.group);
}

/*************** Reset Distributome Page **************/
function resetPage(){
	resetNavigator();
	resetDropDown();
}
	
/*************** Reset variables **************/
function resetVariables(){
	resetNodesEdges();
	presetNodes = null;
	//Default href for calculator
	document.getElementById('distributome.calculator').href = './calc/NormalCalculator.html';
}

/*************** Reset search text **************/
function resetText(){
	document.getElementById('distributome.text').value = '';
	document.getElementById('distributome.referencePanel').innerHTML = '<b><u>Distribution Referencies</u></b>';
	document.getElementById('distributome.propertiesPannel').innerHTML = '<b><u>Distribution Properties</u></b>';	
	document.getElementById('distributome.relationPannel').innerHTML = '<b><u>Distribution Relations</u></b>';
}

function resetDropDown(){
	resetDropDownSelectedValue('distributome.edgeTypeAction');
	resetDropDownSelectedValue('distributome.nodeTypeAction');
	resetDropDownSelectedValue('distributome.neighborAction');
}

/*************** Reset view **************/
function resetView(){
	resetVariables();
	resetText();
}

/*************** Reset the drop down **************/
function resetDropDownSelectedValue(dropDownID){
	var dropDown =document.getElementById(dropDownID);
	dropDown.options[0].selected = true;
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

/*************** Get node index for the distribution name **************/
function getNodeIndex(nodeName){
	return (distributomeNodes[nodeName] != undefined)?distributomeNodes[nodeName]:0;
}

/*************** Apply Math Jax **************/
function renderMath(){
	MathJax.Hub.Typeset();
}

function getLinkColor(d,l){
	//return l.selected?'red':'rgb(170,170,170)';
	if(l.selected == 'yellow'){
		return "yellow";
	}else if(l.selected == 'green'){
		return "green";
	}else if(l.selected){
		return "red";
	}
	else return 'rgb(170,170,170)';
}

/*************** Fetch node properties **************/
function getNodeProperties(index, nodeName){
	if(!_shiftKey){
		resetNodes();
		presetNodes = null;
	}
	distributome.nodes[index].selected = true;
	var html = new Array();
	html.push("<b><u>Distribution Properties</u></b> <div style='height:7px'></div>");
	var parserOutput = XMLParser(getObjectReferenceNumber('node'), 1, index, true);
	html.push(parserOutput[0]);
	var referenceName= parserOutput[1];
	document.getElementById('distributome.propertiesPannel').innerHTML = html.join('');	
	if(referenceName !=null)
		getReferences(referenceNodes[referenceName]);
	else getReferences(false);
	renderMath();
	nodeName = trimSpecialCharacters(nodeName);
	var firstChar = nodeName.substring(0,1).toUpperCase();
	nodeName = nodeName.substring(1); //Is it camel case or only first letter Upper Case?
	document.getElementById('distributome.calculator').href = './calc/'+firstChar+nodeName+'Calculator.html';
	vis.render();
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
function XMLParser(i, nodeNameIndex, index, reference){
	var html = new Array();
	var referenceName = null;
	if (DistributomeXML_Objects[i].nodeType==1) {
		
		var Level1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].childNodes;
		var currLevel1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].firstChild;

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

/*************** Function invoked on node and edges action **************/
function search(searchType, indexType, type){
	var i= getObjectReferenceNumber(searchType);
	if (DistributomeXML_Objects[i].nodeType==1) {
		var Level1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].childNodes;
		var currLevel1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].firstChild;
		var currentNodeIndex = 0;
		for (j=0, node_cnt=0;j<Level1Prop.length;j++) {
			var k_corr=0;					
			var nodes = xmlDoc.getElementsByTagName(Level1Prop[i].nodeName);
			if (currLevel1Prop.nodeType==1) {
				if(node_cnt<nodes.length) {
					Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].childNodes;
					currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].firstChild;
					for (k=0;k<Level2Prop.length;k++) {
						try {
							if (currLevel2Prop.nodeType==1) {
								var value = trim(currLevel2Prop.childNodes[0].nodeValue);
								if (currLevel2Prop.nodeName == "type" && value == type) {
									if(searchType == "node") distributome.nodes[currentNodeIndex].selected = true;
									if(searchType == "relation") distributome.edges[currentNodeIndex].selected = true; 
								}else if (currLevel2Prop.nodeName == "type" && value != type) {
									if(searchType == "node") distributome.nodes[currentNodeIndex].selected = false;
									if(searchType == "relation") distributome.edges[currentNodeIndex].selected = false;
								}
							} else k_corr++;
							currLevel2Prop=currLevel2Prop.nextSibling;
						} catch (err) {
						}
					}
					currentNodeIndex++;
					node_cnt++;
				}
			}else currLevel1Prop=currLevel1Prop.nextSibling;
		}
	}
}

/*************** Function to fetch the parents/children of the selected nodes **************/
function neighborsFetch(){
	var type = getDropDownSelectedValue('distributome.neighborAction');
	if(type == 'neighbors') return;
	var selectedNodes = getSelectedNodes();
	if(presetNodes == null || presetNodes.length == 0) presetNodes = selectedNodes;
	/*** alert(presetNodes.length);
	for(var i=0;i<presetNodes.length;i++){
		alert(presetNodes[i]);
	} ****/
	
	parentChildSearch(type, presetNodes);
	vis.render();
}


function connectedNodesFetch(){
	var type = getDropDownSelectedValue('distributome.connectedNodesAction');
	if(type == 'connectivity') resetNavigator();
	if(type == 'mostConnected') highlightConnectedNodes(1);
	else if(type == 'connected') highlightConnectedNodes(2);
	else if(type == 'sparselyConnected') highlightConnectedNodes(3);
	vis.render();
}


/*************** Function to search the parents/children of the selected nodes in the relations **************/
function parentChildSearch(type, selectedNodes){
	var i= getObjectReferenceNumber("relation");
	var indexType = 7;
	if (DistributomeXML_Objects[i].nodeType==1) {
		var Level1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].childNodes;
		var currLevel1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].firstChild;
		for (j=0, node_cnt=0;j<Level1Prop.length;j++) {
			var k_corr=0;					
			var nodes = xmlDoc.getElementsByTagName(Level1Prop[i].nodeName);
			if (currLevel1Prop.nodeType==1) {
				if(node_cnt<nodes.length) {
					Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].childNodes;
					currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].getElementsByTagName('from')[0]; //get from here
					currLevel2Prop1=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].getElementsByTagName('to')[0]; //get to node here
					try {
						if (currLevel2Prop.nodeType==1) {
							var fromValue = getDistributionName(currLevel2Prop.childNodes[0].nodeValue);
							var toValue = getDistributionName(currLevel2Prop1.childNodes[0].nodeValue);
							for(var values=0;values<selectedNodes.length;values++){
								if(fromValue == selectedNodes[values]){
									if(type.indexOf('children')!=-1){
										distributome.nodes[getNodeIndex(toValue)].selected = 'yellow'; //child 
										//Take care of multiple from and to
										distributome.edges[node_cnt].selected = 'yellow';
									}
								}
								if(toValue == selectedNodes[values]){
									if(type.indexOf('parent')!=-1){
										distributome.nodes[getNodeIndex(fromValue)].selected = 'green'; //parent
										distributome.edges[node_cnt].selected = 'green';
									}
								}
							}
						} 
					} catch (err) {
					}
					node_cnt++;
				}
			}else currLevel1Prop=currLevel1Prop.nextSibling;
		}
	}
}

/*************** Function invoked on enter of the input box for search **************/
function textSearch(){
	resetVariables();
	resetNodesEdges();
	var searchString = document.getElementById('distributome.text').value;
	traverseXML(true, searchString);
	vis.render();
}

/*************** Function invoked on enter of the input box for search **************/
function displayXmlText(displayAll){
	if(!displayAll){
		var searchString = document.getElementById('distributome.xmltext').value;
		traverseXML(true, searchString);
	}
	var parserOutput;
	var referenceName;
	var reference = false;
	var nodehtml = new Array();
	var referencehtml = new Array();
	var relationhtml = new Array();
	nodehtml.push("<b><u>Distribution Properties</u></b> <div style='height:7px'></div>");
	relationhtml.push("<b><u>Inter-Distribution Relations</u></b> <div style='height:7px'></div>");
	referencehtml.push("<b><u>Distribution Referencies</u></b> <div style='height:7px'></div>");
	var display = true;
	for(var i=0; i< distributome.nodes.length; i++){
		if(!displayAll){
			if(distributome.nodes[i].selected){
				display = true;
			}else display = false;
		}
		if(display){
			nodehtml.push("<b>distribution:</b> <div style='padding-left:7px'>");
			parserOutput = XMLParser(getObjectReferenceNumber('node'), 1, i, true);
			nodehtml.push(parserOutput[0]);
			referenceName= parserOutput[1];
			if(referenceName !=null){
				if(!reference) reference = true;
				referencehtml.push("<b>reference:</b> <div style='padding-left:7px'>");
				referencehtml.push(XMLParser(getObjectReferenceNumber('reference'), 9, i, false)[0]);
				referencehtml.push("</div>");
			}
			nodehtml.push("</div>");
		}
	}
	display = true;
	for(var i=0; i<distributome.edges.length; i++){
		if(!displayAll){
			if(distributome.edges[i].selected){
				display = true;
			}else display = false;
		}
		if(display){
			relationhtml.push("<b>relation:</b> <div style='padding-left:7px'>");
			parserOutput = XMLParser(getObjectReferenceNumber('relation'), 7, i, true);
			relationhtml.push(parserOutput[0]);
			referenceName= parserOutput[1];
			if(referenceName !=null){
				if(!reference) reference = true;
				referencehtml.push("<b>reference:</b> <div style='padding-left:7px'>");
				referencehtml.push(XMLParser(getObjectReferenceNumber('reference'), 9, i, false)[0]);
				referencehtml.push("</div>");
			}
			relationhtml.push("</div>");
		}
	}
	
	document.getElementById('distributome.xmlParse').innerHTML = nodehtml.join('')+"<div style='height:15px'></div>"+relationhtml.join('');
	if(reference)
		document.getElementById('distributome.xmlParse').innerHTML += "<div style='height:15px'></div>"+referencehtml.join('');	
	renderMath();
}

/*************** Fetch References from the XML **************/
function getReferences(index){
	var html = new Array();
	html.push("<b><u>Distribution Referencies</u></b> <div style='height:7px'></div>");
	if(index){
		html.push(XMLParser(getObjectReferenceNumber('reference'), 9, index, false)[0]);
	}
	document.getElementById('distributome.referencePanel').innerHTML = html.join('');
}

/*************** Fetch relation information of an edge **************/
function getRelationProperties(nodeName, linkIndex){
	if(!_shiftKey){
		resetEdges();
	}
	distributome.edges[linkIndex].selected = true;
	var html = new Array();;
	html.push("<b><u>Inter-Distribution Relations</u></b> <div style='height:7px'></div>");
	var parserOutput = XMLParser(getObjectReferenceNumber('relation'), 7, linkIndex, true);
	html.push(parserOutput[0]);
	var referenceName = parserOutput[1];
	document.getElementById('distributome.relationPannel').innerHTML = html.join('');
	if(referenceName!=null)
		getReferences(referenceNodes[referenceName]);
	else getReferences(false);
	renderMath();
	vis.render();
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

/*************** Node Action **************/
function nodeTypeInfoFetch(){
	var type = getDropDownSelectedValue('distributome.nodeTypeAction');
	if(type == 'distributionType') return;
	resetNavigator();
	search("node", 1, type);
	vis.render();
}

/*************** Get the drop down selected value **************/
function getDropDownSelectedValue(id){
	var dropDown = document.getElementById(id);
	return dropDown.options[dropDown.selectedIndex].value;	
}

/*************** Edge Action **************/
function edgeTypeInfoFetch(){
	var type = getDropDownSelectedValue('distributome.edgeTypeAction');
	if(type == 'relationType') return;
	resetNavigator();
	search("relation", 7, type);
	vis.render();
}

/*************** Function to traverse the XML during initialization and search **************/
function traverseXML(searchFlag, text){
	var currentNodeIndex=0;
	var currentEdgeIndex=0;
	var currentReferencesIndex=0;

	/*** For each of the 3 main Distirbutome.xml classes of objects (1=distirbutions, 3=relations, 5-references ***/
	for (i=0;i<DistributomeXML_Objects.length;i++) {
		var j_corr=0;
		if (DistributomeXML_Objects[i].nodeType==1) {
			//Process only level=1 element nodes (type 1) 
			Level1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].childNodes;
			currLevel1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].firstChild;
			if (Level1Prop[i] && Level1Prop[i].nodeName == 'distribution') {	// for "distributions" objects
				/**  nodes:[
						{nodeName:"1:_:Standard Normal", group:0},
				 ]
				 ***/
				
				for (j=0;j<Level1Prop.length;j++) {
					var k_corr=0;					
					if (currLevel1Prop.nodeType==1) {
						if(!searchFlag) distributome.nodes[currentNodeIndex] = new Object();
						
						Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].childNodes;
						currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].firstChild;
						var nameFlag = false;
						for (k=0;k<Level2Prop.length;k++) {
							try {
								if (currLevel2Prop.nodeType==1) {
									var value = trim(currLevel2Prop.childNodes[0].nodeValue);
									if(searchFlag){
										var regex = new RegExp(trimSpecialCharacters(text),"i");
										if(trimSpecialCharacters(value).search(regex)!=-1) distributome.nodes[currentNodeIndex].selected = true; 
									}else{
										//Process only level=3 element nodes (type 1)
										if (currLevel2Prop.nodeName == "name" && !nameFlag) {
											nameFlag = true;
											distributome.nodes[currentNodeIndex].nodeName = trimDistribution(value);
											distributomeNodes[getDistributionName(value)] = currentNodeIndex;
										} else if(currLevel2Prop.nodeName == "name" && nameFlag){
											distributomeNodes[getDistributionName(value)] = currentNodeIndex;
										}else if (currLevel2Prop.nodeName == "type") {
											distributome.nodes[currentNodeIndex].group = getGroup(value.toLowerCase());
										}
									}
								} else k_corr++;
								currLevel2Prop=currLevel2Prop.nextSibling;
							} catch (err) {
							}
						}
						if(!searchFlag)	distributome.nodes[currentNodeIndex].selected = false;
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
						if(!searchFlag) distributome.edges[currentEdgeIndex] = new Object();
						
						Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].childNodes;
						currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].firstChild;
						
						for (k=0;k<Level2Prop.length;k++) {
							try {
								if (currLevel2Prop.nodeType==1) {
									var value = trim(currLevel2Prop.childNodes[0].nodeValue);
									//Process only level=3 element nodes (type 1)
									if(searchFlag){
										var regex = new RegExp(trimSpecialCharacters(text),"i");
										if(trimSpecialCharacters(value).search(regex)!=-1) distributome.edges[currentEdgeIndex].selected = true; 
									}else{
										if (currLevel2Prop.nodeName == "from") {
											distributome.edges[currentEdgeIndex].source = getNodeIndex(getDistributionName(value));
										} else if (currLevel2Prop.nodeName == "to") {
											distributome.edges[currentEdgeIndex].target = getNodeIndex(getDistributionName(value));
										} else if (currLevel2Prop.nodeName == "type") {
											distributome.edges[currentEdgeIndex].value = getRelationStrength(value.toLowerCase());
										}
										distributome.edges[currentEdgeIndex].index = currentEdgeIndex;
									}
								} else k_corr++;
								currLevel2Prop=currLevel2Prop.nextSibling;
							} catch (err) {
							}
						}
						if(!searchFlag)	distributome.edges[currentEdgeIndex].selected = false;
						currentEdgeIndex++;
					} else j_corr++;
				currLevel1Prop=currLevel1Prop.nextSibling;
				}
				// end for relations
			
			} else 	if (Level1Prop[i] && Level1Prop[i].nodeName == 'reference' & !searchFlag)	{ // for references, citations
				for (j=0;j<Level1Prop.length;j++) {
					var k_corr=0;					
					if (currLevel1Prop.nodeType==1) {
						distributome.references[currentReferencesIndex] = new Object();
						
						Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr].childNodes;
						nodeParent = xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j-j_corr];
						currLevel2Prop=nodeParent.firstChild;
						referenceNodes[trim(nodeParent.attributes.getNamedItem("id").value)] = currentReferencesIndex;
						for (k=0;k<Level2Prop.length;k++) {
							try {
								if (currLevel2Prop.nodeType==1) {
									
									//Process only level=3 element nodes (type 1)
									if (currLevel2Prop.nodeName == "author") {
										distributome.references[currentReferencesIndex].author = currLevel2Prop.childNodes[0].nodeValue;
									} else if (currLevel2Prop.nodeName == "title") {
										distributome.references[currentReferencesIndex].title = currLevel2Prop.childNodes[0].nodeValue;
									} else if (currLevel2Prop.nodeName == "year") {
										distributome.references[currentReferencesIndex].year = currLevel2Prop.childNodes[0].nodeValue;
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
		
	}	// End of for (i=0;i<DistributomeXML_Objects.length;i++)

}


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
	
{		
		
		/*** Read in and parse the Distributome.xml DB ***/
		var xmlhttp=createAjaxRequest();
		xmlhttp.open("GET","Distributome.xml",false);
		xmlhttp.send();
		if (!xmlhttp.responseXML.documentElement && xmlhttp.responseStream)
			xmlhttp.responseXML.load(xmlhttp.responseStream);
		xmlDoc = xmlhttp.responseXML;
		try{
			DistributomeXML_Objects=xmlDoc.documentElement.childNodes;
		}catch(error){
			DistributomeXML_Objects=xmlDoc.childNodes;
		}
		traverseXML(false);
}