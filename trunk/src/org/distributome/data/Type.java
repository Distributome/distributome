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
/*
 */
public class Type {
	protected int typeCount;
	protected String types_fullname[];
	
	protected String types_shortname[]; 
	
	public Type(String[] fullNames, String[] shortNames){
		types_fullname = fullNames;
		types_shortname = shortNames;
		typeCount= fullNames.length;
	}
	
	public int getTypeCount(){
	return typeCount;
	}	
	public String getFullName(int id){
		return types_fullname[id];		
	}
	
	public String getShortName(int id){
		return types_shortname[id];		
	}
	
	public String getFullName(int[] id){
		String s = "(";
		for (int i=0 ;i<id.length; i++)
			s+=types_fullname[id[i]]+",";
		return (s.substring(0, s.length()-1))+")";		
	}
	
	public String getShortName(int[] id){
		String s = "(";
		for (int i=0 ;i<id.length; i++)
			s+=types_shortname[id[i]]+",";
		return (s.substring(0, s.length()-1))+")";		
	}
	
	 public String toString(){
		 String out= null;
		 for(int  i=0; i<typeCount; i++)
			 out+=i+":"+types_fullname[i]+" "+types_shortname[i]+"\n";
		 
		 return out;
	 }
}
