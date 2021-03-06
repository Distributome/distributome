var distributome = new Object ();

distributome.nodes = new Array ();
distributome.edges = new Array ();
distributome.cite = new Array ();

var distributomeNodes = new Array();
var citeNodes = new Array();
var citeLinkNodes = new Array();
var referenceNodes = new Array();
var DistributomeXML_Objects;
var xmlDoc;	
var force = null;
var presetNodes = null;
var topHierarchyArray = new Array();
var middleHierarchyArray = new Array();
var connectivity = false;
var _shiftKey = false;
var total_links = 0;

function getColor(d){
	if(d.selected == 'yellow'){
		return "yellow";
	}else if(d.selected == 'green'){
		return "green";
	}else if(d.selected == 'red'){
		return "red";
	}
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if(d.selected == "top_hierarchy") {
				//alert(d.nodeName);
				return colors(d.group);
			}
			else return "hsla(0, 0%, 50%, 0.5)";
		}else if(connectivity == "middle_hierarchy"){
			if(d.selected == "top_hierarchy" || d.selected == "middle_hierarchy") return colors(d.group);
			else return "hsla(0, 0%, 50%, 0.5)";
		}
	}
	
	else return colors(d.group);
}

function getStrokeColor(d){
	if(d.selected == 'yellow'){
		return d3.rgb(getColor(d)).darker();
	}else if(d.selected == 'green'){
		return d3.rgb(getColor(d)).darker();
	}else if(d.selected == 'red'){
		return d3.rgb(getColor(d)).darker();
	}
	
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if(d.selected == "top_hierarchy") {
				//alert(d.nodeName);
				return d3.rgb(getColor(d)).darker();
			}
			else return "#cccccc";
		}else if(connectivity == "middle_hierarchy"){
			if(d.selected == "top_hierarchy" || d.selected == "middle_hierarchy") return d3.rgb(getColor(d)).darker();
			else return "#cccccc";
		}
	}
	
	else return d3.rgb(getColor(d)).darker();
	//if(connectivity) return "#cccccc";
	//else 
	//var col = d3.rgb(getColor(d)).darker();
	//alert(col);
	//return col;
}

function getText(d){
	//alert(connectivity);
	if(connectivity!= undefined && connectivity){
		if(d.selected == "red" || d.selected == "yellow" || d.selected == "green") return d.nodeName;
		if(connectivity == "top_hierarchy"){
			if(d.selected == "top_hierarchy") return d.nodeName;
			else return '';
		}else if(connectivity == "middle_hierarchy"){
			if(d.selected == "top_hierarchy" || d.selected == "middle_hierarchy") return d.nodeName;
			else return '';
		}
	}
	return d.nodeName;
}

function getArrowColor(d,l){
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if(distributome.nodes[l.source].selected == "top_hierarchy" && distributome.nodes[l.target].selected == "top_hierarchy") return '#C0C0C0';
			else return "hsla(0, 0%, 50%, 0.5)";
		}else if(connectivity == "middle_hierarchy"){
			if(distributome.nodes[l.source].selected && distributome.nodes[l.target].selected) return '#C0C0C0';
			else return "hsla(0, 0%, 50%, 0.5)";
		}
	}
	return "#C0C0C0";
}

function getArrowSize(d,l){
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if(distributome.nodes[l.source].selected == "top_hierarchy" && distributome.nodes[l.target].selected == "top_hierarchy") return 3;
			else return 0.5;
		}else if(connectivity == "middle_hierarchy"){
			if(distributome.nodes[l.source].selected && distributome.nodes[l.target].selected) return 3;
			else return 0.5;
		}
	}
	return 3;
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
	connectivity = false;
	
	//Default href for calculator, experiment, simulation
	document.getElementById('distributome.calculator').href = './calc/NormalCalculator.html';
	document.getElementById('distributome.experiment').href = './exp/BallUrnExperiment.html';
	document.getElementById('distributome.simulation').href = './sim/NormalSimulation.html';
}

/*************** Reset search text **************/
function resetText(){
	document.getElementById('distributome.text').value = '';
	//debugging
	document.getElementById('bibtex_display').innerHTML = '<b><u>Distribution Referencies</u></b>';
	document.getElementById('distributome.propertiesPannel').innerHTML = '<b><u>Distribution Properties</u></b>';	
	document.getElementById('distributome.relationPannel').innerHTML = '<b><u>Distribution Relations</u></b>';
}

function resetDropDown(){
	setDropDownSelectedValue('distributome.edgeTypeAction', 0);
	setDropDownSelectedValue('distributome.nodeTypeAction', 0);
	setDropDownSelectedValue('distributome.neighborAction', 0);
	setDropDownSelectedValue('distributome.connectedNodesAction', 0);
}

