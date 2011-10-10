var distributome = new Object ();

distributome.nodes = new Array ();
distributome.edges = new Array ();
distributome.references = new Array ();
var distributomeNodes = new Array();
var referenceNodes = new Array();
var DistributomeXML_Objects;
var selectedNode = null;
var selectedEdge = null;	
var xmlDoc;	

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

/*************** Reset variables **************/
function resetVariables(){
	selectedNode = null;
	selectedEdge = null;
	//Default href for calculator
	document.getElementById('distributome.calculator').href = './calc/NormalCalculator.html';
}

/*************** Reset search text **************/
function resetText(){
	document.getElementById('distributome.text').value = '';
}

/*************** Reset view **************/
function resetView(){
	resetVariables();
	resetText();
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

function renderMath(){
	MathJax.Hub.Typeset();
}

/*************** Fetch node properties **************/
function getNodeProperties(index, nodeName){
	if(selectedNode!=null){
		distributome.nodes[selectedNode].selected = false;
	}
	selectedNode = index;
	distributome.nodes[index].selected = true;
	var html = new Array();
	html.push("<b><u>Distribution Properties</u></b> <br />");
	var parserOutput = XMLParser(getObjectReferenceNumber('node'), 1, index, true);
	html.push(parserOutput[0]);
	var referenceName= parserOutput[1];
	document.getElementById('distributome.propertiesPannel').innerHTML = html.join('');	
	if(referenceName !=null)
		getReferences(referenceNodes[referenceName]);
	renderMath();
	nodeName = trimSpecialCharacters(nodeName);
	var firstChar = nodeName.substring(0,1).toUpperCase();
	nodeName = nodeName.substring(1); //Is it camel case or only first letter Upper Case?
	document.getElementById('distributome.calculator').href = './calc/'+firstChar+nodeName+'Calculator.html';
}

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
		for (k=0;k<Level2Prop.length;k++) {
			try {
				if (currLevel2Prop.nodeType==1) {
					//Process only level=3 element nodes (type 1)
					if(reference){
						if(currLevel2Prop.nodeName == "cite"){
							referenceName = trim(currLevel2Prop.childNodes[0].nodeValue);
						}
					}
					html.push(trim(currLevel2Prop.nodeName)+": "+
							trim(currLevel2Prop.childNodes[0].nodeValue));
					html.push("<br />");
				} else k_corr++;
				currLevel2Prop=currLevel2Prop.nextSibling;
			} catch (err) {
				html.push("Empty tag" + currLevel2Prop.nodeValue + "<br />");
			}
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

function neighborsFetch(){
	var type = getDropDownSelectedValue('distributome.neighborAction');
	
}

/////TODO finish the parent child dropdown
function parentChildSearch(type){
	var i= getObjectReferenceNumber("relation");
	var indexType = 7;
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

/*************** Function invoked on enter of the input box for search **************/
function textSearch(){
	resetVariables();
	resetNodesEdges();
	var searchString = document.getElementById('distributome.text').value;
	traverseXML(true, searchString);
}

/*************** Fetch References from the XML **************/
function getReferences(index){
	var html = new Array();
	html.push("<b><u>Distribution Referencies</u></b> <br />");
	html.push(XMLParser(getObjectReferenceNumber('reference'), 9, index, false)[0]);
	document.getElementById('distributome.referencePanel').innerHTML = html.join('');
}

/*************** Fetch relation information of an edge **************/
function getRelationProperties(nodeName, linkIndex){
	if(selectedEdge != null){
		distributome.edges[selectedEdge].selected = true;
	}
	selectedEdge = linkIndex;
	distributome.edges[linkIndex].selected = true;
	var html = new Array();;
	html.push("<b><u>Inter-Distribution Relations</u></b> <br />");
	var parserOutput = XMLParser(getObjectReferenceNumber('relation'), 7, linkIndex, true);
	html.push(parserOutput[0]);
	var referenceName = parserOutput[1];
	document.getElementById('distributome.relationPannel').innerHTML = html.join('');
	if(referenceName!=null)
		getReferences(referenceNodes[referenceName]);
	renderMath();
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
	return inputString; 
}

/*************** Node Action **************/
function nodeTypeInfoFetch(){
	var type = getDropDownSelectedValue('distributome.nodeTypeAction');
	search("node", 1, type);
}

function getDropDownSelectedValue(id){
	var dropDown = document.getElementById(id);
	return dropDown.options[dropDown.selectedIndex].value;	
}

/*************** Edge Action **************/
function edgeTypeInfoFetch(){
	var type = getDropDownSelectedValue('distributome.edgeTypeAction');
	search("relation", 7, type);
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
										if(value.indexOf(text)!=-1) distributome.nodes[currentNodeIndex].selected = true; 
									}else{
										//Process only level=3 element nodes (type 1)
										if (currLevel2Prop.nodeName == "name" && !nameFlag) {
											nameFlag = true;
											distributome.nodes[currentNodeIndex].nodeName = value;
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
										if(value.indexOf(text)!=-1) distributome.edges[currentEdgeIndex].selected = true; 
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
