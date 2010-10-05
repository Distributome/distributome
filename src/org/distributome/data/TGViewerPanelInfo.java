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

package org.distributome.data;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.Image;

import org.distributome.TGViewerApplet;


public class TGViewerPanelInfo{

	private static final int MAXEDGES = 2000;
	private static final int MAXNODES = 200;
	private static final int MAXREFS = 200;
  
	// values for showFlag and neighbor_level
	//0- noshow,  1-normal, 2-highlight, 3-highlightAsParent  4-highlightAs Children 5-highlightAsBoth 
	public static final int NoShow = -1;
	public static final int Normal= 1;
	public static final int Highlighted = 2;
	public static final int HighlightAsParent = 3;
	public static final int HighlightAsChild = 4;
	public static final int HighlightAsBoth = 5;
	
	// values for  neighbor_level
	public static final int HideNeighbor = 0;
	public static final int ShowParent = 1;
	public static final int ShowChildren = 2;
	public static final int ShowBoth = 3;
	
	private boolean debug = false;
  	// arrays used for data 

	protected SOCREdge[] edges = new SOCREdge[MAXEDGES]; // array of Edges
	protected SOCRNode[] nodes = new SOCRNode[MAXNODES];	
	protected SOCRReference[] refs = new SOCRReference[MAXREFS];	
	protected SOCRFormula[] formulas = new SOCRFormula[2000];
	
	protected int nEdges=0;
	protected int nNodes=0; 
	protected int nRefs=0; 
	protected int nFormulas=0; 

	public int neighbor_level= 0;  // this acts as a flag
	
	// array of Nodes   0- noshow, 1- normal, 2- highlight
//	public int[] nodesShowFlag = new int[MAXNODES];
	
//	public int highlightedType = HighLightedType.NONE; //0 none;  1 node; 2 edge, 3 node type, 4 edge type 

	//public boolean showHighlightedOnly= false;
	//boolean show_fu_text;
	public int pickedNodeIndex=-1;//, ex_pickedNodeIndex=-1;
	public int pickedEdgeIndex=-1;// ex_pickedEdgeIndex=-1;
	
	
	public Type nodeType= new Type(new String[]{"No Type",
			"Convolution", 
			"Memoryless", 
			"Inverse",
			"Linear Combination",
			"Minimum", 
			"Maximum",
			"Product",
			"Conditional Residual",
			"Scaling",
			"Simulate",
			"Variate Generation"},
			new String[]{"None",
			"Conv", 
			"Mless", 
			"Inv",
			"LinComb",
			"Min", 
			"Max",
			"Prod",
			"CondRes",
			"Scale",
			"Sim",
			"VGen"}
	);
	
	public Color[] nodeTypeColor= {
			new Color(255, 255, 000),
			new Color(051,255, 255),
			new Color(000, 255, 153),
			new Color(255, 153, 204),
			new Color(102, 204,051),
			new Color(204, 153, 000),
			new Color(102, 153, 153),
			new Color(204, 102, 051),
			new Color(204, 051, 204),
			new Color(102, 102, 153)
				};

	public Color[] edgeTypeColor= {
			new Color(051, 255, 204),
			new Color(051,255, 204),
			new Color(051, 255, 000),
			new Color(102, 204, 204)
				};
	public Type edgeType = new Type(new String[]{"No type",
			"Special Case", 
			"Transform", 
			"Limiting",
			"Bayesian"
			},new String[]{"None",
			"SC", 
			"T", 
			"Lim",
			"Bayes"
			});
	
	TGViewerApplet applet;
	Graphics2D offgraphics;
	Image offscreen;
	Dimension offscreensize;
	SOCRNode pickedNode;
	SOCREdge pickedEdge;
	Thread relaxer;

	
	/* 1. Node (distribution) Types will be (full-name & abbreviation):
	Convolution (Conv)

    Memoryless (Mless)

    Inverse (Inv)

    Linear Combination (LinComb)

    Minimum (min)

    Maximum (max)

    Product (Prod)

    Conditional Residual (CondRes)

    Scaling (Scale)

    Simulate (Sim)*/
/*	protected String NodeType[]= {"Convolution", "Memoryless","Inverse", "Linear Combination","Minimum", "Maximum","Product", "Conditional Residual", "Scaling", "Simulate" };
	protected String NodeType_s[]= {"Conv", "Mless","Inv","LinComb","min","max","Prob","CondRes","Scale","Sim"};
*/	/*
	 * Edge Types (directional distribution relations) will be:
# 1 Special Case (SC)
# 2 Transform (T)
# 3 Limiting (Lim)
# 4Bayesian (Bayes) */
/*	protected String EdgeType[]= {"Special Case","Transform","Limiting","Bayesian"};	
	protected String EdgeType_s[]= {"SC", "T","Lim", "Bayes"};
	*/
	
