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


package org.distributome;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.event.ActionEvent;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JTextField;

import org.distributome.data.SOCREdge;
import org.distributome.data.SOCRFormula;
import org.distributome.data.SOCRNode;
import org.distributome.data.SOCRReference;
import org.distributome.data.TGViewerPanelInfo;
import org.distributome.editor.DistributomeEditor;

public class TGEditorApplet extends TGViewerApplet{  
		
	public boolean debug = false;
	public JButton addNewNode;
	
	DistributomeEditor  editor;
    /**CONSTRUCTOR
     * 
     */
    public TGEditorApplet() {  	   	
     super();
    }
    

    protected void initControlPanel(){
	//	System.out.println("initControlPanel get called");
		controlPanel.removeAll();
		controlPanel.setPreferredSize(new Dimension(600, 33));
		controlPanel.setLayout(new FlowLayout(FlowLayout.CENTER));
		
		highlightNodeColorChoice = new JComboBox();
		highlightEdgeColorChoice = new JComboBox();	
		zoom_level = new JComboBox();
		textEntry = new JTextField(MAXSEARCHLENGTH - 4);
		
		refreshButton = new JButton("Reload");
		refreshButton.addActionListener(this);
		toggleButton = new JButton("Toggle Control");
		toggleButton.addActionListener(this);
		
		addNewNode = new JButton("Add New Node");
		addNewNode.addActionListener(this);
	
		neighbor_level= new JComboBox();
		neighbor_level.addItem("HideNeighbor");
		neighbor_level.addItem("ShowParent");
		neighbor_level.addItem("ShowChildren");
		neighbor_level.addItem("ShowBoth");
		neighbor_level.setSelectedIndex(0);
		neighbor_level.addActionListener(this);
		
		// search text field
	
		textEntry.addKeyListener(this);					
		
		zoom_level = new JComboBox();
		zoom_level.addItem("ZoomReset");
		zoom_level.addItem("ZoomIn");
		zoom_level.addItem("ZoomOut");
		zoom_level.setSelectedIndex(0);
		zoom_level.addActionListener(this);
		
		highlightNodeColorChoice= new JComboBox();
		highlightNodeColorChoice.addItem("HighlightNodeType");
		for (int i=0; i<panelInfo.nodeType.getTypeCount(); i++){
			highlightNodeColorChoice.addItem(panelInfo.nodeType.getFullName(i));
		}
		highlightNodeColorChoice.setSelectedIndex(0);
		highlightNodeColorChoice.addActionListener(this);
		
		highlightEdgeColorChoice = new JComboBox();
		highlightEdgeColorChoice.addItem("HighlightEdgeType");
		for (int j=0; j<panelInfo.edgeType.getTypeCount(); j++){
			highlightEdgeColorChoice.addItem(panelInfo.edgeType.getFullName(j));
		}
		highlightEdgeColorChoice.setSelectedIndex(0);
		highlightEdgeColorChoice.addActionListener(this);
	
		controlPanel.add(toggleButton);
		controlPanel.add(refreshButton);
		controlPanel.add(new JLabel("Search", JLabel.RIGHT)); 
		controlPanel.add(textEntry);
		controlPanel.add(addNewNode);
		controlPanel.add(new JLabel("Double click on any node or whitespace to open editor"));
		//controlPanel.add(zoom_level);
		//controlPanel.add(neighbor_level);
	
		//controlPanel.add(highlightNodeColorChoice);
		//controlPanel.add(highlightEdgeColorChoice);
		
		this.getContentPane().repaint();
	}

    public void getXMLInputFile(){
    	super.getXMLInputFile();
		
		turnOnshowID();
		
		//System.out.println(panelInfo.getNodeCount() + ":"+panelInfo.getEdgeCount() +":"+panelInfo.nFormulas +":"+panelInfo.nRefs);
    }
    
    protected void turnOnshowID(){
	 for (int i=0; i<panelInfo.getNodeCount(); i++)
		 panelInfo.getNode(i).showID= true;
	 for (int i=0; i<panelInfo.getEdgeCount(); i++)
		 panelInfo.getEdge(i).showID= true;
	/* for (int i=0; i<panelInfo.nFormulas; i++)
		 panelInfo.getFormula(i).showID= true;
	 for (int i=0; i<panelInfo.nRefs; i++)
		 panelInfo.refs[i].showID= true;*/
    }

    
    /** ActionListener implementation method
	 * 
	 */
	public void actionPerformed(ActionEvent e) {
		super.actionPerformed(e);
	
		Object src = e.getSource();
		
		if (src == addNewNode) { 
			if (editor!=null)
				editor.dispose();
			editor = new DistributomeEditor();		  
			editor.setCodeBase(this.getCodeBase());
			editor.loadElements((SOCRNode)null);
			editor.loadElements((SOCREdge)null);
			editor.loadElements((SOCRFormula)null);
			editor.loadElements((SOCRReference)null);
			
			editor.showView();
		}
	
		// refresh button handling
		if (src == refreshButton) { 
			if (debug) System.out.println("refresh clicked");
			final Container c = this.getContentPane();
			//c.removeAll();
			c.remove(graphPanel);	
			
			panelInfo = new TGViewerPanelInfo(this);
		//	panelInfo.setFreezedStatus(false);
		
			//getInputFile();
			getXMLInputFile();
			initGraph();
			resetControlPanel();
			
			displayInitInfo();
	    	
			c.add(graphPanel,BorderLayout.CENTER);
			c.validate();
		//	panelInfo.start();
			return;
		}
	}
	
	public void doubleClickedWhitespace(){
		//System.out.println("ClickedWhitespace");
		if (editor!=null)
			editor.dispose();
		editor = new DistributomeEditor();		  
		editor.setCodeBase(this.getCodeBase());
		editor.loadElements((SOCRNode)null);
		editor.loadElements((SOCREdge)null);
		editor.loadElements((SOCRFormula)null);
		editor.loadElements((SOCRReference)null);
		
		editor.showView();
	}
	
	public void doubleClickedNode(){
		if (editor!=null)
			editor.dispose();
		editor = new DistributomeEditor();		  
		editor.setCodeBase(this.getCodeBase());
		editor.loadElements(panelInfo.getNode(panelInfo.pickedNodeIndex));
		
		int pickedNodeId = panelInfo.getNode(panelInfo.pickedNodeIndex).getId();
		//System.out.println("picked node id ="+pickedNodeId);
		
		for (int i=0; i<panelInfo.getEdgeCount(); i++)
			if (panelInfo.getEdge(i).getSourceId()==pickedNodeId||
					panelInfo.getEdge(i).getTargetId()==pickedNodeId	){
				editor.loadElements(panelInfo.getEdge(i));
			}
		
		for (int i=0; i<panelInfo.getEdgeCount(); i++)
			if (panelInfo.getFormula(i).getId()==panelInfo.getNode(panelInfo.pickedNodeIndex).getFormulaId()){
				editor.loadElements(panelInfo.getFormula(i));
			}
		
		for (int j=0; j<panelInfo.getNode(panelInfo.pickedNodeIndex).getRefCount(); j++){
			int refId= panelInfo.getNode(panelInfo.pickedNodeIndex).getRefId(j);
			for (int i=0; i<panelInfo.getRefCount(); i++)
				if (panelInfo.getRef(i).getId()==refId)
					editor.loadElements(panelInfo.getRef(i));
		}
			
		editor.showView();
	}

    
}



