/****************************************************
* The Distributome Project is an open-source, open content-development
project for exploring, discovering, learning and computational utilization
of diverse probability distributions. Probability distributions are a
special class of functions defined in terms of integrals of positive density
functions. Distribution functions are very useful in representation,
modeling and interpretation of various observable processes and natural
phenomena. Probability densities are a non-negative functions that integrate
to one over the real numbers. 
*  
*  A probability density function can be seen as a smooth version of a
frequency histogram. The current Distributome XML meta-data on distribution
properties and inter-distribution relations is available here, and the
current XSD schema is available here. The complete Distributome project Java
source code is available online under LGPL license. The applet binary JAR
files and the HTML wrappers are also available.
* 
* http://www.distributome.org/
* 
* http://distributome.googlecode.com/ 
****************************************************/


package org.distributome.xml;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Stack;

import javax.xml.XMLConstants;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import javax.xml.transform.sax.SAXSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import org.distributome.data.SOCREdge;
import org.distributome.data.SOCRFormula;
import org.distributome.data.SOCRNode;
import org.distributome.data.SOCRReference;
import org.xml.sax.Attributes;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import org.xml.sax.helpers.DefaultHandler;

public class Distributome_XMLReader extends DefaultHandler
{    
	List<SOCRNode> nodes;
	List<SOCREdge> edges;
	List<SOCRFormula> formulas;
	List<SOCRReference> references;
	String node_url_prefix;
	String density_prefix;
	String version;
	boolean hasError= false;
	String errorMessage;

	private String cdata;
	private SOCRNode tempNode;
	private SOCREdge tempEdge;
	private SOCRFormula tempFormula;
	private SOCRReference tempRef;
	
	Stack<String> currentElement= new Stack<String>();
	
	public Distributome_XMLReader(){

		nodes = new ArrayList<SOCRNode>();
		edges = new ArrayList<SOCREdge>();
		formulas = new ArrayList<SOCRFormula>();
		references = new ArrayList<SOCRReference>();

	}
	
	public void readXMLFile(String xmlURL) {
		parseDocument(xmlURL);
	}
	public void readXMLFile(String xmlURL, String xsdURL) {
		parseDocument(xmlURL, xsdURL);
	}
	
	public void readXMLFile(URL xmlURL, URL xsdURL) {
		parseDocument(xmlURL, xsdURL);
	}
	
	public boolean hasError(){
		return hasError;
	}
	
	public String getErrorMsg(){
		return errorMessage;
	}
	
	public String getVersion(){
		return version;
	}
	public String getNodeURLPrefix(){
		return node_url_prefix;
	}
	public String getFormulaDensityPrefix(){
		return density_prefix;
	}
	public List getNodes(){
		return nodes;
	}
	public List getEdges(){
		return edges;
	}
	public List getFormulas(){
		return formulas;
	}
	public List getReferences(){
		return references;
	}
	
	public void runExample(String xmlURL) {
		parseDocument(xmlURL);
		printData();
	}

	private void parseDocument(URL xmlURL, URL xsdURL) {
		//get a factory

	//	System.out.println("xmlURL="+xmlURL);
	//	System.out.println("xsdURL="+xsdURL);
		SAXParserFactory spf = SAXParserFactory.newInstance();
		
		// build an XSD-aware SchemaFactory
		SchemaFactory schemaFactory = SchemaFactory.newInstance( XMLConstants.W3C_XML_SCHEMA_NS_URI );

		// hook up org.xml.sax.ErrorHandler implementation.
		MyErrorHandler myErrorHandler = new MyErrorHandler();	
		schemaFactory.setErrorHandler( myErrorHandler);
		
		try {
			// get the custom xsd schema describing the required format for my XML files.
		//	Schema schemaXSD = schemaFactory.newSchema( new File(xsdURL));
			
			Schema schemaXSD = schemaFactory.newSchema(xsdURL);
			
			// Create a Validator capable of validating XML files according to my custom schema.
			Validator validator = schemaXSD.newValidator();
			
			//SAXSource source = new SAXSource( new InputSource(xmlURL));
			SAXSource source = new SAXSource(new InputSource(xmlURL.toString()));

			// validating the SAX source against the schema
			//validator.validate(source);
			      
			//System.out.println("schema validation passed");
			
			//get a new instance of parser
			SAXParser sp = spf.newSAXParser();

			//parse the file and also register this class for call backs
			sp.parse(xmlURL.toString(), this);

		}catch(SAXException se) {

			System.out.println(se.getLocalizedMessage());
	
			hasError = true;
			//printData();

		}catch(ParserConfigurationException pce) {

			pce.printStackTrace();

		}catch (IOException ie) {

			ie.printStackTrace();

		}

	}
	
