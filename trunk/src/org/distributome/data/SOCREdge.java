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

public class SOCREdge{
	
	public double len; // the minimum length, set to 100
//	double strength;  // aka confidence

	public boolean debug= false;
	public boolean showID= false;

	int id;
	String name;
	
	int reference_id_count;
	int[] reference_ids;
	String refString;	
	int formula_id;
	int source_id;
	int target_id;
	
	int[] types;
	int type_count;
	String typeString;

	// constructor
	public SOCREdge() {
		len = 150;
		reference_id_count = 0;  //no reference
	}
	
	public void setId(String _id){
		id=Integer.parseInt(_id);
	}
	public void setName(String _name){
		name= _name;
	}
	
	public void setTypes(String _typeString){
		//System.out.println("Edge "+typeString );
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
	
	public void setSource(String f){
		source_id =Integer.parseInt(f) ;
	}
	public void setTarget(String t){
		//System.out.println("toNodeID="+t);
		target_id =Integer.parseInt(t) ;
	}
	public void setRefs(String _refString){
		refString = _refString;
		StringTokenizer tk2 = new StringTokenizer(refString,",");
		reference_id_count= tk2.countTokens();
		reference_ids = new int[reference_id_count];
		int i = 0;
		while(tk2.hasMoreTokens()){
			reference_ids[i]= Integer.parseInt(tk2.nextToken().trim());
			i++;
		}
	}

	//
/*	public double getStrength() {
		return strength;
	}*/
	
	public String  getTypeString(){
		
		return typeString;
	}
	
	public String  getRefString(){
	
		return refString;
	}
	
	public int  getId(){
		return id;
	}
	
	public int getRefCount(){
		return reference_id_count;
	}
	
	public int getRefId(int index){
		return reference_ids[index];
	}
	
	public void setSourceId(int f){
		source_id = f;
	}
	public int getSourceId(){
		return source_id;
	}
	public void setTargetId(int t){
		target_id = t;
	}
	public int getTargetId(){
		return target_id;
	}
	public void setId(int in){
		id = in;
	}
	
	public void setRefId(int id_count, int[] ids){
		reference_id_count = id_count;
		reference_ids= new int[id_count];
		for (int i=0; i<id_count; i++)
			reference_ids[i]= ids[i];
	}

	public String getName(){
		return name;
	}
	
	// may including ID in the editor viewer
	public String getDisplayName(){
		if(showID)
			return(id+":"+name);
		else 
			return name;
	}
	
	public void setFormulaId(int in){
		formula_id= in;
	}
	
	public int getFormulaId(){
		return formula_id;
	}
	
	public int getTypeCount(){
		return type_count;
	}
	
	public int getType(int  typeId){
		return types[typeId];
	}
	
	public void setTypes(int count, int[] t){
		type_count = count;
		types = new int[type_count];
		for (int i=0; i<type_count; i++)
			types[i]=t[i];
	}
	
	public String toString(){
	
		if(debug)
			print();
		if(showID)
			return(id+"");
		else return "";  //hide name
	}
	
	public void print(){
		String s1 = "";
		
		for (int j=0; j<type_count; j++)
			s1+= Integer.toString(types[j])+",";
		
		String  s = "Edge id:"+id+" =["+name+"; type:"+s1+";"+source_id+"->"+target_id+"]" +"[len="+len+"formula_id="+formula_id;			
		System.out.println(s);

	}

	
}

