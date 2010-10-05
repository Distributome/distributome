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

import java.net.URL;

public class SOCRFormula{

	 int id;
	 String imgURL;
	 String equation;
	 public boolean showID = false;// used  by editor
	 public boolean debug = false;
	
	// constructor
	public SOCRFormula() {

	}	
	public void setId(String _id){
		id = Integer.parseInt(_id);
	}
	public int getId(){
		return id;
	}
	public void setImgURL(String ds){
		imgURL = ds;
	}
	public String getImgURL(){
		return imgURL;
	}
	
	public void setEquation(String f){
		equation = f;
	}
	public String getEquation(){
		return equation;
	}
	
	public void print(){
		System.out.println("Formula :"+id+":"+equation);
	}
	
	public String toString(){
		if (debug)
			print();
		
		if (showID)
			return (id+": "+imgURL+" "+equation);
		else  return (imgURL+" "+equation);
		
	}

	
}