	public void error(SAXParseException exception) throws SAXException {

		 errorMessage = ("**Parsing Error**\n" +
                 "  Line:    " + 
                    exception.getLineNumber() + "\n" +
                 "  URI:     " + 
                    exception.getSystemId() + "\n" +
                 "  Message: " + 
                    exception.getMessage());    
		 System.out.println(errorMessage);
		 throw new SAXException("Error encountered");
	}

	public void fatalError(SAXParseException exception) throws SAXException {
	
		 errorMessage = ("**Parsing Fatal Error**\n" +
                "  Line:    " + 
                   exception.getLineNumber() + "\n" +
                "  URI:    \n " + 
                   exception.getSystemId() + "\n" +
                "  Message: \n" + 
                   exception.getMessage());   
		 System.out.println(errorMessage);
		throw new SAXException("Fatal Error encountered");
	}

	public void warning(SAXParseException exception) throws SAXException {
		
		errorMessage = ("**Parsing Warning**\n"+
                 "  Line:    " + 
                    exception.getLineNumber() + "\n" +
                 "  URI:     " + 
                    exception.getSystemId() + "\n" +
                 "  Message: " + 
                    exception.getMessage());  
		 System.out.println(errorMessage);
		 throw new SAXException("Warning encountered");
	}
	
	//this one works
	private void parseDocument(String xmlURL, String xsdURL) {

		//get a factory

		SAXParserFactory spf = SAXParserFactory.newInstance();
		
		// build an XSD-aware SchemaFactory
		SchemaFactory schemaFactory = SchemaFactory.newInstance( XMLConstants.W3C_XML_SCHEMA_NS_URI );

		// hook up org.xml.sax.ErrorHandler implementation.
		MyErrorHandler myErrorHandler = new MyErrorHandler();	
		schemaFactory.setErrorHandler( myErrorHandler);
		
		try {
			// get the custom xsd schema describing the required format for my XML files.
			Schema schemaXSD = schemaFactory.newSchema( new File(xsdURL));
			
			
			// Create a Validator capable of validating XML files according to my custom schema.
			Validator validator = schemaXSD.newValidator();
			
			SAXSource source = new SAXSource( new InputSource(xmlURL));

			// validating the SAX source against the schema
			validator.validate(source);
			      
			System.out.println("schema validation passed");
			
			//get a new instance of parser
			SAXParser sp = spf.newSAXParser();

			//parse the file and also register this class for call backs
			sp.parse(xmlURL, this);
	

		}catch(SAXException se) {

			System.out.println(se.getMessage());
			//se.printStackTrace();

		}catch(ParserConfigurationException pce) {

			pce.printStackTrace();

		}catch (IOException ie) {

			ie.printStackTrace();

		}

	}

//without xsd
	private void parseDocument(String xmlURL) {
		

		//get a factory
		SAXParserFactory spf = SAXParserFactory.newInstance();
		//spf.setValidating(true);
	
		try {
	//get a new instance of parser
			SAXParser sp = spf.newSAXParser();

			//parse the file and also register this class for call backs
			sp.parse(xmlURL, this);

		}catch(SAXException se) {

			se.printStackTrace();

		}catch(ParserConfigurationException pce) {

			pce.printStackTrace();

		}catch (IOException ie) {

			ie.printStackTrace();

		}

	}

	/**

	 * Iterate through the list and print

	 * the contents

	 */

