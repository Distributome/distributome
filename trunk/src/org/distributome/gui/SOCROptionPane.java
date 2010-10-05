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

package org.distributome.gui;

import java.awt.Color;
import java.awt.Component;
import javax.swing.JOptionPane;
import javax.swing.JTextArea;

   public  class SOCROptionPane extends JOptionPane {

	   public static void showMessageDialog(Component parent, String m){
			JOptionPane popup = new JOptionPane(); 
			JTextArea msg = new JTextArea(m);
			msg.setEditable(true);  // allow highlight and copy
			Color bg = popup.getBackground();	
			msg.setBackground(bg);
			JOptionPane.showMessageDialog(parent, msg);
	   }	

}
