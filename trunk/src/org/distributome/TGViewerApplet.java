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

import java.applet.AppletContext;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Graphics;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.image.BufferedImage;
import java.net.URL;
import java.util.Iterator;

import javax.imageio.ImageIO;
import javax.swing.BoxLayout;
import javax.swing.JApplet;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;

import org.distributome.data.SOCREdge;
import org.distributome.data.SOCRFormula;
import org.distributome.data.SOCRNode;
import org.distributome.data.SOCRReference;
import org.distributome.data.TGViewerPanelInfo;
import org.distributome.gui.LinkLabel;
import org.distributome.gui.LoadAndShowFormula;
import org.distributome.xml.Distributome_XMLReader;

import edu.ucla.stat.SOCR.touchgraph.graphlayout.Edge;
import edu.ucla.stat.SOCR.touchgraph.graphlayout.GLPanel;
import edu.ucla.stat.SOCR.touchgraph.graphlayout.Node;


public class TGViewerApplet extends JApplet 

	implements ActionListener, KeyListener{  
	
	protected static final String HideNeighbor = "HideNeighbor";
	protected static final String ShowParent = "ShowParent";
	protected static final String ShowChildren = "ShowChildren";
	protected static final String ShowBoth = "ShowBoth";
	
	protected static final String ZoomReset = "ZoomReset";
	protected static final String ZoomIn = "ZoomIn";
	protected static final String ZoomOut = "ZoomOut";
	
	protected static final int MAXVIEWABLENODES = 400;
	protected static final int MAXSEARCHLENGTH = 20;
	//protected boolean isWhiteSpacePicked= false;
	protected static final int XSIZE = 1000;
	protected static final int YSIZE = 600;
	
	private  boolean debug = false;
	protected boolean displayXmlError= false;
	protected String xmlErrorMsg;
	//private static final Color BGColor =new Color(229,240,252);
	//private static final Color BGColor =new Color(101,125,174);
//	private static final Color ControlBgColor =new Color(150,181,212);
	protected static final Color ControlBgColor =new Color(123,148,173);
	protected static final Color InfoBgColor =new Color(232,232,232);
	protected static final Color InfoBgColor2 = new Color(153,168,203);
	protected static final Color GraphBgColor =new Color(232,232,232);
	
	protected static final Color NodeTextColor = Color.blue.darker();
	protected static final Color EdgeTextColor = Color.green.darker().darker();
	
//	public static final Color NodeHighlightColor = Color.blue.brighter();
	public static final Color NodeParentColor = new Color(255, 102, 0);//Color.green.darker();//parent
	public static final Color NodeChildrenColor = new Color(255, 153, 204);//Color.pink.darker();//child
	public static final Color NodeBothColor = new Color(204, 51, 51);//Color.red;////both
	public static final Color NodeTypeHighlightColor = new Color(153, 0, 51); //Color.red;//
	public static final Color NodeSelectedHighlightColor = new Color(225, 164, 0);//Color.red.darker();//
	public static final Color NodeNormalColor = Color.orange;
//	private static final Color EdgeHighlightColor = Color.green.darker();
	public static final Color EdgeTypeHighlightColor = new Color(153, 0, 51);//Color.red;//
	public static final Color EdgeSelectedHighlightColor = new Color(225, 164, 0);//Color.red.darker();//
	public static final Color EdgeNormalColor = Color.black;
	

	// inter-applet communications		  
	public static TGViewerApplet selfRef = null; // for app comm in from tableapplet
	
	String inputFile;
	String inputFileVersion;
	String density_prefix, node_url_prefix;

	// panel-related
	public JScrollPane graphPanel;
	protected JPanel controlPanel;
	protected JPanel infoPanel;
	
	
	protected JTextArea infoAreaMiddle;
	protected LoadAndShowFormula infoAreaUpper;

	protected JPanel infoAreaReference;

	
	protected TGViewerPanelInfo panelInfo;
	
	protected JComboBox neighbours_level;
	protected JComboBox zoom_level;

	protected  JComboBox highlightNodeColorChoice, highlightEdgeColorChoice;
	protected  JComboBox neighbor_level;

	protected JButton refreshButton;
	protected JButton toggleButton;

	//	protected JComboBox showHighlightedOnlyChoice;
	
	//private Button show_all;
	
	protected String searchTerm = "";
	protected JTextField textEntry;
	protected boolean substringCheck = true;
	protected boolean wildCard = true;
	
//	protected JCheckBox chb_freeze;
//	protected final String urlPattern = "";

	public GLPanel graph;
	
    /**CONSTRUCTOR
     * 
     */
    public TGViewerApplet() {  	
    	
    /*	model = new DefaultGraphModel();
    	graph= new JGraph(model);
    	graph.setBackground(GraphBgColor);*/
  	
    	graph = new GLPanel();
	
	//	ru = new Running();
    	graphPanel= new JScrollPane(graph);
    	//graphPanel.addKeyListener(this);
  
    	graphPanel.setAutoscrolls(true);
		panelInfo = new TGViewerPanelInfo(this);
    }
    

	public void init() {
		
		if (isDebug()) System.out.println("init get called");
		// self reference to allow public method access (data share betw applets)
		selfRef = this; 
		
		// set layout
		getContentPane().setLayout(new BorderLayout());
	
		// add panel and mouseListener 
	
		graphPanel.setPreferredSize(new Dimension(XSIZE, YSIZE));
		//graphPanel.addKeyListener(this);  
		
		
		infoPanel = new JPanel();		
		infoPanel.setLayout(new BoxLayout(infoPanel, BoxLayout.PAGE_AXIS));
		//infoPanel.setBackground(Color.white); 
		infoAreaMiddle = new JTextArea();
		infoAreaUpper = new LoadAndShowFormula();
		infoAreaReference = new JPanel();
				
		infoAreaMiddle.setText("");
	
		
		//infoAreaMiddle.setPreferredSize(new Dimension(250, 300));
		
		infoAreaMiddle.setBackground(InfoBgColor2);
		infoAreaUpper.setBackground(Color.white);
		infoAreaReference.setBackground(InfoBgColor);
		
		LinkLabel link = new LinkLabel("Reference Link");
	    link.addActionTrigger( new MouseAdapter() {
	        public void mouseClicked(MouseEvent e) {	
				showURL("http://socr.stat.ucla.edu", "ref_url");
	        }
	    });
	    infoAreaReference.add(link);
	
	   
	    JScrollPane midContainer = new JScrollPane(infoAreaMiddle);
	    JScrollPane refContainer = new JScrollPane(infoAreaReference);
	    JScrollPane upperContainer = new JScrollPane(infoAreaUpper);;
		
	    upperContainer.setPreferredSize(new Dimension(250, 200));
	    midContainer.setPreferredSize(new Dimension(250, 300));
	    refContainer.setPreferredSize(new Dimension(250, 100));
		infoPanel.add(upperContainer);
		infoPanel.add(midContainer);
		infoPanel.add(refContainer);
			
	    controlPanel = new JPanel();
		controlPanel.setBackground(ControlBgColor);
		initControlPanel();
		//this.getContentPane().add(controlPanel, BorderLayout.NORTH);
		
		//getInputFile();
		getXMLInputFile();
		initGraph();
		
	
		final Container c = this.getContentPane();
		c.setLayout(new BorderLayout());
		c.add(controlPanel, BorderLayout.NORTH);
		c.add(infoPanel,BorderLayout.EAST);
		c.add(graphPanel,BorderLayout.CENTER);
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
		
		refreshButton = new JButton("Refresh");
		refreshButton.addActionListener(this);
		toggleButton =  new JButton("Toggle Controls");
		toggleButton.addActionListener(this);
		
		neighbor_level= new JComboBox();
		neighbor_level.addItem(HideNeighbor);
		neighbor_level.addItem(ShowParent);
		neighbor_level.addItem(ShowChildren);
		neighbor_level.addItem(ShowBoth);
		neighbor_level.setSelectedIndex(0);
		neighbor_level.addActionListener(this);
		
		// search text field
	
		textEntry.addKeyListener(this);		
			
		
		zoom_level = new JComboBox();
		zoom_level.addItem(ZoomReset);
		zoom_level.addItem(ZoomIn);
		zoom_level.addItem(ZoomOut);
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
	
		
		/*showHighlightedOnlyChoice= new JComboBox();
		showHighlightedOnlyChoice.addItem("ShowAll");
		showHighlightedOnlyChoice.addItem("HighLighedOnly");
		showHighlightedOnlyChoice.setSelectedIndex(0);
		showHighlightedOnlyChoice.addActionListener(this);*/
		
		
		/*freeze_on = new JButton("Freeze");
		freeze_off = new JButton("Freeze Off");
		freeze_on.addActionListener(this);
		freeze_off.addActionListener(this);*/
		controlPanel.add(toggleButton);
		controlPanel.add(refreshButton);
		controlPanel.add(new JLabel("Search", JLabel.RIGHT)); 
		controlPanel.add(textEntry);
		controlPanel.add(zoom_level);
		controlPanel.add(neighbor_level);
	
		controlPanel.add(highlightNodeColorChoice);
		controlPanel.add(highlightEdgeColorChoice);
		/*if (freezed){
			controlPanel.add(freeze_off);
			//System.out.println("adding freezed_off to controlPanel");
		}
		else {
			controlPanel.add(freeze_on);
			//System.out.println("adding freezed_on to controlPanel");
		}*/
		/*if (freezed){
			freezeChoice.setSelectedIndex(1);
			//System.out.println("adding freezed_off to controlPanel");
		}
		else {
			freezeChoice.setSelectedIndex(0);
			//System.out.println("adding freezed_on to controlPanel");
		}*/
		
		this.getContentPane().repaint();
	}



	protected void resetControlPanel(){
		neighbor_level.setSelectedIndex(0);
		highlightEdgeColorChoice.setSelectedIndex(0);
		highlightNodeColorChoice.setSelectedIndex(0);
		zoom_level.setSelectedIndex(0);
	}



	public void initGraph(){
		//System.out.println("initGraph get called");
		//System.out.println("panelInfo.getNodeCount()="+panelInfo.getNodeCount());
		
		graph = new GLPanel();
	
		//System.out.println("panelInfo.getNodeCount()="+panelInfo.getNodeCount());
		for (int i=0; i<panelInfo.getNodeCount(); i++){
			//System.out.println("adding node "+panelInfo.getNode(i).getDisplayName()+" showflag="+panelInfo.getNode(i).showFlag);
			if (panelInfo.getNode(i).showFlag!=TGViewerPanelInfo.NoShow){
				
				if (panelInfo.getNode(i).showFlag==TGViewerPanelInfo.Normal)
					addTGNode(panelInfo.getNode(i), NodeNormalColor);
				else if (panelInfo.getNode(i).showFlag==TGViewerPanelInfo.Highlighted)
					addTGNode(panelInfo.getNode(i), NodeTypeHighlightColor);
			}
		}
		
	//	System.out.println("panelInfo.getEdgeCount()="+panelInfo.getEdgeCount());
		for (int j=0; j<panelInfo.getEdgeCount(); j++){
			//System.out.println("adding edge "+panelInfo.getEdge(j).getDisplayName());
			addTGEdge(panelInfo.getEdge(j));
			//panelInfo.getEdge(j).cellId = panelInfo.nCells-1;
		}
	
		graph.tgPanel.setAppletRef(this);
	
		if(debug){
			for (int i =0; i<panelInfo.getEdgeCount(); i++)
				System.out.println("panelInfo.edges: "+i+" "+panelInfo.getEdge(i).getDisplayName() +" ->typeCount ="+panelInfo.getEdge(i).getTypeCount() );
		}
	
		displayInitInfo();	
		try{
			Thread.sleep(3000);
		}catch(Exception e){
			
		}
		
		graphPanel = new JScrollPane(graph);
		if(!displayXmlError){
			graph.tgPanel.selectFirstNode();
			graph.getHVScroll().slowScrollToCenter(graph.tgPanel.getSelectNode());
		}
		//nodeSelected();				
	}



	/* public void getInputFile(){
		inputFile = "implementedDistributome.txt";
		//inputFile = "input.txt";
		final URL codeBase = this.getCodeBase();
		final BufferedReader rder = startReaderBuffer(inputFile, codeBase);
		
		String line;
		while ( (line = readLine(rder)) != null && (line.toLowerCase().startsWith("["))) {
			
			line = line.trim();
			if 	(line.equalsIgnoreCase("[nodes]")){ 			
				createNodes(rder);				
				createEdges(rder);
				createFormulas(rder);
				createRefs(rder);
				
			}
			else if (line.equalsIgnoreCase("[edges]")){
				createEdges(rder);
				createNodes(rder);
				createFormulas(rder);
				createRefs(rder);
				
			}else if (line.equalsIgnoreCase("[references]")){
				createRefs(rder);
				createNodes(rder);
			
				createEdges(rder);
				createFormulas(rder);
			}else if(line.equalsIgnoreCase("[formulas]")){
				createFormulas(rder);
				createRefs(rder);
				createNodes(rder);
				createEdges(rder);				
			}
			
		}
	}*/
	public void getXMLInputFile(){
		if(isDebug())
			inputFile = "distributome_short.xml";
		else inputFile = "distributome.xml";
		String xsdFile = "distributome.xsd";
		
		final URL xmlBase = this.getCodeBase();
		/*String xmlBase = getDocumentBase().toString();
		int i = xmlBase.lastIndexOf("/");
		xmlBase = xmlBase.substring(0, i + 1);
		
		Distributome_XMLReader xmlReader = new Distributome_XMLReader();
		//xmlReader.readXMLFile(xmlBase+"/jars/"+inputFile);
		
		xmlReader.readXMLFile(xmlBase+"/jars/"+inputFile, xmlBase.substring("file:".length())+"jars/"+xsdFile);*/
		
		//System.out.println("xmlBase="+xmlBase);
		
		Distributome_XMLReader xmlReader = new Distributome_XMLReader();
		
		try{
			xmlReader.readXMLFile(new URL(xmlBase,inputFile), new URL(xmlBase,xsdFile));
			if(xmlReader.hasError()){
				 displayXmlError= true;
				// infoAreaMiddle.setPreferredSize(new Dimension(700, 300));
				 xmlErrorMsg = xmlReader.getErrorMsg();
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		
		
		panelInfo = new TGViewerPanelInfo(this);
	//	SwingUtilities.invokeLater(panelInfo);
		
		Iterator<SOCRNode> it = xmlReader.getNodes().iterator();
		if (isDebug()) System.out.println("No of Nodes '" + xmlReader.getNodes().size() + "'.");
		while(it.hasNext()) {
			panelInfo.addNode((SOCRNode) it.next());
		}		
		
		Iterator<SOCREdge> it2 = xmlReader.getEdges().iterator();
		if (isDebug()) System.out.println("No of Edges '" + xmlReader.getEdges().size() + "'.");
		while(it2.hasNext()) {
			panelInfo.addEdge((SOCREdge) it2.next());
		}
		
		Iterator<SOCRFormula> it3 = xmlReader.getFormulas().iterator();		
		if (isDebug()) System.out.println("No of Formulas '" + xmlReader.getFormulas().size() + "'.");
		while(it3.hasNext()) {
			panelInfo.addFormula((SOCRFormula)it3.next());
		}
		
		Iterator<SOCRReference> it4 = xmlReader.getReferences().iterator();	
		if (isDebug()) System.out.println("No of References '" + xmlReader.getReferences().size() + "'.");
		while(it4.hasNext()) {
			panelInfo.addRef((SOCRReference) it4.next());
		}
		density_prefix = xmlReader.getFormulaDensityPrefix();
		node_url_prefix= xmlReader.getNodeURLPrefix();		
		inputFileVersion= xmlReader.getVersion();
		
		if(isDebug()){
			System.out.println("------------");
			System.out.println("\n Input file="+inputFile+
	 				"\n Version "+inputFileVersion+ 
	 				"\n" + panelInfo.getNodeCount()+" Nodes, " +panelInfo.getEdgeCount()+" Edges, "+ panelInfo.getRefCount()+" References, " +panelInfo.getFormulaCount()+" Formulas.");
			System.out.println("------------");
			for (int i=0; i<panelInfo.getNodeCount(); i++)
				panelInfo.getNode(i).print();
			System.out.println("------------");
			for (int i=0; i<panelInfo.getEdgeCount(); i++)
				panelInfo.getEdge(i).print();
			System.out.println("------------");
			for (int i=0; i<panelInfo.getRefCount(); i++)
				panelInfo.getRef(i).print();
			System.out.println("------------");
			for (int i=0; i<panelInfo.getFormulaCount(); i++)
				panelInfo.getFormula(i).print();
			System.out.println("------------");
			
			int c1=panelInfo.countNumberOfEdgeforNodeId(1);
			System.out.println("countNumberOfEdgeforNodeId(1)="+c1);
		}
		//System.out.println(panelInfo.getNodeCount() + ":"+panelInfo.getEdgeCount() +":"+panelInfo.getFormulaCount() +":"+panelInfo.getRefCount());
	}



	protected void displayInitInfo(){
		String msg = "\n Input file="+inputFile+
		"\n Version "+inputFileVersion+ 
		"\n" + panelInfo.getNodeCount()+" Nodes, " +panelInfo.getEdgeCount()+" Edges, \n"+ panelInfo.getRefCount()+" References, " +panelInfo.getFormulaCount()+" Formulas.";

		if (displayXmlError)
			msg +="\n\n"+xmlErrorMsg;
		
		infoAreaMiddle.setForeground(Color.red.darker());
		infoAreaMiddle.setText(msg);
	}



	/*protected void createFormulas(final BufferedReader rder){
	    	String line;
	    	StringBuffer  sb = new StringBuffer();
	    	if  (debug) System.out.println("starting  Formulas");
	    	
	    	while ( (line = readLine(rder)) != null) {
	    	//	if (debug)	System.out.println("formula "+line);
				if (line.startsWith("density_prefix")){
					line = line.substring(line.indexOf("=")+1);
					sb.append(line.trim());
					density_prefix = line.trim();
				//	System.out.println("density_prefix = " +line);
				}
				else if (line.startsWith("Formula")|| line.startsWith("formula")){
					line = line.substring(line.indexOf("=")+1);
					final StringTokenizer tk = new StringTokenizer(line,";");
					
					int formula_id;
					String formula_density, formula_formula;
					
					formula_id = Integer.parseInt(tk.nextToken().trim());
					formula_density = tk.nextToken().trim();
					if(tk.hasMoreTokens())
						formula_formula = tk.nextToken().trim();
					else formula_formula ="";
					
					panelInfo.addFormula(formula_id, formula_density, formula_formula);
				}else return;
				
	    	}
	    }*/
	  /*  protected void createNodes(final BufferedReader rder){
	    	String line;
	    	final StringBuffer  sb = new StringBuffer();
	    	//if (debug) System.out.println("starting  Nodes");
	    	
	    	while ( (line = readLine(rder)) != null) {
	    	//	if (debug) System.out.println("Node "+line);
				
	    		if (line.startsWith("url_prefix")){
					line = line.substring(line.indexOf("=")+1);
					sb.append(line.trim());
					node_url_prefix = line.trim();
				//	System.out.println("url_prefix = " +line);
				}else if (line.toLowerCase().startsWith("node")){
					line = line.substring(line.indexOf("=")+1);
					final StringTokenizer tk = new StringTokenizer(line,";");
				
					int node_id, type_count, node_formulaId;
					int node_types[];
					String[] node_keywords;
					int keyword_count;
					String node_name, node_url;
					String tk_last;
					int node_refId_count;
					int[] node_refIds;
	
					node_id = Integer.parseInt(tk.nextToken().trim());
					node_name = tk.nextToken().trim();
					String typeString = tk.nextToken().trim();
					StringTokenizer tk2 = new StringTokenizer(typeString,",");
					type_count= tk2.countTokens();
					node_types = new int[type_count];
					int i=0;
					while(tk2.hasMoreTokens()){
						node_types[i]= Integer.parseInt(tk2.nextToken().trim());
						i++;
					}
					
					
					node_formulaId= Integer.parseInt(tk.nextToken().trim());
					
					node_url = tk.nextToken().trim();
					//System.out.println("node url="+node_url);
					
					String keywordsString = tk.nextToken().trim();
					StringTokenizer tk3 = new StringTokenizer(keywordsString,",");
					keyword_count= tk3.countTokens();
					node_keywords = new String[keyword_count];
					i=0;
					while(tk3.hasMoreTokens()){				
						node_keywords[i]= tk3.nextToken().trim();
						i++;
					}
					
					try{
						
						tk_last = tk.nextToken();
						
						if(tk_last != null){
							StringTokenizer tk4 = new StringTokenizer(tk_last,",");
							node_refId_count= tk4.countTokens();
							node_refIds = new int[node_refId_count];
							i=0;
							while(tk4.hasMoreTokens()){				
								node_refIds[i]= Integer.parseInt(tk4.nextToken().trim());
								i++;
							}
						}
						else{ // no reference
							node_refId_count = 0;
							node_refIds= new int[1];
							node_refIds[0]= 0;
						}
					}catch(Exception e){// no reference
						node_refId_count = 0;
						node_refIds = new int[1];
						node_refIds[0] = 0;			
					}
					//System.out.println("Node =["+node_id+", "+node_name+", "+node_density+", "+node_url+"]");	
					//for (int j=0; j<type_count; j++)
					//	System.out.println(node_types[j]);
					panelInfo.addNode(node_id, node_name, type_count, node_types, node_formulaId, node_url, keyword_count, node_keywords, node_refId_count, node_refIds);
				}else return;
			}//while
	    }*/
	    
	   
	    
	   /* protected void createEdges(final BufferedReader rder){
	    	String line;
	    	//if (debug) System.out.println("starting  Edges");
	    	
	    	while ( (line = readLine(rder)) != null && !(line.toLowerCase().startsWith("["))) {
	    	//	if (debug) System.out.println("edge "+line);
				// if (line.startsWith("url_prefix")){
				//	line = line.substring(line.indexOf("=")+1);
				//	sb.append(line.trim());
				//	edge_url_prefix = line.trim();
					//System.out.println("url_prefix = " +line);
				//}else 
	    		
	    		if (line.toLowerCase().startsWith("edge") ){
					line = line.substring(line.indexOf("=")+1);
					final StringTokenizer tk = new StringTokenizer(line,";");
					
					int edge_id, edge_formulaId;
					String edge_name;
					int type_count, edge_from, edge_to;
					int edge_types[];
					String tk_last;
					int edge_refId_count;
					int[] edge_refIds;
					
					edge_id = Integer.parseInt(tk.nextToken().trim());
					edge_name = tk.nextToken().trim();
						
					String typeString = tk.nextToken().trim();
					StringTokenizer tk2 = new StringTokenizer(typeString,",");
					type_count= tk2.countTokens();
					edge_types = new int[type_count];
					int i=0;
					while(tk2.hasMoreTokens()){
						edge_types[i]= Integer.parseInt(tk2.nextToken().trim());
						i++;
					}
					
					edge_formulaId = Integer.parseInt(tk.nextToken().trim());
					
					edge_from = Integer.parseInt(tk.nextToken().trim());
					edge_to = Integer.parseInt(tk.nextToken().trim());
					try{
						
						tk_last = tk.nextToken();
						
						if(tk_last != null){
							StringTokenizer tk4 = new StringTokenizer(tk_last,",");
							edge_refId_count= tk4.countTokens();
							edge_refIds = new int[edge_refId_count];
							i=0;
							while(tk4.hasMoreTokens()){				
								edge_refIds[i]= Integer.parseInt(tk4.nextToken().trim());
								i++;
							}
						}
						else{
							edge_refId_count = 0;
							edge_refIds= new int[1];
							edge_refIds[0]=0;
						}
					}catch(Exception e){
						edge_refId_count = 0;
						edge_refIds= new int[1];
						edge_refIds[0]=0;			
					}	
					// this create panelInfo's nodes[] and edges[]
					panelInfo.addEdge(edge_from, edge_to, edge_id, edge_name, type_count, edge_types, edge_formulaId, edge_refId_count, edge_refIds);
				//	System.out.println("Edge =["+edge_name+" "+edge_from+ " "+edge_to+" ]");
					//for (int j=0; j<type_count; j++)
						//System.out.println(edge_types[j]);
					
				}
				else return;
			}//while
	    }*/
	    
	 /*   protected void createRefs(final BufferedReader rder){
	    	String line;
	    //	if (debug) System.out.println("starting  Refs");
	    	
	    	while ( (line = readLine(rder)) != null) {
	    	//	if (debug) System.out.println("ref "+line);
				if (line.toLowerCase().startsWith("ref")){
					line = line.substring(line.indexOf("=")+1);
					final StringTokenizer tk = new StringTokenizer(line,";");
					
					int id; 
					int author_count;
					String[] authors;
					String year;
					String title;
					String journal;
					String volumeInfo;
					String url;
					
					id = Integer.parseInt(tk.nextToken().trim());
					String authorsString = tk.nextToken().trim();
					//System.out.println("authors="+authorsString);
					StringTokenizer tk2 = new StringTokenizer(authorsString,",");
					author_count= tk2.countTokens();
					authors = new String[author_count];
					int i=0;
					while(tk2.hasMoreTokens()){
						authors[i]= tk2.nextToken().trim();
						i++;
					}
					
					year = tk.nextToken().trim();
					title = tk.nextToken().trim();
					journal = tk.nextToken().trim();
					volumeInfo = tk.nextToken().trim();
					url = tk.nextToken().trim();
	
					panelInfo.addRef(id, author_count, authors, year, title, journal, volumeInfo, url);			
				}else return;
	    	}//while
	    }*/
	    
	  /*  private BufferedReader startReaderBuffer(String fileName, URL codeBase){
			
			try{
				final InputStream in = (new URL(codeBase,fileName).openStream());
				final BufferedReader rder = new BufferedReader(new InputStreamReader(in));
				return rder;	
			}
			catch(final IOException e) {
	            e.printStackTrace();
				return null;
				}
		}
	    
	    private String readLine(final BufferedReader rder){
			String line = null;
			try {
	            while ( (line = rder.readLine()) != null) {
	                line.trim();
	                if (line.startsWith("#") || line.equals("")) continue;
					else {
						//System.out.println("reading:"+line);
						return line;}
				}
			} catch ( final IOException e) {
	            e.printStackTrace();
				return null;
	        }
			return line;
		}*/
	    
	    public void clearInfoAreas(){
	    	if (isDebug()) System.out.println("clearInfoAreas get called");
	    	updateInfoAreaUpper(null, "");
	    	infoAreaMiddle.setText("");
	
	    	
	    	infoAreaUpper.validate();
	    	infoAreaMiddle.validate();
	    	
	    	resetReference();
	    }



	/*protected void createFormulas(final BufferedReader rder){
		    	String line;
		    	StringBuffer  sb = new StringBuffer();
		    	if  (debug) System.out.println("starting  Formulas");
		    	
		    	while ( (line = readLine(rder)) != null) {
		    	//	if (debug)	System.out.println("formula "+line);
					if (line.startsWith("density_prefix")){
						line = line.substring(line.indexOf("=")+1);
						sb.append(line.trim());
						density_prefix = line.trim();
					//	System.out.println("density_prefix = " +line);
					}
					else if (line.startsWith("Formula")|| line.startsWith("formula")){
						line = line.substring(line.indexOf("=")+1);
						final StringTokenizer tk = new StringTokenizer(line,";");
						
						int formula_id;
						String formula_density, formula_formula;
						
						formula_id = Integer.parseInt(tk.nextToken().trim());
						formula_density = tk.nextToken().trim();
						if(tk.hasMoreTokens())
							formula_formula = tk.nextToken().trim();
						else formula_formula ="";
						
						panelInfo.addFormula(formula_id, formula_density, formula_formula);
					}else return;
					
		    	}
		    }*/
		  /*  protected void createNodes(final BufferedReader rder){
		    	String line;
		    	final StringBuffer  sb = new StringBuffer();
		    	//if (debug) System.out.println("starting  Nodes");
		    	
		    	while ( (line = readLine(rder)) != null) {
		    	//	if (debug) System.out.println("Node "+line);
					
		    		if (line.startsWith("url_prefix")){
						line = line.substring(line.indexOf("=")+1);
						sb.append(line.trim());
						node_url_prefix = line.trim();
					//	System.out.println("url_prefix = " +line);
					}else if (line.toLowerCase().startsWith("node")){
						line = line.substring(line.indexOf("=")+1);
						final StringTokenizer tk = new StringTokenizer(line,";");
					
						int node_id, type_count, node_formulaId;
						int node_types[];
						String[] node_keywords;
						int keyword_count;
						String node_name, node_url;
						String tk_last;
						int node_refId_count;
						int[] node_refIds;
		
						node_id = Integer.parseInt(tk.nextToken().trim());
						node_name = tk.nextToken().trim();
						String typeString = tk.nextToken().trim();
						StringTokenizer tk2 = new StringTokenizer(typeString,",");
						type_count= tk2.countTokens();
						node_types = new int[type_count];
						int i=0;
						while(tk2.hasMoreTokens()){
							node_types[i]= Integer.parseInt(tk2.nextToken().trim());
							i++;
						}
						
						
						node_formulaId= Integer.parseInt(tk.nextToken().trim());
						
						node_url = tk.nextToken().trim();
						//System.out.println("node url="+node_url);
						
						String keywordsString = tk.nextToken().trim();
						StringTokenizer tk3 = new StringTokenizer(keywordsString,",");
						keyword_count= tk3.countTokens();
						node_keywords = new String[keyword_count];
						i=0;
						while(tk3.hasMoreTokens()){				
							node_keywords[i]= tk3.nextToken().trim();
							i++;
						}
						
						try{
							
							tk_last = tk.nextToken();
							
							if(tk_last != null){
								StringTokenizer tk4 = new StringTokenizer(tk_last,",");
								node_refId_count= tk4.countTokens();
								node_refIds = new int[node_refId_count];
								i=0;
								while(tk4.hasMoreTokens()){				
									node_refIds[i]= Integer.parseInt(tk4.nextToken().trim());
									i++;
								}
							}
							else{ // no reference
								node_refId_count = 0;
								node_refIds= new int[1];
								node_refIds[0]= 0;
							}
						}catch(Exception e){// no reference
							node_refId_count = 0;
							node_refIds = new int[1];
							node_refIds[0] = 0;			
						}
						//System.out.println("Node =["+node_id+", "+node_name+", "+node_density+", "+node_url+"]");	
						//for (int j=0; j<type_count; j++)
						//	System.out.println(node_types[j]);
						panelInfo.addNode(node_id, node_name, type_count, node_types, node_formulaId, node_url, keyword_count, node_keywords, node_refId_count, node_refIds);
					}else return;
				}//while
		    }*/
		    
		   
		    
		   /* protected void createEdges(final BufferedReader rder){
		    	String line;
		    	//if (debug) System.out.println("starting  Edges");
		    	
		    	while ( (line = readLine(rder)) != null && !(line.toLowerCase().startsWith("["))) {
		    	//	if (debug) System.out.println("edge "+line);
					// if (line.startsWith("url_prefix")){
					//	line = line.substring(line.indexOf("=")+1);
					//	sb.append(line.trim());
					//	edge_url_prefix = line.trim();
						//System.out.println("url_prefix = " +line);
					//}else 
		    		
		    		if (line.toLowerCase().startsWith("edge") ){
						line = line.substring(line.indexOf("=")+1);
						final StringTokenizer tk = new StringTokenizer(line,";");
						
						int edge_id, edge_formulaId;
						String edge_name;
						int type_count, edge_from, edge_to;
						int edge_types[];
						String tk_last;
						int edge_refId_count;
						int[] edge_refIds;
						
						edge_id = Integer.parseInt(tk.nextToken().trim());
						edge_name = tk.nextToken().trim();
							
						String typeString = tk.nextToken().trim();
						StringTokenizer tk2 = new StringTokenizer(typeString,",");
						type_count= tk2.countTokens();
						edge_types = new int[type_count];
						int i=0;
						while(tk2.hasMoreTokens()){
							edge_types[i]= Integer.parseInt(tk2.nextToken().trim());
							i++;
						}
						
						edge_formulaId = Integer.parseInt(tk.nextToken().trim());
						
						edge_from = Integer.parseInt(tk.nextToken().trim());
						edge_to = Integer.parseInt(tk.nextToken().trim());
						try{
							
							tk_last = tk.nextToken();
							
							if(tk_last != null){
								StringTokenizer tk4 = new StringTokenizer(tk_last,",");
								edge_refId_count= tk4.countTokens();
								edge_refIds = new int[edge_refId_count];
								i=0;
								while(tk4.hasMoreTokens()){				
									edge_refIds[i]= Integer.parseInt(tk4.nextToken().trim());
									i++;
								}
							}
							else{
								edge_refId_count = 0;
								edge_refIds= new int[1];
								edge_refIds[0]=0;
							}
						}catch(Exception e){
							edge_refId_count = 0;
							edge_refIds= new int[1];
							edge_refIds[0]=0;			
						}	
						// this create panelInfo's nodes[] and edges[]
						panelInfo.addEdge(edge_from, edge_to, edge_id, edge_name, type_count, edge_types, edge_formulaId, edge_refId_count, edge_refIds);
					//	System.out.println("Edge =["+edge_name+" "+edge_from+ " "+edge_to+" ]");
						//for (int j=0; j<type_count; j++)
							//System.out.println(edge_types[j]);
						
					}
					else return;
				}//while
		    }*/
		    
		 /*   protected void createRefs(final BufferedReader rder){
		    	String line;
		    //	if (debug) System.out.println("starting  Refs");
		    	
		    	while ( (line = readLine(rder)) != null) {
		    	//	if (debug) System.out.println("ref "+line);
					if (line.toLowerCase().startsWith("ref")){
						line = line.substring(line.indexOf("=")+1);
						final StringTokenizer tk = new StringTokenizer(line,";");
						
						int id; 
						int author_count;
						String[] authors;
						String year;
						String title;
						String journal;
						String volumeInfo;
						String url;
						
						id = Integer.parseInt(tk.nextToken().trim());
						String authorsString = tk.nextToken().trim();
						//System.out.println("authors="+authorsString);
						StringTokenizer tk2 = new StringTokenizer(authorsString,",");
						author_count= tk2.countTokens();
						authors = new String[author_count];
						int i=0;
						while(tk2.hasMoreTokens()){
							authors[i]= tk2.nextToken().trim();
							i++;
						}
						
						year = tk.nextToken().trim();
						title = tk.nextToken().trim();
						journal = tk.nextToken().trim();
						volumeInfo = tk.nextToken().trim();
						url = tk.nextToken().trim();
		
						panelInfo.addRef(id, author_count, authors, year, title, journal, volumeInfo, url);			
					}else return;
		    	}//while
		    }*/
		    
		  /*  private BufferedReader startReaderBuffer(String fileName, URL codeBase){
				
				try{
					final InputStream in = (new URL(codeBase,fileName).openStream());
					final BufferedReader rder = new BufferedReader(new InputStreamReader(in));
					return rder;	
				}
				catch(final IOException e) {
		            e.printStackTrace();
					return null;
					}
			}
		    
		    private String readLine(final BufferedReader rder){
				String line = null;
				try {
		            while ( (line = rder.readLine()) != null) {
		                line.trim();
		                if (line.startsWith("#") || line.equals("")) continue;
						else {
							//System.out.println("reading:"+line);
							return line;}
					}
				} catch ( final IOException e) {
		            e.printStackTrace();
					return null;
		        }
				return line;
			}*/
		    
		    public void updateInfoAreaUpper(final URL url, String formula){
			
				try{
				//	System.out.println("url="+url.toString());
					BufferedImage image;
					if (url == null)
			    		 image = null;
					else image = ImageIO.read(url);
			
					infoAreaUpper.loadImage(image);
					infoAreaUpper.setFormula(formula);
					final Graphics g = infoAreaUpper.getGraphics();
					infoAreaUpper.update(g);
				}catch(final Exception e2){
					
					BufferedImage image = null; 		
					
					infoAreaUpper.loadImage(image);
					infoAreaUpper.setFormula(formula);
					final Graphics g = infoAreaUpper.getGraphics();
					infoAreaUpper.update(g);
					
				}
			}



	void resetReference(){
		infoAreaReference.removeAll();
		Graphics g = infoAreaReference.getGraphics();
		infoAreaReference.update(g);
	}

	public void resetNodeColor(){
		for (int i=0; i<panelInfo.getNodeCount(); i++){
    		Node node = graph.tgPanel.findNode(panelInfo.getNode(i).getId());
    		node.setHighlighted(false);
    	}
    	graph.tgPanel.repaint();
	}
	
	public void resetEdgeColor(){
		for (int i=0; i<panelInfo.getEdgeCount(); i++){    			  					
			Edge edge = findEdgeByIndex(i);
			edge.setHighlighted(false);
		}
		graph.tgPanel.repaint();
	}

	public int findNodeIndex(int id) {
		//System.out.println("looking for member id ="+id);
		for (int i = 0 ; i < panelInfo.getNodeCount(); i++) {
			if (panelInfo.getNode(i).getId() ==id) {	
				//System.out.println("found node " + panelInfo.getNode(i).cellId +" for id=" +id);
				if(panelInfo.getNode(i).getNodeIndex()!=i)
					panelInfo.getNode(i).setNodeIndex(i);
				return i;
			}
		}
		return -1;
	}


	public Edge findEdgeByIndex(int edgeIndex){
		int s_id = panelInfo.getEdge(edgeIndex).getSourceId();
		int t_id = panelInfo.getEdge(edgeIndex).getTargetId();
		Node s_node = graph.tgPanel.findNode(s_id);
		Node t_node = graph.tgPanel.findNode(t_id);
		return graph.tgPanel.findEdge(s_node, t_node);
	}
	
	public Node findNodeByIndex(int nodeIndex){
		return graph.tgPanel.findNode(panelInfo.getNode(nodeIndex).getId());
	}
	

	/*public void showNodeUpdate(){
		
		highlightNodeAndNeighbors();
	}*/
	
	public int addTGNode(SOCRNode node, Color bg){
		//System.out.println("ViewApplet adding node:"+node.toString()+" to cell "+panelInfo.nCells);
	
		//graph.addNode(node, bg);
		graph.addNode(node);
		return panelInfo.getNodeCount();   
	}


	public void addTGEdge(SOCREdge _edge){
		//_edge.print();
	//	System.out.println(_edge.getSourceId()+"->"+_edge.getTargetId());
		/*String sourceNodeName = panelInfo.nodes[findNodeIndex(_edge.getSourceId())].getDisplayName();
		String targetNodeName = panelInfo.nodes[findNodeIndex(_edge.getTargetId())].getDisplayName();
		graph.addEdge(_edge, sourceNodeName, targetNodeName);*/
		
		String sourceNodeId = Integer.toString(panelInfo.getNode(findNodeIndex(_edge.getSourceId())).getId());
		String targetNodeId = Integer.toString(panelInfo.getNode(findNodeIndex(_edge.getTargetId())).getId());
		Edge new_edge = graph.addEdge(_edge, sourceNodeId, targetNodeId);
		if (new_edge!=null)
			new_edge.setID(Integer.toString(_edge.getId()));
	}


	public void edgeSelected(){
		String st="";
		Edge edge = graph.tgPanel.getSelectEdge();
		String selectedEdgeID = edge.getID();
		if(debug)
			System.out.println("selectedEdgeId="+selectedEdgeID);
	//	Node s_node = edge.getFrom();
	//	Node t_node = edge.getTo();
  		
		panelInfo.pickEdge(Integer.parseInt(selectedEdgeID));
		
		highlightSingleEdge();
	
		infoAreaMiddle.setForeground(EdgeTextColor);
		if(isDebug())
			st = "edge["+panelInfo.pickedEdgeIndex+"]:"+panelInfo.getEdge(panelInfo.pickedEdgeIndex).getDisplayName()+":\n";
		else st = "Edge selected:\n\n\n"+panelInfo.getEdge(panelInfo.pickedEdgeIndex).getDisplayName()+":\n";
	
		if (panelInfo.getEdge(panelInfo.pickedEdgeIndex).getTypeCount()>0){
			for (int i= 0; i<panelInfo.getEdge(panelInfo.pickedEdgeIndex).getTypeCount(); i++)
				st+= "   "+ panelInfo.edgeType.getFullName(panelInfo.getEdge(panelInfo.pickedEdgeIndex).getType(i))+"\n";
		}
	
		try{
			String url = getEdgeFormulaImgURL(panelInfo.pickedEdgeIndex);
			
			URL wholeURL;
			if (url.indexOf("http")!=-1)
				wholeURL = new URL (url);
			else wholeURL = new URL (density_prefix+url);
			String f = getEdgeFormulaEquation(panelInfo.pickedEdgeIndex);
			updateInfoAreaUpper(wholeURL, f);
		
		}catch(final Exception e2){
			e2.printStackTrace();
		}
		
		infoAreaMiddle.setText("\n"+st);
		getEdgeReference(panelInfo.pickedEdgeIndex);
		Graphics g = infoAreaReference.getGraphics();
		infoAreaReference.update(g);
		infoPanel.validate();
		return;
}
	
	public void nodeSelected(){
		String st="";
	
		Node selectedNode = graph.tgPanel.getSelectNode();
		if(selectedNode == null)
			return;
		
		String selectedCellID = selectedNode.getID();
		String selectedCellName= panelInfo.getNode(findNodeIndex(Integer.parseInt(selectedCellID))).getDisplayName();
  		
		panelInfo.pickNode(selectedCellName);
		if (debug)
			System.out.println("selectedCellName"+selectedCellName+ " panelInfo.pickedNodeIndex"+panelInfo.pickedNodeIndex);
		
  	//	if (panelInfo.clickedType == HighLightedType.SINGLE_NODE){    // Node picked	
		resetEdgeColor();
  			
		infoAreaMiddle.setForeground(NodeTextColor);
		
		if (isDebug())
			st	= "node["+panelInfo.pickedNodeIndex+"]:"+panelInfo.getNode(panelInfo.pickedNodeIndex).getDisplayName()+":\n";
		else
			st	= "Node selected:\n\n\n"+panelInfo.getNode(panelInfo.pickedNodeIndex).getDisplayName()+":\n";
		for (int i=0; i<panelInfo.getNode(panelInfo.pickedNodeIndex).getTypeCount(); i++)
			st+= "   "+ panelInfo.nodeType.getFullName(panelInfo.getNode(panelInfo.pickedNodeIndex).getType(i))+"\n";
    
    		
		try{
    			//	String png = this.getCodeBase().toString() + "png/nodes/"+panelInfo.nodes[panelInfo.pickedNodeId].density;
    			//Image im = this.getImage(new URL(png));
    			//System.out.println("getting local png " + png);
			String url =getNodeFormulaImgURL(panelInfo.pickedNodeIndex) ;
    			
			URL wholeURL;
			if (url.indexOf("http")!=-1)
				wholeURL= new URL (url);
			else wholeURL= new URL (density_prefix+url);
			String f = getNodeFormulaEquation(panelInfo.pickedNodeIndex);
			updateInfoAreaUpper(wholeURL, f);
        	}catch(final Exception e2){
        		e2.printStackTrace();
        	}   
  	//	}
  		
  		infoAreaMiddle.setText("\n"+st);
    	getNodeReference(panelInfo.pickedNodeIndex);
    	Graphics g = infoAreaReference.getGraphics();
		infoAreaReference.update(g);
		infoPanel.validate();
		return;
	}

	//Jenny
	/*public void mouseClicked(final MouseEvent e) {
	
		String st="";
		CellView cell = graph.getNextSelectableViewAt(null, e.getX(), e.getY());
		
		String selectedCellName= "";
	
	   	 if (cell!=null){
	   		selectedCellName=cell.getCell().toString();
	   		 if (selectedCellName.length()==0){
	   			 final DefaultEdge pickedEdge = (DefaultEdge)(cell.getCell());  		 
	   			 panelInfo.pickEdge(pickedEdge.getUserObject()); 
	   			
	   			if(isDebug()) System.out.println("edge picked");
	   		 }else {
	   			 panelInfo.pickNode(selectedCellName);
	   			 Rectangle2D bounds= cell.getBounds();
	   			 double x = bounds.getMinX();
	   			 double y = bounds.getMinY();
	   			 panelInfo.nodes[panelInfo.pickedNodeIndex].setX(x);
	   			 panelInfo.nodes[panelInfo.pickedNodeIndex].setY(y);
	   			if(isDebug()) System.out.println("node picked");
	   		 }
	   		 
	   		isWhiteSpacePicked= false;
	   	 }
	   	 else {
	   		if(isDebug()) System.out.println("whiteSpace picked");
	   		 isWhiteSpacePicked= true;
	   	 }
	   	 
	   //	 if (e.isControlDown() ){
	//		System.out.println("mouse control down +"+e.getButton());
	//	}
		
	   	 
	   	 if (!isWhiteSpacePicked){
	    	if (panelInfo.clickedType == HighLightedType.SINGLE_NODE){    // Node picked		
	    		infoAreaMiddle.setForeground(NodeTextColor);
	    		if (isDebug())
	    			st	= "node["+panelInfo.pickedNodeIndex+"]:"+panelInfo.nodes[panelInfo.pickedNodeIndex].getDisplayName()+":\n";
	    		else
	    			st	= panelInfo.nodes[panelInfo.pickedNodeIndex].getDisplayName()+":\n";
	    		for (int i=0; i<panelInfo.nodes[panelInfo.pickedNodeIndex].getTypeCount(); i++)
	    			st+= "   "+ panelInfo.nodeType.getFullName(panelInfo.nodes[panelInfo.pickedNodeIndex].getType(i))+"\n";
	    
	    		
	    		try{
	    			//	String png = this.getCodeBase().toString() + "png/nodes/"+panelInfo.nodes[panelInfo.pickedNodeId].density;
	    			//Image im = this.getImage(new URL(png));
	    			//System.out.println("getting local png " + png);
	    			String url =getNodeFormulaImgURL(panelInfo.pickedNodeIndex) ;
	    			
	    			URL wholeURL;
	    			if (url.indexOf("http")!=-1)
	    				wholeURL= new URL (url);
	    			else wholeURL= new URL (density_prefix+url);
	    			String f = getNodeFormulaEquation(panelInfo.pickedNodeIndex);
	        		updateInfoAreaUpper(wholeURL, f);
	        	}catch(final Exception e2){
	        		e2.printStackTrace();
	        	}   
	        	
	        	 // taking care of node clik here: control_click-> zoom in, double click ->open link, otherwise --> highlight node
		    	
		    	int mouseButton = e.getButton();
				if (mouseButton == MouseEvent.BUTTON3 ||e.isMetaDown() && panelInfo.clickedType == HighLightedType.SINGLE_NODE ) {
						System.out.println("mouse button3 right click");
					
				}else if (mouseButton == MouseEvent.BUTTON1 && e.isControlDown() ) { // ctrl+mouse focus on the clicked node
					zoominAt(cell, 2*graph.getScale());			
				}
				
		
				// open link when double clicked
		    	int clickcount = e.getClickCount(); 
		    	if  (clickcount == 2 && panelInfo.clickedType == HighLightedType.SINGLE_NODE ) {
		    		try {		
		    			String url = panelInfo.nodes[panelInfo.pickedNodeIndex].getUrl();
		    			if (url.indexOf("http")!=-1)
		    				showURL(url, "Node_url");
		    			else showURL(node_url_prefix+url, "Node_url");
					
					} catch (Exception ex) {
						ex.printStackTrace();
					}
		    	}else {
		    		if (clickcount == 1 && panelInfo.clickedType == HighLightedType.SINGLE_NODE  && !isWhiteSpacePicked){  //highlight the picked cell, 
		    			highlightNodeAndNeighbors();
		    		}
		    	}
		    	
	        	infoAreaMiddle.setText("\n"+st);
	        	getNodeReference(panelInfo.pickedNodeIndex);
	        	Graphics g = infoAreaReference.getGraphics();
				infoAreaReference.update(g);
				infoPanel.validate();
				return;
	    	}else{//Edge picked
	    		//System.out.println("ViewerPanel picked edge id = "+panelInfo.pickedEdgeId);
	    		highlightSingleEdge();
	    		infoAreaMiddle.setForeground(EdgeTextColor);
	    		if(isDebug())
	    			st = "edge["+panelInfo.pickedEdgeIndex+"]:"+panelInfo.getEdge(panelInfo.pickedEdgeIndex).getDisplayName()+":\n";
	    		else st = panelInfo.getEdge(panelInfo.pickedEdgeIndex).getDisplayName()+":\n";
	    		
	    		if (panelInfo.getEdge(panelInfo.pickedEdgeIndex).getTypeCount()>0){
	    			for (int i= 0; i<panelInfo.getEdge(panelInfo.pickedEdgeIndex).getTypeCount(); i++)
	    				st+= "   "+ panelInfo.edgeType.getFullName(panelInfo.getEdge(panelInfo.pickedEdgeIndex).getType(i))+"\n";
	    		}
	    		
	    		try{
	    			String url = getEdgeFormulaImgURL(panelInfo.pickedEdgeIndex);
	    			
	    			URL wholeURL;
	    			if (url.indexOf("http")!=-1)
	    				wholeURL = new URL (url);
	    			else wholeURL = new URL (density_prefix+url);
	    			String f = getEdgeFormulaEquation(panelInfo.pickedEdgeIndex);
	        		updateInfoAreaUpper(wholeURL, f);
	        	
	        	}catch(final Exception e2){
	        		e2.printStackTrace();
	        	}
	        	
	        	infoAreaMiddle.setText("\n"+st);
	        	getEdgeReference(panelInfo.pickedEdgeIndex);
	        	Graphics g = infoAreaReference.getGraphics();
				infoAreaReference.update(g);
				infoPanel.validate();
				return;
	    	}
	   	 }else {//whiteSpace picked
	   		
	   		 updateInfoAreaUpper(null, "");
	   		 panelInfo.clickedType = HighLightedType.NONE;
	   		 clearInfoAreas();
	   		 resetNodeColor();
	   		 resetEdgeColor();
	   		 
	   		 infoPanel.validate();
	   		 return;
	   	 }
	
	}*/


	/** KeyListener implementation - for search field
     * 
     */
    public void keyPressed( KeyEvent e) {
    	
    	
	    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
		    //System.out.println("enter    search term: " + searchTerm);
		    textEntry.setText(""); // clear
	    }
	    /*
	    if(e.getKeyCode() == KeyEvent.VK_1){
	    	//System.out.println("1 pressed panel.pickedNodeId="+panel.pickedNodeId);
	    	//panel.nodes[panel.pickedNodeId].showDensity = true;
	    	
			try{
					//	URL url = new URL (node_density_prefix+panel.nodes[panel.pickedNodeId].density);
					
						final AppletContext a = this.getAppletContext();
					//	a.showDocument(url, "Node_density");
			}catch(final Exception ex){
				ex.printStackTrace();
			}
			
	    }else if(e.getKeyCode() == KeyEvent.VK_2){
	    //	System.out.println("2 pressed panel.pickedNodeId="+panel.pickedNodeId);
	    //	panel.nodes[panel.pickedNodeId].showURL = true;
	    	
			try{
					//	URL url = new URL (node_url_prefix+panel.nodes[panel.pickedNodeId].url);
						
						final AppletContext a = this.getAppletContext();
				//		a.showDocument(url, "Node_url");
			}catch(final Exception ex){
				ex.printStackTrace();
			}
			
	    }else if(e.getKeyCode() == KeyEvent.VK_3){
		    //	System.out.println("3 pressed panel.pickedNodeId="+panel.pickedNodeId);
		    //	panel.nodes[panel.pickedNodeId].showType = true;
		    	graphPanel.repaint();
		    }
	    else if(e.getKeyCode() == KeyEvent.VK_4){
	    	try{
		    //	System.out.println("4 pressed panel.pickedNodeId="+panel.pickedNodeId);
	 //   	URL url = new URL (edge_url_prefix+panel.edges[panel.pickedEdgeId].url);
	    	final AppletContext a = this.getAppletContext();
			//a.showDocument(url, "Edge_url");
	    	}catch(final Exception ex){
				ex.printStackTrace();
			}
	    	
	    }*/
    }
    
    /** keyListener implement
     * 
     */
    public void keyReleased(KeyEvent e) {
    	  boolean atLeastOne = false;
  	    int stIndex = 0;
  	    
  		/*if (e.isControlDown()){
      	//	System.out.println("control down:"+e.getKeyCode());
      		if(e.getKeyCode()==61 || e.getKeyCode()==107){ //ctrl+
      			if (graph.getScale()<6)
      				graph.setScale(1.5* graph.getScale());
      		}
      		else if(e.getKeyCode()==45 || e.getKeyCode()==109){ //ctrl-
      			if (graph.getScale()>0.15)
      			graph.setScale(graph.getScale()/1.5);
      		}
      		else if(e.getKeyCode()==KeyEvent.VK_ENTER){ //ctrl return
      			graph.setScale(1.0);
      			displayInitInfo();
      		}
      		
      		return;
      	}*/
      	
  	    
  	   // if (debug) System.out.println(e.getKeyCode());
  	    if (e.getKeyCode() == KeyEvent.VK_BACK_SPACE){
  	    	//if (debug)	System.out.println("backspace searchterm length="+searchTerm.length());
  	    	 if (searchTerm.length() > 1) {
  			      searchTerm = searchTerm.substring(0, searchTerm.length()-2); // remove last 2 char
  			      stIndex = searchTerm.length(); // end index
  			    }
  	    	 else {
  	    		 searchTerm = "";
  	    		 stIndex = 0;
  	    	 }
  	    	// System.out.println("***searchTerm*** " + searchTerm);
  	    	return;
  	    }
  	    
  	    if (e.getKeyCode() == KeyEvent.VK_ENTER) {  // user clicks enter
  		    if (isDebug())
  		    	System.out.println("searchTerm*** " + searchTerm);
  		    if (searchTerm.length() >1) {
  		      searchTerm = searchTerm.toLowerCase().substring(0, searchTerm.length()-1); // remove CR
  		      stIndex = searchTerm.length(); // end index
  		    }else {
  		    	 highlightSearchResult(atLeastOne); //atLeastOne = false;
  		    	return;//empty searchterm
  		    }
  		    
  		    if (isDebug()) System.out.println(">>" + searchTerm + "<>" + stIndex + "<    " + substringCheck);
  		      
  		    // need to clear screen and show only this searchTerm before clearing (HERE)
  		   for (int i = 0; i < panelInfo.getNodeCount(); i++) {
  			   String nodeName = panelInfo.getNode(i).getDisplayName();
  			    if (substringCheck && nodeName.length() > stIndex && searchTerm.length()>1) {  // wildcard search
  			    //	System.out.println("wildcard search" +panelInfo.getNode(i).getDisplayName());
  			    	
  				//   String mem = panelInfo.getNode(i).getDisplayName().toLowerCase().substring(0,stIndex);
  				 //   System.out.println("mem: " + mem);
  				    
  				 //   if (searchTerm.equals(mem)){
  					    //System.out.println("true: " + panel.nodes[i].lbl);
  					    
  				//	    panelInfo.getNode(i).showFlag = 2;
  				//	    atLeastOne = true;
  				//    } else {
  				//	    panelInfo.getNode(i).showFlag = 1;
  				//    }
  			    	
  			    	if (nodeName.toLowerCase().indexOf(searchTerm)!=-1){
  					    panelInfo.getNode(i).showFlag = TGViewerPanelInfo.Highlighted;
  					    atLeastOne = true;
  				    } else {
  					    panelInfo.getNode(i).showFlag = TGViewerPanelInfo.Normal;
  				    }
  				    
  			    } else { // not wildcard search - perfect search
  			    //	System.out.println("perfect search");
  				    if (searchTerm.equals(panelInfo.getNode(i).getDisplayName().toLowerCase())) {
  					    panelInfo.getNode(i).showFlag = TGViewerPanelInfo.Highlighted;
  					    atLeastOne = true;
  					    //System.out.println("true: " + panel.nodes[i].lbl);
  				    } else {
  					    panelInfo.getNode(i).showFlag = TGViewerPanelInfo.Normal;
  					    //System.out.println("false: " + panel.nodes[i].lbl);
  				    }
  			    }
  		    }  //for
  		    
  		    // these messages could be fixed, working for now
  		    if (atLeastOne == false) {  // if search fails
  		    	
  			  //  for (int i = 0; i < 50; i++) { // arbitrary display, keep small, rather than show all
  			//	    panel.nodes[i].on = true;
  			//    } 
  			    
  			    if (wildCard == false) {
  				    textEntry.setText("No Match"); 
  			    } else {
  				    textEntry.setText("Try Again");
  			    }
  			  
  			   try {
  				    Thread.sleep(500); // pause 500 ms so you can see the message
  			   } catch (final InterruptedException exc) {
  				    System.out.println("interrupt error");
  			   }
  			   
  		    }
  		    
  		    highlightSearchResult(atLeastOne);
  		    
  		   searchTerm = ""; // reset 
  		   textEntry.setText(""); // clear
  		   //wildCard = false; // reset
  		   //substringCheck = false;
  		   atLeastOne = false;
  		   //System.out.println("reset");
  	    }
    }
 
    /**keyListener
     * 
     */
    public void keyTyped(KeyEvent e) {	
    
	    if (searchTerm.length() < MAXSEARCHLENGTH) {
		    if (e.getKeyChar() != '*') {  //asterisk check - wildcard symbol
			    searchTerm += Character.toString(e.getKeyChar()); // convert char to String
			  //  System.out.println(">>" + searchTerm);
		    } else {
			   // System.out.println("deal with wildcard case : " + searchTerm.length());
			    wildCard = true;
			    
			    if (searchTerm.length() > 0) {   // single asterisk turns on all members
				    substringCheck = true;
			    }
			   
		    }
	    } else { // entry exceeds limit
		    //System.out.println("too big");
		    textEntry.setText("Bad Entry");
		     try {
				    Thread.sleep(1000); // pause 100 ms so you can see the message
		     } catch (final InterruptedException exc) {
				    System.out.println("interrupt error");
		     }
		     
		      textEntry.setText("Hit Return");
		      try {
				    Thread.sleep(1000); // pause 1 sec so you can see the message
		     } catch (final InterruptedException exc) {
				    System.out.println("interrupt error");
		     }
		     
		    searchTerm = "";
	    }
    }
    
  
 
    public void showNeighbor(){
    	if (isDebug()) System.out.println("showNeighbor get called level=" +panelInfo.neighbor_level);
    	
    	int pickedNodeIndex= panelInfo.pickedNodeIndex;
    	if(pickedNodeIndex<0)
    		return;
    	
    	//int pickedNodeId= panelInfo.getNode(pickedNodeIndex).getId();
   
    	// clean up ex_picked   	
    	for(int i=0; i<panelInfo.getNodeCount(); i++)
    		panelInfo.getNode(i).showFlag = TGViewerPanelInfo.Normal;
    	
    	if (isDebug())
    		System.out.println("showNeighbor, pickedNodeIndex="+pickedNodeIndex);
    //	panelInfo.nodes[pickedNodeId].setLevel(panelInfo.neighbor_level);
		panelInfo.getNode(pickedNodeIndex).showFlag = TGViewerPanelInfo.Highlighted;

		showParents(pickedNodeIndex);
		showChildren(pickedNodeIndex);
		showBoth(pickedNodeIndex);
    	
    }
    
    public void showBoth(int pickedNodeIndex){
    	if(panelInfo.neighbor_level == TGViewerPanelInfo.ShowBoth){ //show both
	    	for(int i=0; i<panelInfo.getEdgeCount(); i++){
	    		int sourceNodeId = panelInfo.getEdge(i).getSourceId();
	    		int targetNodeId = panelInfo.getEdge(i).getTargetId();
	    		int sourceNodeIndex = findNodeIndex(sourceNodeId); 
				int targetNodeIndex = findNodeIndex(targetNodeId);  
	    		
	    			if (findNodeIndex(panelInfo.getEdge(i).getSourceId())==pickedNodeIndex){
		    			
		    			if(panelInfo.getNode(targetNodeIndex).showFlag == TGViewerPanelInfo.HighlightAsParent)
		    					panelInfo.getNode(targetNodeIndex).showFlag = TGViewerPanelInfo.HighlightAsBoth;
		    			else panelInfo.getNode(targetNodeIndex).showFlag =  TGViewerPanelInfo.HighlightAsChild ;
	    			}
	    			if (findNodeIndex(panelInfo.getEdge(i).getTargetId()) == pickedNodeIndex){
		    		
		    			if(panelInfo.getNode(sourceNodeIndex).showFlag== TGViewerPanelInfo.HighlightAsChild)
		    					panelInfo.getNode(sourceNodeIndex).showFlag = TGViewerPanelInfo.HighlightAsBoth;
		    			else panelInfo.getNode(sourceNodeIndex).showFlag = TGViewerPanelInfo.HighlightAsParent;
	    			}
	    		}
    	}
    }
    
    public void showParents(int pickedNodeIndex){
    	if(panelInfo.neighbor_level == TGViewerPanelInfo.ShowParent){ //show parent  		
	    	for(int i=0; i<panelInfo.getEdgeCount(); i++){
	    	
	    		int sourceNodeId = panelInfo.getEdge(i).getSourceId();
	    		int targetNodeId = panelInfo.getEdge(i).getTargetId();
	    		int sourceNodeIndex = findNodeIndex(sourceNodeId); 
				int targetNodeIndex = findNodeIndex(targetNodeId);  
			    			
				if (targetNodeIndex==pickedNodeIndex){	    			
					panelInfo.getNode(sourceNodeIndex).showFlag = TGViewerPanelInfo.HighlightAsParent;	    			
				}  /* else if (sourceNodeIndex==pickedNodeIndex){	    			 	
		    			if(panelInfo.nodes[targetNodeIndex].showFlag!=panelInfo.HighlightAsParent) 
		    				panelInfo.nodes[targetNodeIndex].showFlag = panelInfo.Normal;
	    			}*/
	    						
	    		}
    	}
    }
    
    public void showChildren(int pickedNodeIndex){
    	if(panelInfo.neighbor_level==TGViewerPanelInfo.ShowChildren){ //show children
	    	for(int i=0; i<panelInfo.getEdgeCount(); i++){
	        	
	    		int sourceNodeId = panelInfo.getEdge(i).getSourceId();
	    		int targetNodeId = panelInfo.getEdge(i).getTargetId();
	    		int sourceNodeIndex = findNodeIndex(sourceNodeId); 
				int targetNodeIndex = findNodeIndex(targetNodeId);  
			
				if (sourceNodeIndex==pickedNodeIndex){  			
					panelInfo.getNode(targetNodeIndex).showFlag = TGViewerPanelInfo.HighlightAsChild;		    			
	    			}/*else if (findNodeIndex(panelInfo.getEdge(i).getTargetId())==pickedNodeIndex){
		    			if (panelInfo.nodes[sourceNodeIndex].showFlag!=panelInfo.HighlightAsChild)
		    				panelInfo.nodes[sourceNodeIndex].showFlag = panelInfo.Normal;
	    			}*/
	    			
	    		}
    	}
    }
    
    
    public void hideNeighbor(){
    	if (isDebug()) System.out.println("hideNeighbor get called level=" +panelInfo.neighbor_level);
    	int pickedNodeIndex= panelInfo.pickedNodeIndex;
    	if(pickedNodeIndex<0)
    		return;
    
		panelInfo.getNode(pickedNodeIndex).showFlag = TGViewerPanelInfo.Highlighted;		
		
    	for(int i=0; i<panelInfo.getEdgeCount(); i++){
    		int targetNodeIndex = findNodeIndex(panelInfo.getEdge(i).getTargetId());
    		int sourceNodeIndex = findNodeIndex(panelInfo.getEdge(i).getSourceId());
    		if (sourceNodeIndex==pickedNodeIndex){
    			
    			panelInfo.getNode(targetNodeIndex).showFlag = TGViewerPanelInfo.Normal;
    		}
    		
    		if (targetNodeIndex==pickedNodeIndex){
    			panelInfo.getNode(sourceNodeIndex).showFlag = TGViewerPanelInfo.Normal;
    		}
    	}
    
    }
  
    /** ActionListener implementation method
	 * 
	 */
	public void actionPerformed(ActionEvent e) {
		Object src = e.getSource();
		
		if (e.getSource() instanceof JComboBox) {
	        JComboBox JCB = (JComboBox) e.getSource();
	        String JCB_Value = (String) JCB.getSelectedItem();
	      //  System.out.println("actionPerformed : "+JCB_Value);   
	      
	        
	       if (src == zoom_level){
	        	//System.out.println("ActionPerformed zoom="+JCB_Value);   
	        	if(JCB_Value.equalsIgnoreCase(ZoomReset)){
	        		graph.setZoomValue(25);
	        		
	        	}else if(JCB_Value.equalsIgnoreCase(ZoomIn)){
	        		//System.out.println("zoom in "+graph.getZoomValue());
	        		if(graph.getZoomValue()<=1)
	        			graph.setZoomValue(25);
	        		else
	        			graph.setZoomValue(graph.getZoomValue()*2);
	            	}
	        	else if(JCB_Value.equalsIgnoreCase(ZoomOut)){
	        		//System.out.println("zoom out "+graph.getZoomValue());
	        		if(graph.getZoomValue()<2)
	        			graph.setZoomValue(2);
	        		graph.setZoomValue(graph.getZoomValue()/2);
	        	}
	        	graph.tgPanel.repaintAfterMove();
	        	return;
	        }else if (src == neighbor_level){
	        	if(JCB_Value.equalsIgnoreCase(HideNeighbor)){
	        		if(isDebug()) System.out.println("setting neighbor_level=0");
	        		panelInfo.neighbor_level=TGViewerPanelInfo.HideNeighbor;	        		
	        		highlightNodeAndNeighbors();
	        		return;
	        	}else if(JCB_Value.equalsIgnoreCase(ShowParent)){
	        		if(isDebug()) System.out.println("setting neighbor_level=1");
	        		panelInfo.neighbor_level=TGViewerPanelInfo.ShowParent;        		       		
	        		highlightNodeAndNeighbors();// this will call showNeighbor();
	        		return;
	        	}
	        	else if(JCB_Value.equalsIgnoreCase(ShowChildren)){
	        		if(isDebug()) System.out.println("setting neighbor_level=2");
	        		panelInfo.neighbor_level=TGViewerPanelInfo.ShowChildren;	        		       		
	        		highlightNodeAndNeighbors();// this will call showNeighbor();
	        		return;
	        	}else if(JCB_Value.equalsIgnoreCase(ShowBoth)){
	        		if(isDebug()) System.out.println("setting neighbor_level=3");
	        		panelInfo.neighbor_level=TGViewerPanelInfo.ShowBoth;        		       		
	        		highlightNodeAndNeighbors();// this will call showNeighbor();
	        		return;
	        	}
	        }else  if (src == highlightNodeColorChoice) {
	        	//System.out.println("ActionPerformed node type="+JCB_Value);  
	        	 
	        	if(JCB_Value.equalsIgnoreCase("HighlightNodeType")){
	        		highlightNodeType(-1);
	        		return;
	        	}
				for (int i=0; i<panelInfo.nodeType.getTypeCount(); i++){
					if(JCB_Value.equalsIgnoreCase(panelInfo.nodeType.getFullName(i))){
						highlightNodeType(i);
						return;
					}
				}
				return;
			}else if (src == highlightEdgeColorChoice) {
	        	//System.out.println("ActionPerformed edge type="+JCB_Value); 
	        	if(JCB_Value.equalsIgnoreCase("HighlightEdgeType")){
	        		highlightEdgeType(-1);
	        		return;
	        	}
				for (int i=0; i<panelInfo.edgeType.getTypeCount(); i++){
					if(JCB_Value.equalsIgnoreCase(panelInfo.edgeType.getFullName(i))){
						highlightEdgeType(i);
						return;
						}
				}
				return;
			}
	        
	        return;
		}
	
		// refresh button handling
		if (src == refreshButton) { 
			if (isDebug()) System.out.println("refresh clicked");
			
			resetControlPanel();
			
			graph.tgPanel.selectFirstNode();
			graph.getHVScroll().slowScrollToCenter(graph.tgPanel.getSelectNode());
			//nodeSelected();
			return;
		}
		
		if (src == toggleButton) { 
			graph.toggleButtonHandler();
		}
	}


	public void doubleClickedWhitespace(){
    	
    }
    public void doubleClickedNode(){
    	openDistributiOnLine();
    }
  
    public void openDistributiOnLine(){
    	//System.out.println("openDistributin get called");
	    try {		
			String url = panelInfo.getNode(panelInfo.pickedNodeIndex).getUrl();
			if (url.indexOf("http")!=-1)
				showURL(url, "Node_url");
			else showURL(node_url_prefix+url, "Node_url");
		
		} catch (Exception ex) {
			ex.printStackTrace();
		}
    }
    // highlight just one node and its neighbors if needed
    public void highlightNodeAndNeighbors(){
    	
    /*	if(panelInfo.highlightedType == HighLightedType.SINGLE_NODE || 			
    			panelInfo.highlightedType == HighLightedType.NODE_GROUP) // single node or search result
    		resetNodeColor();
    	if(panelInfo.highlightedType == HighLightedType.NODE_TYPE){
    		resetNodeColor();
    		highlightNodeColorChoice.setSelectedIndex(0);
    	}
    			
    	if(panelInfo.highlightedType==HighLightedType.EDGE_TYPE){
    		resetEdgeColor();
    		highlightEdgeColorChoice.setSelectedIndex(0);
    	}*/
    	resetNodeColor();
    	resetEdgeColor();
    	if(highlightNodeColorChoice.getSelectedIndex()!=0)
    		highlightNodeColorChoice.setSelectedIndex(0);
    	if(highlightEdgeColorChoice.getSelectedIndex()!=0)
		highlightEdgeColorChoice.setSelectedIndex(0);
		
    	if (isDebug()) System.out.println("highlightSingleNode pickedNodeIndex= "+panelInfo.pickedNodeIndex);
    	//panelInfo.highlightedType=HighLightedType.SINGLE_NODE;
    	
    	nodeSelected(); //highlight self and display info  	
		
		//highlight neighbors
		if (isDebug()) System.out.println("neighbor_lever="+panelInfo.neighbor_level);
		if (panelInfo.neighbor_level!=0)
			showNeighbor();
		else
			hideNeighbor();
		
		for (int i=0; i<panelInfo.getNodeCount(); i++){
			Node node = findNodeByIndex(i);
			if (i!= panelInfo.pickedNodeIndex  && panelInfo.getNode(i).showFlag == TGViewerPanelInfo.HighlightAsParent){
				node.setHighlightedAsParent(true);
				
				if(isDebug())
					System.out.println("highlighting parent:"+panelInfo.getNode(i).getDisplayName());
			}
			else if (i!= panelInfo.pickedNodeIndex  && panelInfo.getNode(i).showFlag == TGViewerPanelInfo.HighlightAsChild){
				node.setHighlightedAsChild(true);
				if(isDebug())
					System.out.println("highlighting  child:"+panelInfo.getNode(i).getDisplayName());
			}
			else if (i!= panelInfo.pickedNodeIndex  && panelInfo.getNode(i).showFlag == TGViewerPanelInfo.HighlightAsBoth){
				node.setHighlightedAsBoth(true);
				if(isDebug())
					System.out.println("highlighting both:"+panelInfo.getNode(i).getDisplayName());
			}
		}

    }
    
    public void highlightSearchResult(boolean atleastOne){
    	clearInfoAreas();
    
    	resetNodeColor();
    	resetEdgeColor();
    	if(highlightNodeColorChoice.getSelectedIndex()!=0)
    		highlightNodeColorChoice.setSelectedIndex(0);
    	if(highlightEdgeColorChoice.getSelectedIndex()!=0)
		highlightEdgeColorChoice.setSelectedIndex(0);
    	
		if(!atleastOne)   		
    		return;
    
    	
    	
    /*	if(panelInfo.highlightedType==HighLightedType.SINGLE_NODE || 			
    			panelInfo.highlightedType==HighLightedType.NODE_GROUP)
    		resetNodeColor();
    	if(panelInfo.highlightedType==HighLightedType.NODE_TYPE){
    		resetNodeColor();
    		highlightNodeColorChoice.setSelectedIndex(0);
    	}  			
    	if(panelInfo.highlightedType==HighLightedType.EDGE_TYPE){
    		resetEdgeColor();
    		highlightEdgeColorChoice.setSelectedIndex(0);
    	}
    	panelInfo.highlightedType = HighLightedType.NODE_GROUP;
    	*/
		
    	
    	//groupSelected = true;

    	for (int i=0; i<panelInfo.getNodeCount(); i++){
    		Node node = findNodeByIndex(i);
    		if (panelInfo.getNode(i).showFlag == TGViewerPanelInfo.Highlighted)		
    				node.setHighlighted(true);
    	}
    	graph.tgPanel.repaint();
    	
    	return;
    }
    
    public void highlightNodeType(int typeId){
    	if (isDebug()) System.out.println("highlightNodeType="+typeId);
    	clearInfoAreas();
    	
    /*	if(panelInfo.highlightedType==HighLightedType.SINGLE_NODE || 
    			panelInfo.highlightedType==HighLightedType.NODE_TYPE ||
    			panelInfo.highlightedType==HighLightedType.NODE_GROUP)
    		resetNodeColor();
    	if(panelInfo.highlightedType==HighLightedType.EDGE_TYPE){
    		resetEdgeColor();
    		highlightEdgeColorChoice.setSelectedIndex(0);
    	}
    	panelInfo.highlightedType = HighLightedType.NODE_TYPE;*/
    	resetNodeColor();
    	graph.tgPanel.clearSelectNode();
    	resetEdgeColor();
    	graph.tgPanel.clearSelectEdge();
		highlightEdgeColorChoice.setSelectedIndex(0);
		
    	if (typeId==-1){   
    		return;
    	}
    	
    	boolean highlight=false;
    	int count=0;
    	for (int i=0; i<panelInfo.getNodeCount(); i++){
    		highlight=false;
    	
    		if (panelInfo.getNode(i).getTypeCount()!=0){
    			for (int j=0; j<panelInfo.getNode(i).getTypeCount(); j++)
    				if (panelInfo.getNode(i).getType(j)==typeId) { 			
    					highlight = true;
    					count++;
    				}
    		//Jenny	
    			Node node = graph.tgPanel.findNode(panelInfo.getNode(i).getId());
        		if (highlight)		
        				node.setHighlighted(true);
        		else node.setHighlighted(false);
         			
    		}
    	}
    	
    	infoAreaMiddle.setForeground(NodeTextColor);
    	infoAreaMiddle.setText("\n Node type: "+(String)highlightNodeColorChoice.getSelectedItem()+" is selected.\n"+" Found "+count+".");
    	
    	return;
    }
    
    public void highlightSingleEdge(){
    	if (isDebug()) 	System.out.println("highlight single edge!");
    	
    	/*if(panelInfo.highlightedType==HighLightedType.SINGLE_NODE || 			
    			panelInfo.highlightedType==HighLightedType.NODE_GROUP)
    		resetNodeColor();
    	if(panelInfo.highlightedType==HighLightedType.NODE_TYPE){
    		resetNodeColor();
    		highlightNodeColorChoice.setSelectedIndex(0);
    	}*/
    			
    	resetNodeColor();
    	graph.tgPanel.clearSelectNode();
    	if(highlightNodeColorChoice.getSelectedIndex()!=0)
    		highlightNodeColorChoice.setSelectedIndex(0);
    	resetEdgeColor();
    	if(highlightEdgeColorChoice.getSelectedIndex()!=0)
    		highlightEdgeColorChoice.setSelectedIndex(0);
    	/*if(panelInfo.highlightedType==HighLightedType.EDGE_TYPE){
    		resetEdgeColor();
    	}
    	panelInfo.highlightedType = HighLightedType.SINGLE_EDGE;*/
    	
    	//edge highlight has been takend of by JGraph
    }
    
    public void highlightEdgeType(int typeId){
    	if (isDebug()) 	System.out.println("highlightEdgeType="+typeId);
    	
    	clearInfoAreas();
    	
   /* 	if(panelInfo.highlightedType==HighLightedType.SINGLE_EDGE || 
    			panelInfo.highlightedType==HighLightedType.EDGE_TYPE )
    		
    	if(	panelInfo.highlightedType==HighLightedType.NODE_GROUP||
    			panelInfo.highlightedType==HighLightedType.SINGLE_NODE){
    		
    	}
    	if(panelInfo.highlightedType==HighLightedType.NODE_TYPE)
    		highlightNodeColorChoice.setSelectedIndex(0);  // this will triggle resetNodeColor in actionPerfomed
    	
    	panelInfo.highlightedType = HighLightedType.EDGE_TYPE;
    	*/
    	resetEdgeColor();
    	graph.tgPanel.clearSelectEdge();
    	resetNodeColor();
    	graph.tgPanel.clearSelectNode();
    	if(highlightNodeColorChoice.getSelectedIndex()!=0)
    		highlightNodeColorChoice.setSelectedIndex(0);
    	
    	if (typeId==-1){   
    		resetEdgeColor();
    		return;
    	}
  
    	boolean highlight=false;
 
    	int count =0;
    	for (int i=0; i<panelInfo.getEdgeCount(); i++){
    		highlight=false;
    	
    		if (panelInfo.getEdge(i).getTypeCount()!=0){
    			for (int j=0; j<panelInfo.getEdge(i).getTypeCount(); j++)
    				if (panelInfo.getEdge(i).getType(j)==typeId) { 			
    					highlight = true;
    					count++;
    				}   		
    			
    			Edge edge = findEdgeByIndex(i);
    			if(highlight)
    				edge.setHighlighted(true);
    			else edge.setHighlighted(false);
    		}
    	}
 
    	infoAreaMiddle.setForeground(EdgeTextColor);
    	infoAreaMiddle.setText("\n Edge type: "+(String)highlightEdgeColorChoice.getSelectedItem()+" is selected.\n " +" Found "+count+".");
    	
    	graph.tgPanel.repaint();
    	
    	return;
    	
    }
    
    String getEdgeFormulaEquation(int pickedEdgeIndex){
		String formula = ""; 
		int f_id = panelInfo.getEdge(pickedEdgeIndex).getFormulaId();
		//System.out.println("getting formula id "+f_id);
		for(int i =0 ;i<panelInfo.getFormulaCount(); i++)
			if (panelInfo.getFormula(i).getId()==f_id){
				formula = panelInfo.getFormula(i).getEquation();
				return formula;
			}
		return "";		
		}
	
	String getNodeFormulaEquation(int pickedNodeIndex){
		String formula = ""; 
		int f_id = panelInfo.getNode(pickedNodeIndex).getFormulaId();
		for(int i =0 ;i<panelInfo.getFormulaCount(); i++)
			if (panelInfo.getFormula(i).getId()==f_id){
				formula = panelInfo.getFormula(i).getEquation();
				return formula;
			}
				return "";
		}
	
	String getEdgeFormulaImgURL(int pickedEdgeIndex){
		String density = ""; 
		int f_id = panelInfo.getEdge(pickedEdgeIndex).getFormulaId();
		for(int i =0 ;i<panelInfo.getFormulaCount(); i++)
			if (panelInfo.getFormula(i).getId()==f_id){
				density = panelInfo.getFormula(i).getImgURL();
			}
				return density;
		}
	
	String getNodeFormulaImgURL(int pickedNodeIndex){
		String density = ""; 
		int f_id = panelInfo.getNode(pickedNodeIndex).getFormulaId();
		for(int i =0 ;i<panelInfo.getFormulaCount(); i++)
			if (panelInfo.getFormula(i).getId()==f_id){
				density = panelInfo.getFormula(i).getImgURL();
			}
				return density;
		}
	
	void getNodeReference(int pickedNodeIndex){
		int ref_count = panelInfo.getNode(pickedNodeIndex).getRefCount();
		infoAreaReference.removeAll();
		infoAreaReference.add(new JLabel("References for node: "+panelInfo.getNode(pickedNodeIndex).getDisplayName()));	
		infoAreaReference.add(new JLabel(""));
    	if (ref_count > 0){
     
    		infoAreaReference.setLayout(new BoxLayout(infoAreaReference, BoxLayout.PAGE_AXIS));

    		String refString="";
    		int ref_id, ref_index;
    		for (int r=0; r<ref_count; r++){
    			ref_id = panelInfo.getNode(pickedNodeIndex).getRefId(r);
    			if(isDebug())
    				System.out.println("ref_id for node index "+pickedNodeIndex+" is"+ ref_id);
    			
    			ref_index = panelInfo.findRefById(ref_id);
    			
    			if (isDebug()) System.out.println("ref_index="+ref_index);
    		
    			if (ref_index == -1 ){
    				System.out.println("Ref not found for node "+panelInfo.getNode(pickedNodeIndex).getDisplayName()+ ref_count);
    				if(ref_count==1){
    					LinkLabel link = new LinkLabel("No Reference available");
    					infoAreaReference.add(link);
    				}
    			}else{
    				refString = r+1+": ";
    				refString += panelInfo.getRef(ref_index).toString();
  
    				//System.out.println("Ref:"+refString);
    				LinkLabel link = new LinkLabel(refString+"\n");
    				final String url = panelInfo.getRef(ref_index).url;
    			    link.addActionTrigger( new MouseAdapter() {
    			        public void mouseClicked(MouseEvent e) {
    						showURL(url, "ref_url");
    			        }
    			    });

    			    infoAreaReference.add(link);	        			    
    			}
    		}
    		
    	}else{

    		LinkLabel link = new LinkLabel("No Reference available");
    		infoAreaReference.add(link);
    	}
	}
	
	void getEdgeReference(int pickedEdgeIndex){
		int ref_count = panelInfo.getEdge(pickedEdgeIndex).getRefCount();
		infoAreaReference.removeAll();
		infoAreaReference.add(new JLabel("References for edge: "+panelInfo.getEdge(pickedEdgeIndex).getDisplayName()));	
    	if (ref_count>0){
    
    		infoAreaReference.setLayout(new BoxLayout(infoAreaReference, BoxLayout.PAGE_AXIS));

    		String refString="";
    		int ref_id, ref_index;
    		for (int r=0; r<ref_count; r++){
    			ref_id = panelInfo.getEdge(pickedEdgeIndex).getRefId(r);
    			ref_index = panelInfo.findRefById(ref_id);
    			if (ref_index ==-1){
    				System.out.println("Ref not found for Edge "+panelInfo.getEdge(pickedEdgeIndex).getDisplayName());
    				if(ref_count==1){
    					LinkLabel link = new LinkLabel("No Reference available");
    					infoAreaReference.add(link);
    				}
    			}else{
    				refString = r+1+": ";
    				refString += panelInfo.getRef(ref_index).toString();
  
    				//System.out.println("Ref:"+refString);
    				LinkLabel link = new LinkLabel(refString+"\n");
    				final String url =panelInfo.getRef(ref_index).url;
    			    link.addActionTrigger( new MouseAdapter() {
    			        public void mouseClicked(MouseEvent e) {
    						showURL(url, "ref_url");
    			        }
    			    });

    			    infoAreaReference.add(link);	        			    
    			}
    		}
    		
    	}else{

    		LinkLabel link = new LinkLabel("No Reference available");
    		infoAreaReference.add(link);
    	}
	}

	protected void showURL(String urlString, String window){
		try{
		URL url = new URL (urlString);
		//System.out.println("url: " + url.toString());
	
		AppletContext a = this.getAppletContext();
		a.showDocument(url, window);
		}catch(Exception ex){
			ex.printStackTrace();
		}
	
	}

	public boolean isDebug() {
		return debug;
	}
   
   /** for quicksorting
    * 
    * @param left
    * @param right  
    * @param pivot
    * @return
    */
 /*  public int popPartitionIt(int left, int right, int pivot) {
		int leftPtr = left-1;           // left    (after ++)
		int rightPtr = right;           // right-1 (after --)
		
		while(true) {                            // find bigger item
				while(Integer.parseInt(goCatArray[++leftPtr].substring(0,4).trim()) < pivot ) // format
				   ;  // (nop)
											 // find smaller item
				while(rightPtr > 0 && Integer.parseInt(goCatArray[--rightPtr].substring(0,4).trim()) > pivot) // format
				   ;  // (nop)
	
				if(leftPtr >= rightPtr)    // if pointers cross,
				   break;                    	 //  partition done
				else                        		 // not crossed, so
				   swap(leftPtr, rightPtr);  // swap elements
		}  // end while(true)
		swap(leftPtr, right);           // restore pivot
		return leftPtr;                	 // return pivot location
   }*/
   
   
   /** for quicksorting
    * 
    * @param left
    * @param right
    */
  /* public void popQuickSort(int left, int right) {
		if(right-left <= 0)        // if size <= 1,
			return;                // already sorted
		else                       // size is 2 or larger
		   {
			   int pivot = Integer.parseInt(goCatArray[right].substring(0,4).trim());    // format ; rightmost item
				// partition range
			   int partition = popPartitionIt(left, right, pivot);
			   popQuickSort(left, partition-1);   // sort left side
			   popQuickSort(partition+1, right);  // sort right side
		   }
   }*/
   
   
   /** for quicksorting
    * 
    * @param dex1
    * @param dex2
    */
  /* public void swap(int dex1, int dex2) {
		String temp = goCatArray[dex1];      	// A into temp
		goCatArray[dex1] = goCatArray[dex2];   // B into A
		goCatArray[dex2] = temp;             			// temp into B
	} */ // end swap   

}