	private void printData(){

		System.out.println("No of Nodes '" + nodes.size() + "'.");
		Iterator it = nodes.iterator();
		while(it.hasNext()) {
			((SOCRNode) it.next()).print();
		}
		
		System.out.println("No of Edges '" + edges.size() + "'.");
		it = edges.iterator();
		while(it.hasNext()) {
			((SOCREdge) it.next()).print();
		}
		
		System.out.println("No of Formula '" + formulas.size() + "'.");
		it = formulas.iterator();
		while(it.hasNext()) {
			((SOCRFormula) it.next()).print();
		}
		
		System.out.println("No of Reference '" + edges.size() + "'.");
		it = references.iterator();
		while(it.hasNext()) {
			((SOCRReference) it.next()).print();
		}
	}

	



	//Event Handlers

	public void startElement(String uri, String localName, String qName, Attributes atts) throws SAXParseException{
		
		currentElement.push(qName);
		
		if(qName.equalsIgnoreCase("SOCRDistributome")){
			version = atts.getValue("version");
		}
		else if(qName.equalsIgnoreCase("Distributions")) {
			node_url_prefix= atts.getValue("URLPrefix");
		}
		else if(qName.equalsIgnoreCase("Formulas")) {
			density_prefix= atts.getValue("DensityPrefix");
		}
		else if(qName.equalsIgnoreCase("Node")) {
			
			tempNode = new SOCRNode();
			tempNode.setId(atts.getValue("ID"));

			tempNode.setName(atts.getValue("Name"));
			tempNode.setTypes(atts.getValue("Types"));
			tempNode.setFormulaId(atts.getValue("FormulaID"));
			tempNode.setURL(atts.getValue("URL"));
			tempNode.setKeywords(atts.getValue("Keywords"));
			tempNode.setRefs(atts.getValue("Refs"));
			nodes.add(tempNode);	
		}
		else if(qName.equalsIgnoreCase("Edge")) {
		//	System.out.println("edge"+edges.size()+":"+uri);
		
			tempEdge = new SOCREdge();
			tempEdge.setId(atts.getValue("ID"));

			tempEdge.setName(atts.getValue("Name"));
			tempEdge.setTypes(atts.getValue("Types"));
			tempEdge.setFormulaId(atts.getValue("FormulaID"));
			tempEdge.setSource(atts.getValue("FromNodeID"));
			tempEdge.setTarget(atts.getValue("ToNodeID"));
			tempEdge.setRefs(atts.getValue("Refs"));
			edges.add(tempEdge);	
		}else if(qName.equalsIgnoreCase("Formula")) {
		
			tempFormula = new SOCRFormula();
			tempFormula.setId(atts.getValue("ID"));

		//	System.out.println("formula "+tempFormula.getId()+":"+uri);
			tempFormula.setImgURL(atts.getValue("Density"));
			tempFormula.setEquation(atts.getValue("Equation"));
			
			formulas.add(tempFormula);	
		}
		else if(qName.equalsIgnoreCase("Ref")) {
			
			tempRef = new SOCRReference();
			tempRef.setId(atts.getValue("ID"));

		//	System.out.println("Ref"+tempRef.id+":"+uri);
			tempRef.setAuthor(atts.getValue("Author"));
			tempRef.setYear(atts.getValue("Year"));
			tempRef.setTitle(atts.getValue("Title"));
			tempRef.setJournal(atts.getValue("Journal"));
			tempRef.setVolumnInfo(atts.getValue("Page"));
			tempRef.setURL(atts.getValue("URL"));
			references.add(tempRef);	
		}
	}

	public void characters(char[] ch, int start, int length) throws SAXException {

		cdata = new String(ch,start,length).trim();
		if (cdata.length()!=0){
			String qName = (String)currentElement.peek();
			//System.out.println("Element '" + currentElement.peek() + "' contains text:*" + cdata+"*");
			if (qName.equalsIgnoreCase("RefURL"))
					tempRef.setURL(cdata);
			else if (qName.equalsIgnoreCase("NodeURL"))
				tempNode.setURL(cdata);
			else if (qName.equalsIgnoreCase("FormulaEquation"))
				tempFormula.setEquation(cdata);
		}

	}

	public void endElement(String uri, String localName, String qName) throws SAXException {

			currentElement.pop();
	}


}

