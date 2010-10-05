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

package org.distributome.editor;

import org.distributome.data.SOCREdge;
import org.distributome.data.SOCRFormula;
import org.distributome.data.SOCRNode;
import org.distributome.data.SOCRReference;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
/**
 * Codec for converting between trees and Table Models.
 *
 * @version 11 September 2007
 */
public class TreeTableCodec
{
    /** Node attributes. */
    private static String[] NODE_ATTRS =
	new String[]{"ID", "Name", "Types", "FormulaID", "URL", "Keywords", "Refs"};

    /** Edge attributes. */
    private static String[] EDGE_ATTRS =
	new String[]{"ID", "Name", "Types", "FormulaID", "FromNodeID", "ToNodeID",
		     "Refs"};

    /** Formula provenance attributes. */
    private static String[] FORMULA_ATTRS =
	new String[]{"ID", "Density", "Equation"};

    /**Ref attributes. */
    private static String[]  REF_ATTRS =
	new String[]{"ID", "Author", "Year",
		     "Title", "Journal", "Page", "URL"};
    
    ElementTableModel[] nodeModels, edgeModels, formulaModels, refModels;
    int nNodes, nEdges, nFormulas, nRefs;
    

    /** Construct a Tree-Table Codec. */
    public TreeTableCodec()
    {
    	nNodes = 0;
    	nEdges = 0;
    	nFormulas = 0;
    	nRefs = 0;
    	
    	
    	nodeModels = new ElementTableModel[10];
    	for (int i=0; i<=nNodes; i++)
    		nodeModels[i] = new ElementTableModel("Node", NODE_ATTRS);
    	edgeModels = new ElementTableModel[10];
    	for (int i=0; i<=nEdges; i++)
    		edgeModels[i] = new ElementTableModel("Edge", EDGE_ATTRS);
    	formulaModels = new ElementTableModel[10];
    	for (int i=0; i<=nFormulas; i++)
    		formulaModels[i] = new ElementTableModel("Formula", FORMULA_ATTRS);
    	refModels = new ElementTableModel[10];
    	for (int i=0; i<=nRefs; i++)
    		refModels[i] = new ElementTableModel("Reference", REF_ATTRS);
    	
    	
    }

    public ElementTableModel[] getNodeTableModels()
    {
    	return nodeModels;
    }
    public ElementTableModel[] getEdgeTableModels()
    {
    	return edgeModels;
    }
    public ElementTableModel[] getFormulaTableModels()
    {
    	return formulaModels;
    }
    public ElementTableModel[] getRefTableModels()
    {
    	return refModels;
    }
     
    public int getNodeCount(){
   	 return nNodes;
    }
    public int getEdgeCount(){
   	 return nEdges;
    }
    public int getFormulaCount(){
   	 return nFormulas;
    }
    public int getRefCount(){
   	 return nRefs;
    }
    
    public void loadNode(SOCRNode node){
    	loadNode(nNodes, node);
    	nNodes++;
    	//nodeModels[nNodes]= new ElementTableModel("New Node", NODE_ATTRS);    	
    }
    
    public void loadNode(int index, SOCRNode node){
    	
    	if(node!=null){
	    	nodeModels[index]= new ElementTableModel("Node", NODE_ATTRS);
	    	nodeModels[index].setAttribute(NODE_ATTRS[0], String.valueOf(node.getId()));   	
	    	nodeModels[index].setAttribute(NODE_ATTRS[1], node.getName());
	    	nodeModels[index].setAttribute(NODE_ATTRS[2], node.getTypeString());
	    	nodeModels[index].setAttribute(NODE_ATTRS[3], String.valueOf(node.getFormulaId()));
	    	nodeModels[index].setAttribute(NODE_ATTRS[4], node.getUrl());
	    	nodeModels[index].setAttribute(NODE_ATTRS[5], node.getKeywordString());
	    	nodeModels[index].setAttribute(NODE_ATTRS[6], node.getRefString());   	
    	}
    	else nodeModels[index]= new ElementTableModel("Node", NODE_ATTRS);
    	
    	//System.out.println("loadNode get called nNode="+nNodes);
    }
    
    public void loadEdge(SOCREdge edge){
    	loadEdge(nEdges, edge);
    	nEdges++;
    	//edgeModels[nEdges]= new ElementTableModel("New Edge", EDGE_ATTRS);    	
    }
    
