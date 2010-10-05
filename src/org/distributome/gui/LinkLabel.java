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


import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import javax.swing.event.*;
public class LinkLabel extends JLabel {
 
   public LinkLabel(String text) {
       super(text);
       setForeground(Color.blue);
       addMouseListener( new MouseAdapter() {
          public void mouseEntered(MouseEvent e) {
               setForeground(Color.red);
          }
 
          public void mouseExited(MouseEvent e) {
               setForeground(Color.blue);
          }
       } );
   }
 
   public void addActionTrigger(MouseListener m) {
        addMouseListener(m);
        
   }
}