/*************** Reset view **************/
function resetView(){
	resetVariables();
	resetText();
}

function getLinkColor(d,l){
	if(l.selected == 'yellow'){
		return "yellow";
	}else if(l.selected == 'green'){
		return "green";
	}else if(l.selected == 'red'){
		return "red";
	}
	//alert(distributome.nodes);
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			//alert(l.source);
			if((distributome.nodes[getIndexValue(l.source)].selected && distributome.nodes[getIndexValue(l.source)].selected != "middle_hierarchy") && (distributome.nodes[getIndexValue(l.target)].selected && distributome.nodes[getIndexValue(l.target)].selected != "middle_hierarchy")){
				l.selected = 'top_hierarchy';
				return 'rgb(0,0,0)';
			}
			else return "hsla(0, 0%, 50%, 0.5)";
		}else if(connectivity == "middle_hierarchy"){
			if(distributome.nodes[getIndexValue(l.source)].selected && distributome.nodes[getIndexValue(l.target)].selected){
				l.selected = 'middle_hierarchy';
				return 'rgb(0,0,0)';
			}
			else return "hsla(0, 0%, 50%, 0.5)";
		}
	}
	else return 'rgb(0,0,0)';
}

function updateLinkColor(d,l){
	if(l.selected == 'yellow'){
		return "yellow";
	}else if(l.selected == 'green'){
		return "green";
	}else if(l.selected == 'red'){
		return "red";
	}
	//alert(distributome.nodes);
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if((distributome.nodes[l.source.index].selected && distributome.nodes[l.source.index].selected != "middle_hierarchy") && (distributome.nodes[l.target.index].selected && distributome.nodes[l.target.index].selected != "middle_hierarchy")){
				l.selected = 'top_hierarchy';
				return 'rgb(0,0,0)';
			}
			else return "hsla(0, 0%, 50%, 0.5)";
		}else if(connectivity == "middle_hierarchy"){
			if(distributome.nodes[l.source.index].selected && distributome.nodes[l.target.index].selected){
				l.selected = 'middle_hierarchy';
				return 'rgb(0,0,0)';
			}
			else return "hsla(0, 0%, 50%, 0.5)";
		}
	}
	else return 'rgb(0,0,0)';
}

function getMarkerEnd(l){
	if(l.selected == 'yellow'){
		return "url(#yellow)";
	}else if(l.selected == 'green'){
		return "url(#green)";
	}else if(l.selected == 'red'){
		return "url(#red)";
	}
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if((distributome.nodes[getIndexValue(l.source)].selected && distributome.nodes[getIndexValue(l.source)].selected != "middle_hierarchy") && (distributome.nodes[getIndexValue(l.target)].selected && distributome.nodes[getIndexValue(l.target)].selected != "middle_hierarchy")){
				l.selected = 'top_hierarchy';
				return 'url(#hierarchy)';
			}
			else return "url(#nonhierarchy)";
		}else if(connectivity == "middle_hierarchy"){
			if(distributome.nodes[getIndexValue(l.source)].selected && distributome.nodes[getIndexValue(l.target)].selected){
				l.selected = 'middle_hierarchy';
				return 'url(#hierarchy)';
			}
			else return "url(#nonhierarchy)";
		}
	}
	else return 'url(#hierarchy)';
}

function getIndexValue(obj){
	var type = typeof obj;
	if(type == "object") return obj.index;
	else return obj;
}

function updateMarkerEnd(l){
	if(l.selected == 'yellow'){
		return "url(#yellow)";
	}else if(l.selected == 'green'){
		return "url(#green)";
	}else if(l.selected == 'red'){
		return "url(#red)";
	}
	if(connectivity){
		if(connectivity == "top_hierarchy"){
			if((distributome.nodes[l.source.index].selected && distributome.nodes[l.source.index].selected != "middle_hierarchy") && (distributome.nodes[l.target.index].selected && distributome.nodes[l.target.index].selected != "middle_hierarchy")){
				l.selected = 'top_hierarchy';
				return 'url(#hierarchy)';
			}
			else return "url(#nonhierarchy)";
		}else if(connectivity == "middle_hierarchy"){
			if(distributome.nodes[l.source.index].selected && distributome.nodes[l.target.index].selected){
				l.selected = 'middle_hierarchy';
				return 'url(#hierarchy)';
			}
			else return "url(#nonhierarchy)";
		}
	}
	else return 'url(#hierarchy)';
}