	/** CONSTRUCTOR
	 * 
	 * @param graph
	 */
	public TGViewerPanelInfo(TGViewerApplet graph) {
		this.applet = graph;
		debug = graph.isDebug();
	}

	
	public void addNode(int id, String nodeName, int typeCount, int[] types, int nodeFormulaId, String nodeUrl, int kw_count, String[] kws, int refId_count, int[] refIds) { 
		int n = findNodeById(id); 
	//	int f = findGoInfoIndex(id); 
		
	//	nodes[n].funkflag[f] = true;  
		nodes[n].debug = isDebug();
		nodes[n].nodeIndex = n;
		nodes[n].type_count= typeCount; 
		nodes[n].types = new int[typeCount];
		for (int i=0; i<typeCount; i++)
			nodes[n].types[i]=types[i];		
		nodes[n].url= nodeUrl; 
		nodes[n].formula_id= nodeFormulaId; 
		nodes[n].name= nodeName; 
		nodes[n].keyword_count = kw_count;
		nodes[n].keywords = new String[kw_count];
		for (int i=0; i<kw_count; i++)
			nodes[n].keywords[i]=kws[i];
		nodes[n].reference_id_count = refId_count;
		nodes[n].reference_ids = new int[refId_count];
		for (int i=0; i<refId_count; i++)
			nodes[n].reference_ids[i]=refIds[i];
		
		nodes[n].showFlag =1;
	}
	
	public int addNode(int id) {
		//System.out.println("panelInfo addNode get called for "+id);
		SOCRNode node = new SOCRNode();
	
		node.debug= isDebug();
		node.id = id;
		node.url = "";
		nodes[nNodes] = node;
		node.showFlag = 1;
	    
		return nNodes++;
	}


	public void addNode(SOCRNode node){
		int id = node.getId(); 
		node.showFlag =1;
		//System.out.println("Adding node "+id);
		int n = findNodeById(id); 
		
		nodes[n] = node;
		node.setNodeIndex(n);
	}
	
	/** INTERACTION HANDLING METHODS 
	 * 
	 * @param from
	 * @param to
	 * @param length
	 * @param strength
	 */
/*	public void addEdge(String from, String to, int length, double strength) {
		Edge edge = new Edge();
		edge.from = findMember(from);  //converts string to an index where node is stored in nodes[]
		edge.to = findMember(to);
		edge.len = length;
		edge.strength = strength; 
	
		edges[nEdges++] = edge;
	}*/

	public void addEdge(int from, int to, int edge_id, String edge_name, int typeCount, int[] types, int edge_formula_id, int ref_id_count, int[] ref_ids) {
		
		SOCREdge edge = new SOCREdge();
		
		edge.debug= isDebug();
		edge.setSourceId(nodes[findNodeById(from)].id); //this will call addNode 
		edge.setTargetId(nodes[findNodeById(to)].id);		//this will call addNode
		edge.setId(edge_id);
		edge.setName(edge_name);
		edge.setFormulaId(edge_formula_id);
		edge.setTypes(typeCount,types);
		edge.setRefId(ref_id_count, ref_ids);
		
		//System.out.println("ViewerPanelInfo addEdge:"+nEdges+":"+edge.toString());
		edges[nEdges++] = edge;
	}
	
	public void addEdge(SOCREdge edge){
	//	edge.setSource(findMember(edge.getSource()));
	//	edge.setTarget(findMember(edge.getTarget()));
		edge.len = 150;
		edges[nEdges++] = edge;
	}
	
	public void addFormula( int f_id, String f_density, String f_formula) {
	
	
		SOCRFormula formula = new SOCRFormula();
	
		formula.debug= isDebug();
		formula.id = f_id;
		formula.imgURL = f_density;
		formula.equation = f_formula;
		
		//if(debug) System.out.println("ViewerPanelInfo add formula:"+nFormulas+":"+ f_id);
		formulas[nFormulas++] = formula;
	
	}
	public void addFormula(SOCRFormula formula){
		formulas[nFormulas++] = formula;
	}
	
