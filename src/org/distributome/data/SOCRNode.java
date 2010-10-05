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

import java.util.StringTokenizer;

/* Node (distribution) Types will be (full-name & abbreviation):
# 0 No type given
# 1 Convolution (Conv) 
# 2 Memoryless (Mless)
# 3 Inverse (Inv)
# 4 Linear Combination (LinComb)
# 5 Minimum (min)
# 6 Maximum (max)
# 7 Product (Prod)
# 8 Conditional Residual (CondRes)
# 9  Scaling (Scale)
# 10 Simulate (Sim)

*/
public class SOCRNode {
	private static final int MAXFLAGS = 10000;
	// int neighbor_level=0;
	
	public double x, y; //location
	public double dx, dy; // moving distance
	
	public boolean fixed = false; // not moving
	//public boolean[] funkflag = new boolean[MAXFLAGS] ; // GO cat flag for member
	//public boolean nextneighbour;

	public int showFlag;  //-1- noshow,  1-normal, 2-highlight, 3-highlightAsParent  4-highlightAs Children 5-highlightAsBoth 
	
	public boolean debug = false;
	public boolean showID = false;
	
	int id;
	int nodeIndex;
	
	String url;
	int formula_id;
	String name;
	
	int reference_id_count;
	int[] reference_ids;
	String refString;
	
	int[] types;
	int type_count;
	
	String typeString;
	String[] keywords;
	
	int keyword_count;
	String keywordString;
	
	//int cellId; //JGraph reference id
	
	
	/*public void setLevel(int l){
		neighbor_level = l;
	}
	public int getLevel(){
		return neighbor_level;
	}*/
	
	public void setId(int _id){
		id=_id;
	}
	
	public void setId(String _id){
		id = Integer.parseInt(_id);
	}
	
	public void setName(String _name){
		name= _name;
	}
	
	public void setTypes(String _typeString){
		typeString= _typeString;
		StringTokenizer tk2 = new StringTokenizer(_typeString,",");
		type_count= tk2.countTokens();
		types = new int[type_count];
		int i=0;
		while(tk2.hasMoreTokens()){
			types[i]= Integer.parseInt(tk2.nextToken().trim());
			i++;
		}
	}
	
	public void setFormulaId(String _id){
		formula_id=Integer.parseInt(_id);
	}
	public void setFormulaId(int in){
		formula_id= in;
	}

	public void setURL(String _url){
		url=_url;
		//System.out.println("*"+url+"*");
	}
	
	public void setKeywords(String kwString){
		keywordString= kwString;
		
		StringTokenizer tk2 = new StringTokenizer(kwString,",");
		keyword_count= tk2.countTokens();
		keywords = new String[keyword_count];
		int i=0;
		while(tk2.hasMoreTokens()){
			keywords[i]= tk2.nextToken().trim();
			i++;
		}
	}
	
	public void setRefs(String _refString){
		//System.out.println("refString ="+refString);
		refString= _refString;
		
		StringTokenizer tk2 = new StringTokenizer(_refString,",");
		reference_id_count= tk2.countTokens();
		//System.out.println("*"+refString+"*reference_id_count="+reference_id_count);
		reference_ids = new int[reference_id_count];
		int i = 0;
		while(tk2.hasMoreTokens()){
			int id= Integer.parseInt(tk2.nextToken().trim());
			//System.out.println(id);
			if(id!=0){ // 0 empty reference
				reference_ids[i]= id;
				i++;
			}
		}
		
		if(reference_id_count>i){
			reference_ids[i] = 0;
			reference_id_count= i;
		}
		
		/*for(i =0; i<reference_id_count; i++)
			System.out.print("ref"+i+"="+reference_ids[i]+",");
		System.out.println();	*/	
	}

	
	public void setX(double _x){
		this.x = _x;
		//System.out.println("Node "+cellId+" location get updated: x="+x);
	}
	
	public void setY(double _y){
		this.y = _y;
		//System.out.println("Node "+cellId+" location get updated: y="+y);
	}
	
	//----------------------------------------------------------
	public int getType(int  typeId){
		return types[typeId];
	}
	
	public int getTypeCount(){
		return type_count;
	}

	public String  getTypeString(){
	
		return typeString;
	}
	
	public int getRefCount(){
		return reference_id_count;
	}

	public int getRefId(int index){
		return reference_ids[index];
	}

	public String  getRefString(){
	
		return refString;
	}
	
	public String  getKeywordString(){
		
		return keywordString;
	}
	
	public int getFormulaId(){
		return formula_id;
	}

	public int getId(){
		return id;
	}
	/*public int getCellId(){
		return cellId;
	}
	public void setCellId(int i){
		cellId=i;
	}*/
	public int getNodeIndex(){
		return nodeIndex;
	}
	public void setNodeIndex(int i){
		nodeIndex=i;
	}
	public String getName(){
		return name;
	}
	public String getDisplayName(){
		if(showID)
			return(id+":"+name);
		else return name;
	}
	
	public String getUrl(){
		return url;
	}
	public String toString(){	
		if(debug)
			print();
		
		if(showID)
			return(id+" "+name);
		else return name;
	}
	
	public void print(){
		String s1 = "";
		
		for (int j=0; j<type_count; j++)
			s1+= Integer.toString(types[j])+",";
		
		String  s = "Node["+nodeIndex+"] id="+id+" "+name+"; "+s1+"; "+url+"]";	
		
		System.out.println(s);
	}
}