/*************** Fetch relation information of an edge **************/
function getRelationProperties(link, linkIndex, display){

	//alert(link.source.nodeName +" "+ link.target.nodeName);
	if(!display){
		
		var type = getDropDownSelectedValue('distributome.connectedNodesAction');
		if(type != 'sparselyConnected'){
			alert(display+" "+type+" "+link.selected);
			if(link.selected != "top_hierarchy" && link.selected != "middle_hierarchy") return;
		}
	}
	
	if(!_shiftKey){
		resetEdges();
	}
	//alert(linkIndex);
	if(distributome.edges[linkIndex].selected == "red"){
		document.getElementById('distributome.relationPannel').innerHTML = '';
		render();
		return;
	}
	distributome.edges[linkIndex].selected = "red";
	var html = new Array();
	html.push("<b><u>Inter-Distribution Relations</u></b> <div style='height:7px'></div>");
	var parserOutput = XMLParser(getObjectReferenceNumber('relation'), 7, linkIndex, true, DistributomeXML_Objects, link.docIndex);
	html.push(parserOutput[0]);
	
	//
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//
	var referenceName = parserOutput[1];
	document.getElementById('distributome.relationPannel').innerHTML = html.join('');
	
	/* 	// For debugging: 
	 	// alert(document.getElementById('distributome.relationPannel').innerHTML);
		if(referenceName!=null) getReferences(referenceNodes[referenceName]);
		else getReferences(false);
	*/
	
	//
	// !!!!!!!!!!!!!!!!!
	//
	//alert("distributome.js::getRelationProperties::referenceName = " + referenceName);
	
	renderMath();
	render();
}

/*************** Fetch node properties **************/
function getNodeProperties(index, nodeName, d, display){
	
	//alert(d.selected);
	//alert("distributome.js::getNodeProperties::index = " + index+"\t nodeName="+nodeName);
	
	if(!display){
		
		var type = getDropDownSelectedValue('distributome.connectedNodesAction');
		if(type != 'sparselyConnected'){
			//alert(display+" "+type+" "+d.selected+" "+connectivity);
			if(d.selected != "top_hierarchy" && d.selected != "middle_hierarchy") return;
		}
	}
	if(!_shiftKey){
		resetNodes();
		presetNodes = null;
		if(connectivity) {
			//resetView();
			connectedNodesFetch();
		}
	}
	if(distributome.nodes[index].selected == "red"){
		document.getElementById('distributome.propertiesPannel').innerHTML = '';
		render();
		return;
	}
	distributome.nodes[index].selected = "red";
	var html = new Array();
	
	// FILLS DISTRIBUTOME PROPERTIES PANEL
	html.push("<b><u>Distribution Properties</u></b> <div style='height:7px'></div>");
	var parserOutput = XMLParser(getObjectReferenceNumber('node'), 1, index, true, DistributomeXML_Objects);
	html.push(parserOutput[0]);
	var referenceName= parserOutput[1];
	
	// referenceName contains the Reference ID all in lower-case!!!!!!!!!!!!!!!!!!!!
	// alert("getNodeProperties::referenceName="+referenceName);
	
	document.getElementById('distributome.propertiesPannel').innerHTML = html.join('');	
	
	//
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//
	// GETS DISTRIBUTOME REFERENCES
	//alert("distributome.js::getNodeProperties::referenceName = " + referenceName);
	
	/* 
	if(referenceName !=null){
		if (BibtexParser != null) {
			BibtexParser.setRef(referenceName);
		}
		getReferences(referenceNodes[referenceName]);
		} //
	else {
		if (BibtexParser != null) {
			BibtexParser.setRef(null);
		}
		getReferences(false);
	}
	*/
	
	renderMath();
	nodeName = trimSpecialCharacters(nodeName);
	var firstChar = nodeName.substring(0,1).toUpperCase();
	nodeName = nodeName.substring(1); //Is it camel case or only first letter Upper Case?
	
	// GENERATES LINKS FOR DISTRIBUTION ACTIONS
	//alert("...Setting the Calc, Sim and Exp ...");
	document.getElementById('distributome.calculator').href = './calc/'+firstChar+nodeName+'Calculator.html';
	document.getElementById('distributome.experiment').href = './exp/'+firstChar+nodeName+'Experiment.html';
	document.getElementById('distributome.simulation').href = './sim/'+firstChar+nodeName+'Simulation.html';
	
	render();
	//force.start();
}