	public void addRef(int id, int author_count, String[] authors, String year, String title, String journal, String volumeInfo, String url){
	
		SOCRReference ref = new SOCRReference();
		
		ref.debug= isDebug();
		ref.id = id;
		ref.author_count = author_count;
		ref.authors = new String[author_count];
		for (int i=0; i<author_count; i++)
			ref.authors[i]= authors[i];
		ref.year = year;
		ref.title = title;
		ref.journal = journal;
		ref.volumeInfo = volumeInfo;
		ref.url = url;
		
		refs[nRefs++]= ref;
		
	}
	
	public void addRef(SOCRReference ref){
		refs[nRefs++]= ref;		
	}
	
	
	public int countNumberOfEdgeforNodeId(int id){
		int c =0;
		for (int i=0; i<nEdges; i++){
			if(edges[i].source_id==id){
				System.out.println("edge:"+edges[i].name);
				c++;
			}
			if(edges[i].target_id==id){
				System.out.println("edge:"+edges[i].name);
				c++;
			}
		}
		return c;		
	}
	
	/** MEMBER HANDLING METHODS*************************************
	 * 
	 * @param label
	 * @return
	 */
	public int findNodeByName(String label) {
		for (int i = 0 ; i < nNodes ; i++) {
			if (nodes[i].name.equals(label)) {
				return i;
			}
		}
		return -1;
	}

	public int findNodeById(int id) {
		for (int i = 0 ; i < nNodes ; i++) {
			if (nodes[i].id == id) {				
				return i;
			}
		}
		return addNode(id);
	}


	public int findRefById(int id){
		for (int i=0; i<nRefs; i++){
			if(debug)
				System.out.println("TGViewerPanelInfo refs["+i+"]="+refs[i]);
			if (refs[i].id==id)
				return i;
		}
		return -1;// not found
	}
	
	public SOCRReference findRefByIndex(int index){	
		if (index <0)
			return null;
		
		if(	nRefs>index && refs[index]!=null)
				return refs[index];
		else return null;
	}
	
	public int getEdgeCount(){
		return nEdges;
	}
	
	public int getNodeCount() {
		return nNodes;
	}

	public int getRefCount(){
		return nRefs;
	}
	public int getFormulaCount(){
		return nFormulas;
	}
	/**
	 * get edges
	 * @return
	 */
	public SOCREdge[] getEdges() {
		return edges;
	}

	public SOCREdge getEdge(int index) {
		return edges[index];
	}
	/**
	 * get nodes
	 * @return
	 */
	public SOCRNode[] getNodes() {
		return nodes;
	}

	public SOCRNode getNode(int index) {
		return nodes[index];
	}
	public SOCRReference getRef(int index) {
		return refs[index];
	}
	public SOCRFormula getFormula(int index) {
		return formulas[index];
	}
	
	public void pickEdge(int id){
		//System.out.println("ViewerPanelInfo pickEdge Object");
		for (int i = 0 ; i < nEdges ; i++) {
			if(edges[i].getId() == id){
				pickedEdgeIndex = i;
		
				return;
			}
				
		}
		
		System.out.println("ViewerPanelInfo picked edge failed");
	}
	
	public void pickEdge(Object o){
		//System.out.println("ViewerPanelInfo pickEdge Object");
		for (int i = 0 ; i < nEdges ; i++) {
			if(o.equals(edges[i])){
				pickedEdgeIndex = i;
				return;
			}
				
		}
		
		System.out.println("ViewerPanelInfo picked edge failed");
	}

	public void pickNode(String name){
		
		for (int i = 0 ; i < nNodes ; i++) {
			if(name.equals(nodes[i].getDisplayName())){
				pickedNode = nodes[i];   // SET PICKED node: ACTUAL OR CLOSEST TO POINT OF MOUSE CLICK
				pickedNodeIndex = i;
			
				if (debug){
					System.out.println("ViewerPanelInfo picked node id ="+pickedNodeIndex);				
				}
			}
		}
		
	}

	
	/**
	 * 
	 * @param newEdges
	 */
	public void setEdges(SOCREdge[] newEdges) {
		edges = newEdges;
	}

	/**** Member and Edge setting/getting - for external class access from TableApplet
	 * 
	 * @param newNodes
	 */
	public void setNodes(SOCRNode[] newNodes){
		nodes = newNodes;
	}

	public boolean isDebug() {
		return debug;
	}


}