    public void loadEdge(int index, SOCREdge edge){
    	if (edge!=null){
	    	edgeModels[index]= new ElementTableModel("Edge", EDGE_ATTRS);
	    	edgeModels[index].setAttribute(EDGE_ATTRS[0], String.valueOf(edge.getId())); 
	    	edgeModels[index].setAttribute(EDGE_ATTRS[1], edge.getName()); 
	    	edgeModels[index].setAttribute(EDGE_ATTRS[2], edge.getTypeString());
	    	edgeModels[index].setAttribute(EDGE_ATTRS[3], String.valueOf(edge.getFormulaId()));
	    	edgeModels[index].setAttribute(EDGE_ATTRS[4], String.valueOf(edge.getSourceId())); 
	    	edgeModels[index].setAttribute(EDGE_ATTRS[5], String.valueOf(edge.getTargetId())); 
	    	edgeModels[index].setAttribute(EDGE_ATTRS[6], edge.getRefString());   
    	}else {
    		edgeModels[index]= new ElementTableModel("Edge", EDGE_ATTRS);
    	}
    	//System.out.println("loadEdge get called nEdge="+nEdges);
    }
    
    public void loadFormula(SOCRFormula formula){
    	loadFormula(nFormulas, formula);
    	nFormulas++;
    	//edgeModels[nEdges]= new ElementTableModel("New Edge", EDGE_ATTRS);    	
    }
    
    public void loadFormula(int index, SOCRFormula formula){
    	//System.out.println("load Formula " +nFormulas);
    	if(formula!=null){
    		formulaModels[index]= new ElementTableModel("Formula", FORMULA_ATTRS);
	    	formulaModels[index].setAttribute(FORMULA_ATTRS[0], String.valueOf(formula.getId())); 
	    	formulaModels[index].setAttribute(FORMULA_ATTRS[1], formula.getImgURL()); 
	    	formulaModels[index].setAttribute(FORMULA_ATTRS[2], formula.getEquation()); 
    	}else formulaModels[index]= new ElementTableModel("Formula", FORMULA_ATTRS);
    }
    
    public void loadRef(SOCRReference ref){
    	loadRef(nRefs, ref);
    	nRefs++;
    	//edgeModels[nEdges]= new ElementTableModel("New Edge", EDGE_ATTRS);    	
    }
    
    public void loadRef(int index, SOCRReference ref){
    //	System.out.println("load Ref " +nRefs);
    	
    	if(ref!=null){
    		refModels[index]= new ElementTableModel("Ref", REF_ATTRS);
	    	refModels[index].setAttribute(REF_ATTRS[0], String.valueOf(ref.getId()));
	    	refModels[index].setAttribute(REF_ATTRS[1], ref.getAuthorString());
	    	refModels[index].setAttribute(REF_ATTRS[2], ref.getYear());  	
	    	refModels[index].setAttribute(REF_ATTRS[3], ref.getTitle());
	    	refModels[index].setAttribute(REF_ATTRS[4], ref.getJournal());
	    	refModels[index].setAttribute(REF_ATTRS[5], ref.getVolumnInfo());
	    	refModels[index].setAttribute(REF_ATTRS[6], ref.getURL());
    	}else  refModels[index]= new ElementTableModel("Ref", REF_ATTRS);
    }
    
    /**
     * Converts the Table Models to a XML-encoded string.
     *
     * @param tableModels Table models of provenance data.
     *
     * @return XML-encoded string constructed from the table models.
     */
    public static String toXml(ElementTableModel[] nodeModels, 
    							ElementTableModel[] edgeModels, 
    							ElementTableModel[] formulaModels,
    							ElementTableModel[] refModels)
    {
	StringBuffer xml = new StringBuffer();

	// XML header
	xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");

	// Provenance element - begin
	xml.append("<SOCRDistributome version =\"1.0\">\n");
	

	// Node
	xml.append(" <Distributions URLPrefix =\"http://socr.ucla.edu/htmls/dist/\"> \n");
	for (int i=0; i<nodeModels.length; i++)
		xml.append(_toXml(nodeModels[i], 2, false) + "\n");
	xml.append("</Distributions>\n");
	
	// Edge
	if (edgeModels.length >0){
		xml.append("<Relations> \n");
		for (int i=0; i<edgeModels.length; i++)
			xml.append(_toXml(edgeModels[i], 2, false) + "\n");
		xml.append("</Relations>\n");
	}
	// Formulas
	if(formulaModels.length>0){
		xml.append("<Formulas DensityPrefix=\"http://wiki.stat.ucla.edu/socr/uploads/math/\"> \n");
		for (int i=0; i<formulaModels.length; i++)
			xml.append(_toXml(formulaModels[i], 2, false) + "\n");
		xml.append("</Formulas>\n");
	}
	// Refs
	if (refModels.length>0){
		xml.append("<References> \n");
		for (int i=0; i<refModels.length; i++)
			xml.append(_toXml(refModels[i], 2, false) + "\n");
		xml.append("</References>\n");
	}
	// element - end
	xml.append("</SOCRDistributome>");

	return xml.toString();
    }