/*************** Function invoked on node and edges action **************/
function search(searchType, indexType, type){
	var i= getObjectReferenceNumber(searchType);
	if (DistributomeXML_Objects[i].nodeType==1) {
		var Level1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].childNodes;
		var currLevel1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].firstChild;
		var currentNodeIndex = 0;
		for (var j=0, node_cnt=0;j<Level1Prop.length;j++) {
			var k_corr=0;					
			var nodes = xmlDoc.getElementsByTagName(Level1Prop[i].nodeName);
			if (currLevel1Prop.nodeType==1) {
				if(node_cnt<nodes.length) {
					Level2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].childNodes;
					currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].firstChild;
					for (var k=0;k<Level2Prop.length;k++) {
						try {
							if (currLevel2Prop.nodeType==1) {
								var value = trim(currLevel2Prop.childNodes[0].nodeValue);
								if (currLevel2Prop.nodeName == "type" && value == type) {
									if(searchType == "node") distributome.nodes[currentNodeIndex].selected = "red";
									if(searchType == "relation") distributome.edges[currentNodeIndex].selected = "red"; 
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
	
	resetNodesEdges();
	if(connectivity) connectedNodesFetch();
	parentChildSearch(type, presetNodes);
	//force.start();
	render();
}


function connectedNodesFetch(){
	var type = getDropDownSelectedValue('distributome.connectedNodesAction');
	if(type == 'connectivity'){
		connectivity = false;
		resetNavigator();
		return; 
	}
	if(type == 'mostConnected'){
		connectivity =  "top_hierarchy";
		updateNodeColor(topHierarchyArray, "top_hierarchy");
	}else if(type == 'connected'){
		connectivity =  "middle_hierarchy";
		updateNodeColor(middleHierarchyArray, "middle_hierarchy");
		updateNodeColor(topHierarchyArray, "top_hierarchy");
	}else if(type == 'sparselyConnected'){
		connectivity = false;
		resetNodesEdges();
	}
	render();
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
					currLevel2Prop=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].getElementsByTagName('from'); //get from here
					currLevel2Prop1=xmlDoc.getElementsByTagName(Level1Prop[indexType].nodeName)[node_cnt].getElementsByTagName('to'); //get to node here
					try {
						//if (currLevel2Prop.nodeType==1) {
							for(var values=0;values<selectedNodes.length;values++){
								var nodeIndex = distributomeNodes[selectedNodes[values]];
								distributome.nodes[getNodeIndex(distributomeNodes,selectedNodes[values])].selected = 'red'; //selected Node
								var nodeNames = distributomeNodes[nodeIndex].split(","); //done for different names for a particular node
								for(var nodeNameTraverse=0; nodeNameTraverse<nodeNames.length; nodeNameTraverse++){
									for(var fromNodes=0;fromNodes<currLevel2Prop.length;fromNodes++){
										var fromValue = getDistributionName(currLevel2Prop[fromNodes].childNodes[0].nodeValue);
										if(fromValue == nodeNames[nodeNameTraverse]){
											if(type.indexOf('children')!=-1){
												for(var toNodes=0;toNodes<currLevel2Prop1.length;toNodes++){
													var toValue = getDistributionName(currLevel2Prop1[toNodes].childNodes[0].nodeValue);
													distributome.nodes[getNodeIndex(distributomeNodes,toValue)].selected = 'yellow'; //child 
												}
												//Take care of multiple from and to
												distributome.edges[node_cnt].selected = 'yellow';
												if(distributome.edges[node_cnt].extra){
													var totalExtra = distributome.edges[node_cnt].extra.split(",");
													var startPoint = totalExtra[0];
													var endPoint = totalExtra[1];
													for(var extraNodes=startPoint;extraNodes<endPoint;extraNodes++){
														distributome.edges[extraNodes].selected = 'yellow';
													}
												}
											}
										}
									}
									for(var toNodes=0;toNodes<currLevel2Prop1.length;toNodes++){
										var toValue = getDistributionName(currLevel2Prop1[toNodes].childNodes[0].nodeValue);		
										if(toValue == nodeNames[nodeNameTraverse]){
											if(type.indexOf('parent')!=-1){
												for(var fromNodes=0;fromNodes<currLevel2Prop.length;fromNodes++){
													var fromValue = getDistributionName(currLevel2Prop[fromNodes].childNodes[0].nodeValue);
													distributome.nodes[getNodeIndex(distributomeNodes, fromValue)].selected = 'green'; //parent
												}
												distributome.edges[node_cnt].selected = 'green';
												if(distributome.edges[node_cnt].extra){
													var totalExtra = distributome.edges[node_cnt].extra.split(",");
													var startPoint = totalExtra[0];
													var endPoint = totalExtra[1];
													for(var extraNodes=startPoint;extraNodes<endPoint;extraNodes++){
														distributome.edges[extraNodes].selected = 'green';
													}
												}
											}
										}
									}
								}
							}
						//} 
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
	if(!connectivity){
		resetVariables();
		resetNodesEdges();
	}
	var searchString = document.getElementById('distributome.text').value;
	traverseXML(true, searchString, DistributomeXML_Objects, distributome.nodes, distributome.edges, distributome.references, distributomeNodes, referenceNodes, connectivity);
	render();
}

//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
/*************** Fetch References from the Bib-TeX DB **************/
function getReferences(index){
	var html = new Array();
	html.push("<b><u>Distribution References</u></b> <div style='height:7px'></div>");
	if(index){
		//html.push(XMLParser(getObjectReferenceNumber('reference'), 9, index, false, DistributomeXML_Objects)[0]);
		document.getElementById('#bibtex_display').innerHTML = 
			'<b><u>Distribution Referencies <br> TEST!!!!!!!!!!!!!!!!!!</u></b>';
	}
	//document.getElementById('distributome.referencePanel').innerHTML = html.join('');
}



/*************** Node Action **************/
function nodeTypeInfoFetch(){
	var type = getDropDownSelectedValue('distributome.nodeTypeAction');
	if(type == 'distributionType') return;
	resetNavigator();
	search("node", 1, type);
	render();
}

/*************** Edge Action **************/
function edgeTypeInfoFetch(){
	var type = getDropDownSelectedValue('distributome.edgeTypeAction');
	if(type == 'relationType') return;
	resetNavigator();
	//alert(type);
	search("relation", 7, type);
	render();
}

function getOntologyOrderArray(ontologyOrder){
	var ontology = ontologyOrder.getElementsByTagName('distributome_ontology')[0].childNodes;
	var ontologyArray; var k=0;
	for (var i=0;i<ontology.length;i++) {
		if (ontology[i].nodeType==1) {
			var Level2Prop=ontology[i].childNodes;
			var level = ontology[i].getAttribute("id");
			if(level == "top_hierarchy"){
				ontologyArray = topHierarchyArray;
				k=0;
			}else{
				ontologyArray = middleHierarchyArray;
				k=0;
			}
			for(var j=0;j<Level2Prop.length;j++){
				if (Level2Prop[j].nodeType==1) {
					var name = Level2Prop[j].childNodes[0].nodeValue;
					ontologyArray[k++] = name;
				}
			}
		}
	}
}

function updateNodeColor(ontologyArray, level){
	for(var i=0; i<ontologyArray.length;i++){
		var nodeIndex = getNodeIndex(distributomeNodes,getDistributionName(ontologyArray[i]));
		//alert(ontologyArray[i]+"::name  index::"+nodeIndex);
		distributome.nodes[nodeIndex].selected = level; //selected Node
	}
}

function getDistributomeReferences(nodeName){
	var nodeIndex = getNodeIndex(distributomeNodes,getDistributionName(nodeName));
	var cites = citeNodes[nodeIndex];
	bibtex_js_draw(cites);
	//var citeList = cites.split(",");
	//var html = new Array();
	//for(var i=0; i<citeList.length; i++){
	//	html.push(bibtex_js_draw(citeList[i]));
	//}
	//alert("html"+html.join(''));
}

function getRelationReferences(linkIndex){
	var cites = citeLinkNodes[linkIndex];
	//alert("cites"+cites);
	bibtex_js_draw(cites);
}
	
{		
		getURLParameters();
		/*** Read in and parse the Distributome.xml DB ***/
		var xmlhttp=createAjaxRequest();
		xmlhttp.open("GET","./data/Distributome.xml",false);
		xmlhttp.send();
		if (!xmlhttp.responseXML.documentElement && xmlhttp.responseStream)
			xmlhttp.responseXML.load(xmlhttp.responseStream);
		xmlDoc = xmlhttp.responseXML;
		try{
			DistributomeXML_Objects=xmlDoc.documentElement.childNodes;
			
		}catch(error){
			DistributomeXML_Objects=xmlDoc.childNodes;
		}
		
		traverseXML(false, null, DistributomeXML_Objects, distributome.nodes, distributome.edges, distributome.references, distributomeNodes, referenceNodes, null, citeNodes, citeLinkNodes);
		xmlhttp=createAjaxRequest();
		xmlhttp.open("GET","./data/Distributome.xml.pref",false);
		xmlhttp.send();
		if (!xmlhttp.responseXML.documentElement && xmlhttp.responseStream)
			xmlhttp.responseXML.load(xmlhttp.responseStream);
		var ontologyOrder = xmlhttp.responseXML;	
		getOntologyOrderArray(ontologyOrder);
}
