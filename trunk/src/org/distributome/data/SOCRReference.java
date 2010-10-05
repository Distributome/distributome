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
import java.util.StringTokenizer;

public class SOCRReference{
	public int id; 
	public int author_count;
	public String[] authors;
	public String authorString;
	public String year;
	public String title;
	public String journal;
	public String volumeInfo;
	public String url;
	public boolean showID = false; // used  by editor
	public boolean debug = false;
	// constructor
	public SOCRReference() {

	}
	
	public void setId(String _id){
		id = Integer.parseInt(_id);
	}
	public void setAuthor(String aString){
		authorString = aString;
		StringTokenizer tk2 = new StringTokenizer(aString,",");
		author_count= tk2.countTokens();
		authors = new String[author_count];
		int i = 0;
		while(tk2.hasMoreTokens()){
			authors[i]= tk2.nextToken().trim();
			i++;
		}
	}
	public void setYear(String y){
		year =y;
	}
	public void setTitle(String t){
		title = t;
	}
	public void setJournal(String j){
		journal = j;
	}
	public String getJournal(){
		return journal;
	}
	public void setVolumnInfo(String v){
		volumeInfo = v;
	}
	public String  getVolumnInfo(){
		return volumeInfo;
	}
	public void setURL(String u){
		url  = u;
	}
	public  String  getURL(){
		return url;
	}
	public int  getId(){
		return id;
	}
	
	public String getAuthorString(){
		return authorString;
	}
	
	public String getYear(){
		return year;
	}
	public String getTitle(){
		return title;
	}
	public void print(){
		System.out.println(toString());
	}
	
	public String toString(){
	
		String refString ="";
		for (int a = 0; a<author_count-1; a++)
			refString+=authors[a]+", ";
		
		refString += authors[author_count-1]+"; ";
		
		refString += title+"; ";
		
		refString += journal+"; ";
		refString += year+"; ";
		refString += volumeInfo;
		
		if(debug)
			System.out.println(id+" "+refString);
			
		if(showID)
			return (id+" "+refString);
		else
			return refString;
		
	}

	
}

