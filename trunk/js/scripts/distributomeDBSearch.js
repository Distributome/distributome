var distributomeDBSearch = new Object ();

distributomeDBSearch.nodes = new Array ();
distributomeDBSearch.edges = new Array ();
distributomeDBSearch.references = new Array ();
var distributomeDBSearchNodes = new Array();
var referenceDBSearchNodes = new Array();
var DistributomeDBSearchXML_Objects;

function refreshNodes(){
	for(var i=0; i<distributomeDBSearch.nodes.length; i++){
		distributomeDBSearch.nodes[i].selected = false;
	}
	for(var i=0; i< distributomeDBSearch.edges.length; i++){
		distributomeDBSearch.edges[i].selected = false;
	}
}

/*************** Function invoked on enter of the input box for search **************/
function displayXmlText(displayAll){
	refreshNodes();
	if(!displayAll){
		var searchString = document.getElementById('distributome.xmltext').value;
		//traverseXML(true, searchString);
		traverseXML(true, searchString, DistributomeDBSearchXML_Objects, distributomeDBSearch.nodes, distributomeDBSearch.edges, distributomeDBSearch.references, distributomeDBSearchNodes, referenceDBSearchNodes);
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
	for(var i=0; i< distributomeDBSearch.nodes.length; i++){
		if(!displayAll){
			if(distributomeDBSearch.nodes[i].selected){
				display = true;
			}else display = false;
		}
		if(display){
			nodehtml.push("<b>distribution:</b> <div style='padding-left:7px'>");
			parserOutput = XMLParser(getObjectReferenceNumber('node'), 1, i, true, DistributomeDBSearchXML_Objects);
			nodehtml.push(parserOutput[0]);
			referenceName= parserOutput[1];
			if(referenceName !=null){
				if(!reference) reference = true;
				referencehtml.push("<b>reference:</b> <div style='padding-left:7px'>");
				referencehtml.push(XMLParser(getObjectReferenceNumber('reference'), 9, i, false, DistributomeDBSearchXML_Objects)[0]);
				referencehtml.push("</div>");
			}
			nodehtml.push("</div>");
		}
	}
	display = true;
	for(var i=0; i<distributomeDBSearch.edges.length; i++){
		if(!displayAll){
			if(distributomeDBSearch.edges[i].selected){
				display = true;
			}else display = false;
		}
		if(display){
			relationhtml.push("<b>relation:</b> <div style='padding-left:7px'>");
			parserOutput = XMLParser(getObjectReferenceNumber('relation'), 7, i, true, DistributomeDBSearchXML_Objects);
			relationhtml.push(parserOutput[0]);
			referenceName= parserOutput[1];
			if(referenceName !=null){
				if(!reference) reference = true;
				referencehtml.push("<b>reference:</b> <div style='padding-left:7px'>");
				referencehtml.push(XMLParser(getObjectReferenceNumber('reference'), 9, i, false, DistributomeDBSearchXML_Objects)[0]);
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


{		
		
		/*** Read in and parse the Distributome.xml DB ***/
		var xmlhttp=createAjaxRequest();
		xmlhttp.open("GET","Distributome.xml",false);
		xmlhttp.send();
		if (!xmlhttp.responseXML.documentElement && xmlhttp.responseStream)
			xmlhttp.responseXML.load(xmlhttp.responseStream);
		xmlDoc = xmlhttp.responseXML;
		try{
			DistributomeDBSearchXML_Objects=xmlDoc.documentElement.childNodes;
		}catch(error){
			DistributomeDBSearchXML_Objects=xmlDoc.childNodes;
		}
		traverseXML(false, null, DistributomeDBSearchXML_Objects, distributomeDBSearch.nodes, distributomeDBSearch.edges, distributomeDBSearch.references, distributomeDBSearchNodes, referenceDBSearchNodes);
}