    /**
     * Converts the DOM Node to Table Models.
     *
     * @param rootNode Root Node of provenance data.
     *
     * @return Table Models constructed from the Node.
     */
    public void  toTableModels(Node rootNode)
    {
	//ElementTableModel[] tableModels = getProvenanceTableModels();

	// Skip to the primary elements
	Node provNode = rootNode.getFirstChild();
	NodeList primNodes = provNode.getChildNodes();
	nNodes=0; nEdges=0; nFormulas=0; nRefs=0;
	
	for (int i = 0; i < primNodes.getLength(); i++) {
	    Node primNode = primNodes.item(i);

	    // Match the primary name to the name of the table model
	    String primName = primNode.getNodeName();
	    if (primName.equalsIgnoreCase("Node")){
	    	nNodes++;
		    _setAttributes(nodeModels[nNodes], primNode);		
		}else if (primName.equalsIgnoreCase("Edge")){
			nEdges++;
			_setAttributes(nodeModels[nNodes], primNode);		
		}else if (primName.equalsIgnoreCase("Formula")){
			nFormulas++;
			_setAttributes(nodeModels[nFormulas], primNode);		
		}else if (primName.equalsIgnoreCase("Ref")){
			nRefs++;
			_setAttributes(refModels[nRefs], primNode);		
		}

	    // Also check secondary elements
	    NodeList secNodes = primNode.getChildNodes();
	    for (int j = 0; j < secNodes.getLength(); j++) {
		Node secNode = secNodes.item(j);

		// Match the secondary name to the name of the table model
		String secName = secNode.getNodeName();
		    if (secName.equalsIgnoreCase("Node")){
		    	nNodes++;
			    _setAttributes(nodeModels[nNodes], secNode);		
			}else if (secName.equalsIgnoreCase("Edge")){
				nEdges++;
				_setAttributes(nodeModels[nNodes], secNode);		
			}else if (secName.equalsIgnoreCase("Formula")){
				nFormulas++;
				_setAttributes(nodeModels[nFormulas], secNode);		
			}else if (secName.equalsIgnoreCase("Ref")){
				nRefs++;
				_setAttributes(refModels[nRefs], secNode);		
			}
	    }
	}

	//System.out.println("TreeTableCodec toTableModels get called nNodes="+nNodes );
    }

    /**
     * Set the attributes of the table model using those of the Node.
     *
     * @param tableModel Table Model whose attributes are set.
     * @param node Node containing the attributes.
     */
    private static void _setAttributes(ElementTableModel tableModel, Node node)
    {
	// Set the attributes
	NamedNodeMap attrs = node.getAttributes();
	for (int i = 0; i < attrs.getLength(); i++) {
	    Node attr = attrs.item(i);

	    // Transfer the attribute value to the table model
	    String attrName = attr.getNodeName();
	    String attrValue = attr.getNodeValue();
	    tableModel.setAttribute(attrName, attrValue);
	}
    }

    /**
     * Gets a string representation of the table model.
     *
     * @param tableModel Table Model to represent as a string.
     * @param indent Number of spaces to indent.
     * @param hasChildren True if the XML will have children; false o/w.
     *
     * @return String representation of the table model.
     */
    private static String _toXml(ElementTableModel tableModel, int indent,
				 boolean hasChildren)
    {
	String spaces = "";
	for (int i = 0; i < indent; i++) { spaces += " "; }

	// Element start
	StringBuffer xml = new StringBuffer();
	xml.append(spaces + "<" + tableModel.getElementName());

	// Add the attributes
	String[] attrNames = tableModel.getAttributeNames();
	for (int i = 0; i < attrNames.length; i++) {
	    String attrValue = tableModel.getAttributeValue(attrNames[i]);

	    // Don't write empty attributes
	    if ( !"".equals(attrValue) ) {
		xml.append(spaces + "   " + attrNames[i] + "=\"" +
			   _encode(attrValue) + "\"");
	    }
	}

	// Element end
	if (hasChildren) { xml.append(">"); }
	else { xml.append("/>"); }

	return xml.toString();
    }

    /**
     * Encodes special characters for attribute values.
     *
     * @param s String to encode.
     *
     * @return Encoded string.
     */
    private static String _encode(String s)
    {
        StringBuffer encodedS = new StringBuffer(s.length());
 
        // Search for characters to encode
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
 
            // Encode special characters
            String encodedC = null;
            if      (c == '&')  { encodedC = "&amp;"; }
            else if (c == '<')  { encodedC = "&lt;"; }
            else if (c == '\r') { encodedC = "&#13;"; }
            else if (c == '\n') { encodedC = "&#10;"; }
            else if (c == '\t') { encodedC = "&#9;"; }
            else if (c == '>')  { encodedC = "&gt;"; }
            else if (c == '"')  { encodedC = "&quot;"; }
            else if (c == '\'') { encodedC = "&apos;"; }
 
            // Append to the buffer
            if (encodedC != null) { encodedS.append(encodedC); }
            else { encodedS.append(c); }
        }
 
        // Return the encoded string
        if (encodedS != null) { return encodedS.toString(); }
        return s;
    }
}
