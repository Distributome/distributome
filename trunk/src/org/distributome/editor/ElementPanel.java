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

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Rectangle;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JPanel;
import javax.swing.JSeparator;
import javax.swing.JTable;
import javax.swing.Scrollable;
import javax.swing.SwingConstants;

/**
 * Scrollable JPanel for the provenance elements.
 *
 * @version 10 September 2007
 */
public class ElementPanel extends JPanel implements Scrollable, ActionListener
{
    /** Tables for each provenance element. */
   
	 private JTable[] nodeTables;
	 private JTable[] edgeTables;
	 private JTable[] formulaTables;
	 private JTable[] refTables;
	 
    private JButton addNode;
    private JButton addEdge;
    private JButton addFormula;
    private JButton addRef;
    private JButton[] buttons;
    
    TreeTableCodec modelMaker;

    
    public ElementPanel(TreeTableCodec _modelMaker)
    {
		setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));
	
		modelMaker = _modelMaker;
	//	setTableModels();		
    }
    
    /**
     * Constructs an Element Panel.
     *
     * @param elementTableModels Table Models for each provenance element.
     */
    public ElementPanel(ElementTableModel[] elementTableModels)
    {
	setLayout(new BoxLayout(this, BoxLayout.Y_AXIS));

	// Add the tables
	/*_elementTables = new JTable[elementTableModels.length];
	for (int i = 0; i < elementTableModels.length; i++) {
	    _elementTables[i] = new JTable(elementTableModels[i]); 
	    _elementTables[i].setRowSelectionAllowed(false);
	    _elementTables[i].setColumnSelectionAllowed(false);
	    add(_elementTables[i]);
	    
	    // Separate the tables
	    if (i < elementTableModels.length-1) { 
	    	add( new JSeparator() ); }
	}*/
    }

    /**
     * Gets the table models for each provenance element.
     *
     * @return Table Models for each provenance element.
     */
 /*   public ElementTableModel[] getTableModels()
    {
	ElementTableModel[] tms = new ElementTableModel[_elementTables.length];
	for (int i = 0; i < _elementTables.length; i++) {
	    tms[i] = (ElementTableModel)_elementTables[i].getModel();
	}
	return tms;
    }*/

    public ElementTableModel[] getNodeModels()
    {
    	int nodeCount = modelMaker.getNodeCount();
		ElementTableModel[] tms = new ElementTableModel[nodeCount];
		for (int i = 0; i <nodeCount; i++) {
		    tms[i] = (ElementTableModel)nodeTables[i].getModel();
		}
		return tms;
    }
    public ElementTableModel[] getEdgeModels()
    {
    	int edgeCount = modelMaker.getEdgeCount();
		ElementTableModel[] tms = new ElementTableModel[edgeCount];
		for (int i = 0; i < edgeCount; i++) {
		    tms[i] = (ElementTableModel)edgeTables[i].getModel();
		}
		return tms;
    }
    public ElementTableModel[] getFormulaModels()
    {

    	int formulaCount = modelMaker.getFormulaCount();
		ElementTableModel[] tms = new ElementTableModel[formulaCount];
		for (int i = 0; i < formulaCount; i++) {
		    tms[i] = (ElementTableModel)formulaTables[i].getModel();
		}
		return tms;
    }
    public ElementTableModel[] getRefModels()
    {
    	
    	int refCount = modelMaker.getRefCount();
		ElementTableModel[] tms = new ElementTableModel[refCount];
		for (int i = 0;  i < refCount ; i++) {
		    tms[i] = (ElementTableModel)refTables[i].getModel();
		}
		return tms;
    }
    /**
     * Sets the table models for each provenance element.
     *
     * @param elementTableModels Table Models for each provenance element.
     */
    public void setTableModels()
    {
    	
   removeAll();
   
	// Add the tables
	int nNode = modelMaker.getNodeCount();	
	//System.out.println("nNodes = "+nNode);
	if (nNode==0)
		nNode++;
	
	nodeTables = new JTable[nNode];
	ElementTableModel[] tableModels = modelMaker.getNodeTableModels();
	for (int i = 0; i < nNode; i++) {
		nodeTables[i] = new JTable(tableModels[i]); 
		nodeTables[i].setGridColor(Color.gray);
		nodeTables[i].setShowGrid(true);
		nodeTables[i].setRowSelectionAllowed(false);
		nodeTables[i].setColumnSelectionAllowed(false);
	    add(nodeTables[i]);
	    
	    // Separate the tables

	    add( new JSeparator() ); 
	    addNode = new JButton("add another node");
	  
	   
	}
	add (addNode);
	addNode.addActionListener(this);
	 add( new JSeparator() ); 
	 
	int nEdge = modelMaker.getEdgeCount();	
	//System.out.println("nEdge="+nEdge);
	if (nEdge==0)
		nEdge++;
	edgeTables = new JTable[nEdge];
	
	tableModels = modelMaker.getEdgeTableModels();
	for (int i = 0; i < nEdge; i++) {
		edgeTables[i] = new JTable(tableModels[i]); 
		edgeTables[i].setGridColor(Color.gray);
		edgeTables[i].setShowGrid(true);
		edgeTables[i].setRowSelectionAllowed(false);
		edgeTables[i].setColumnSelectionAllowed(false);
	    add(edgeTables[i]);
	    
	    // Separate the tables

	    add( new JSeparator() ); 
	    addEdge = new JButton("add another Edge");
	   
	   
	}
	 add (addEdge);
	 addEdge.addActionListener(this);
	 add( new JSeparator() ); 
	 
	int nFormula = modelMaker.getFormulaCount();
	//System.out.println("nFormula="+nFormula);
	if(nFormula==0)
		nFormula++;
	formulaTables = new JTable[nFormula];
	tableModels = modelMaker.getFormulaTableModels();
	for (int i = 0; i < nFormula; i++) {
		formulaTables[i] = new JTable(tableModels[i]); 
		formulaTables[i].setGridColor(Color.gray);
		formulaTables[i].setShowGrid(true);
		formulaTables[i].setRowSelectionAllowed(false);
		formulaTables[i].setColumnSelectionAllowed(false);
	    add(formulaTables[i]);
	    
	    // Separate the tables

	    add( new JSeparator() ); 
	    addFormula = new JButton("add another Formula");	   
	   
	}
	 add (addFormula);
	 addFormula.addActionListener(this);
	 add( new JSeparator() ); 
	 
	int nRef = modelMaker.getRefCount();	
	//System.out.println("nRef="+nRef);
	if (nRef==0)
		nRef++;
	refTables = new JTable[nRef];
	tableModels = modelMaker.getRefTableModels();
	for (int i = 0; i < nRef; i++) {
		refTables[i] = new JTable(tableModels[i]); 
		refTables[i].setGridColor(Color.gray);
		refTables[i].setShowGrid(true);
		refTables[i].setRowSelectionAllowed(false);
		refTables[i].setColumnSelectionAllowed(false);
	    add(refTables[i]);
	    
	    // Separate the tables

	    add( new JSeparator() ); 
	    addRef= new JButton("add another Ref");	    
	}
	add (addRef);
	addRef.addActionListener(this);

    }

    /** 
     * Gets the preferred size of the scrollable viewport. 
     *
     * @return Preferred size of the scrollable viewport.
     */
    public Dimension getPreferredScrollableViewportSize()
    {
	return new Dimension(400, 600);
    }

    /**
     * Gets the scroll increment that will completely expose one new row or
     * column, depending upon the value of the orientation.
     *
     * @param visibleRect View area that is visible in the viewport.
     * @param orientation Orientation of the scroll bar doing the scrolling.
     * @param direction Direction of the scroll (negative for up/left and
     *                  positive for down/right).
     *
     * @return Positive scroll increment.
     */
    public int getScrollableUnitIncrement(Rectangle visibleRect,
					  int orientation, int direction)
    {
	// Scroll a tenth of the visible width
	if (orientation == SwingConstants.HORIZONTAL) {
	    return visibleRect.width/10;
	}

	// Scroll a tenth of the visible height
	else { return visibleRect.height/10; }
    }

    /**
     * Gets the scroll increment that will completely expose one new block of
     * rows or columns, depending upon the value of the orientation.
     *
     * @param visibleRect View area that is visible in the viewport.
     * @param orientation Orientation of the scroll bar doing the scrolling.
     * @param direction Direction of the scroll (negative for up/left and
     *                  positive for down/right).
     *
     * @return Positive scroll increment.
     */
    public int getScrollableBlockIncrement(Rectangle visibleRect,
					   int orientation, int direction)
    {
	// Scroll a fifth of the visible width
	if (orientation == SwingConstants.HORIZONTAL) {
	    return visibleRect.width/5;
	}

	// Scroll a fifth of the visible height
	else { return visibleRect.height/5; }
    }

    /**
     * Determines if a viewport should always force the width of this
     * Scrollable to match the width of the viewport.
     *
     * @return True if a viewport should always force the width of this
     *         Scrollable to match the width of the viewport, false otherwise.
     */
    public boolean getScrollableTracksViewportWidth()
    {
	return true;
    }

    /**
     * Determines if a viewport should always force the height of this
     * Scrollable to match the height of the viewport.
     *
     * @return True if a viewport should always force the height of this
     *         Scrollable to match the height of the viewport, false otherwise.
     */
    public boolean getScrollableTracksViewportHeight()
    {
	return false;
    }

	public void actionPerformed(ActionEvent e) {
		// TODO Auto-generated method stub
		Object src = e.getSource();
		if (src == addNode){
			//System.out.println("addNode clicked");
			modelMaker.loadNode(null);
		}else if (src == addEdge){
			modelMaker.loadEdge(null);
		}else if (src == addFormula){
			modelMaker.loadFormula(null);
		}else if (src == addRef){
			modelMaker.loadRef(null);
		}
		setTableModels();
		validate();
	}
}
