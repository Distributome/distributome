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

import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.image.BufferedImage;

import javax.swing.ImageIcon;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;

public class LoadAndShowFormula extends JPanel {
    BufferedImage image;
    String formula;
    Dimension size = new Dimension();
   
    
    public static LoadAndShowFormula selfRef = null;

    public LoadAndShowFormula(BufferedImage image, String f) {
        this.image = image;
        this.formula = f;
        size.setSize(image.getWidth(), image.getHeight());
        selfRef = this;
    }

    public LoadAndShowFormula() {
        this.image = null;
        formula ="";
        size.setSize(100, 100);
        selfRef = this;
    }
    /**
     * Drawing an image can allow for more
     * flexibility in processing/editing.
     */
    protected void paintComponent(Graphics g) {
        // Center image in this component.
    	//removeAll();
    	super.paintComponent(g);
 
    	if (image!=null){
    		int x = (getWidth() - size.width)/2;
    		int y = (getHeight() - size.height)/2;
    		g.drawImage(image, x, y, this);	
        	
        	if(this.getComponentCount()<1){ 

        		LinkLabel link = new LinkLabel("Show Formula");
            	link.addActionTrigger( new MouseAdapter() {
        	        public void mouseClicked(MouseEvent e) {
        	        	if (formula.length()!=0)
        	        		SOCROptionPane.showMessageDialog(selfRef, formula);
        	        	else 
        	        		SOCROptionPane.showMessageDialog(selfRef, "formula not available");
        	        }
        	        });
        		add(link);
        	}
    	}else {
    		if (formula.length()!=0){
    			add(new JLabel("error loading formula."));
    		}
    	}
    }

    public void addActionTrigger(MouseListener m) {
        addMouseListener(m);
        
   }
    
    public Dimension getPreferredSize() { return size; }

    /*public static void main(String[] args) throws IOException {
        String path = "images/hawk.jpg";
        BufferedImage image = ImageIO.read(new File(path));
        LoadAndShowFormula test = new LoadAndShowFormula(image, "formula");
        JFrame f = new JFrame();
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.add(new JScrollPane(test));
        f.setSize(400,400);
        f.setLocation(200,200);
        f.setVisible(true);
        //showIcon(image);
    }*/

    public void loadImage(BufferedImage image){
    	this.removeAll();
    	this.image = image;
    	if (image!=null){
  		
    		size.setSize(image.getWidth(), image.getHeight());
    	}
    	
    }
    
    public void setFormula(String f){
    	formula = f;
    }
    /**
     * Easy way to show an image: load it into a JLabel
     * and add the label to a container in your gui.
     */
    private static void showIcon(BufferedImage image) {
        ImageIcon icon = new ImageIcon(image);
        JLabel label = new JLabel(icon, JLabel.CENTER);
        JOptionPane.showMessageDialog(null, label, "icon", -1);
    }
}
