/*
 * TouchGraph LLC. Apache-Style Software License
 *
 *
 * Copyright (c) 2001-2002 Alexander Shapiro. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the
 *    distribution.
 *
 * 3. The end-user documentation included with the redistribution,
 *    if any, must include the following acknowledgment:
 *       "This product includes software developed by
 *        TouchGraph LLC (http://www.touchgraph.com/)."
 *    Alternately, this acknowledgment may appear in the software itself,
 *    if and wherever such third-party acknowledgments normally appear.
 *
 * 4. The names "TouchGraph" or "TouchGraph LLC" must not be used to endorse
 *    or promote products derived from this software without prior written
 *    permission.  For written permission, please contact
 *    alex@touchgraph.com
 *
 * 5. Products derived from this software may not be called "TouchGraph",
 *    nor may "TouchGraph" appear in their name, without prior written
 *    permission of alex@touchgraph.com.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL TOUCHGRAPH OR ITS CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 * BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ====================================================================
 *
 */

package edu.ucla.stat.SOCR.touchgraph.graphlayout;

import java.awt.BorderLayout;
import java.awt.Checkbox;
import java.awt.CheckboxGroup;
import java.awt.Color;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.Point;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.Hashtable;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollBar;

import org.distributome.data.SOCREdge;
import org.distributome.data.SOCRNode;

import edu.ucla.stat.SOCR.touchgraph.graphlayout.graphelements.TGForEachNode;
import edu.ucla.stat.SOCR.touchgraph.graphlayout.interaction.GLEditUI;
import edu.ucla.stat.SOCR.touchgraph.graphlayout.interaction.GLNavigateUI;
import edu.ucla.stat.SOCR.touchgraph.graphlayout.interaction.HVScroll;
import edu.ucla.stat.SOCR.touchgraph.graphlayout.interaction.HyperScroll;
import edu.ucla.stat.SOCR.touchgraph.graphlayout.interaction.LocalityScroll;
import edu.ucla.stat.SOCR.touchgraph.graphlayout.interaction.RotateScroll;
import edu.ucla.stat.SOCR.touchgraph.graphlayout.interaction.TGUIManager;
import edu.ucla.stat.SOCR.touchgraph.graphlayout.interaction.ZoomScroll;

/** GLPanel contains code for adding scrollbars and interfaces to the TGPanel
  * The "GL" prefix indicates that this class is GraphLayout specific, and
  * will probably need to be rewritten for other applications.
  *
  * @author   Alexander Shapiro
  * @version  1.22-jre1.1  $Id: GLPanel.java,v 1.1 2010/01/20 20:38:32 jiecui Exp $
  */
public class GLPanel extends JPanel {

    public String zoomLabel = "Zoom"; // label for zoom menu item
    public String rotateLabel = "Rotate"; // label for rotate menu item
	public String localityLabel = "Radius"; // label for locality menu item
	public String hyperLabel = "Hyperbolic"; // label for Hyper menu item

    public HVScroll hvScroll;
    public ZoomScroll zoomScroll;
    public HyperScroll hyperScroll; // unused
    public RotateScroll rotateScroll;
    public LocalityScroll localityScroll;
    public JPanel glPopup;
    public Hashtable scrollBarHash; //= new Hashtable();
    public JPanel popupMenusPanel;

    public TGPanel tgPanel;
    protected TGLensSet tgLensSet;
    protected TGUIManager tgUIManager;

    private JScrollBar currentSB =null;
    boolean controlsVisible = true;
    JPanel radioButtonPanel;

  private Color defaultBackColor = new Color(0x01,0x11,0x44);
  public Color defaultBorderBackColor = new Color(0x02,0x35,0x81);
  private Color defaultForeColor = new Color((float)0.95,(float)0.85,(float)0.55);

  // ............


   /** Default constructor.
     */
  public GLPanel() {
        this.setBackground(defaultBorderBackColor);
        this.setForeground(defaultForeColor);
        scrollBarHash = new Hashtable();
        tgLensSet = new TGLensSet();
        tgPanel = new TGPanel();
        tgPanel.setBackColor(defaultBackColor);
        hvScroll = new HVScroll(tgPanel, tgLensSet);
        zoomScroll = new ZoomScroll(tgPanel);
		hyperScroll = new HyperScroll(tgPanel);
        rotateScroll = new RotateScroll(tgPanel);
        localityScroll = new LocalityScroll(tgPanel);
        initialize();
    }

    

   /** Initialize panel, lens, and establish a random graph as a demonstration.
     */
    public void initialize() {
        buildPanel();
        buildLens();
        tgPanel.setLensSet(tgLensSet);
        addUIs();
      //tgPanel.addNode();  //Add a starting node.
      /*  try {
          //  randomGraph();
        	addNode();
        } catch ( TGException tge ) {
            System.err.println(tge.getMessage());
            tge.printStackTrace(System.err);
        }*/
        setVisible(true);
    }

    /** Return the TGPanel used with this GLPanel. */
    public TGPanel getTGPanel() {
        return tgPanel;
    }

  // navigation .................

    /** Return the HVScroll used with this GLPanel. */
    public HVScroll getHVScroll()
    {
        return hvScroll;
    }

    /** Return the HyperScroll used with this GLPanel. */
    public HyperScroll getHyperScroll()
    {
        return hyperScroll;
    }

    /** Sets the horizontal offset to p.x, and the vertical offset to p.y
      * given a Point <tt>p<tt>.
      */
    public void setOffset( Point p ) {
        hvScroll.setOffset(p);
    };

    /** Return the horizontal and vertical offset position as a Point. */
    public Point getOffset() {
        return hvScroll.getOffset();
    };

  // rotation ...................

    /** Return the RotateScroll used with this GLPanel. */
    public RotateScroll getRotateScroll()
    {
        return rotateScroll;
    }

    /** Set the rotation angle of this GLPanel (allowable values between 0 to 359). */
     public void setRotationAngle( int angle ) {
        rotateScroll.setRotationAngle(angle);
    }

    /** Return the rotation angle of this GLPanel. */
    public int getRotationAngle() {
        return rotateScroll.getRotationAngle();
    }

  // locality ...................

    /** Return the LocalityScroll used with this GLPanel. */
    public LocalityScroll getLocalityScroll()
    {
        return localityScroll;
    }

    /** Set the locality radius of this TGScrollPane
      * (allowable values between 0 to 4, or LocalityUtils.INFINITE_LOCALITY_RADIUS).
      */
    public void setLocalityRadius( int radius ) {
        localityScroll.setLocalityRadius(radius);
    }

    /** Return the locality radius of this GLPanel. */
    public int getLocalityRadius() {
        return localityScroll.getLocalityRadius();
    }

  // zoom .......................

    /** Return the ZoomScroll used with this GLPanel. */
    public ZoomScroll getZoomScroll()
    {
        return zoomScroll;
    }

    /** Set the zoom value of this GLPanel (allowable values between -100 to 100). */
    public void setZoomValue( int zoomValue ) {
        zoomScroll.setZoomValue(zoomValue);
    }

    /** Return the zoom value of this GLPanel. */
    public int getZoomValue() {
        return zoomScroll.getZoomValue();
    }

  // ....

    public JPanel getGLPopup()
    {
        return glPopup;
    }

    public void buildLens() {
        tgLensSet.addLens(hvScroll.getLens());
        tgLensSet.addLens(zoomScroll.getLens());
		tgLensSet.addLens(hyperScroll.getLens());
        tgLensSet.addLens(rotateScroll.getLens());
        tgLensSet.addLens(tgPanel.getAdjustOriginLens());
    }

    public void buildPanel() {
        final JScrollBar horizontalSB = hvScroll.getHorizontalSB();
        final JScrollBar verticalSB = hvScroll.getVerticalSB();
        final JScrollBar zoomSB = zoomScroll.getZoomSB();
        final JScrollBar rotateSB = rotateScroll.getRotateSB();
		final JScrollBar localitySB = localityScroll.getLocalitySB();
		final JScrollBar hyperSB = hyperScroll.getHyperSB();

		popupMenusPanel = new JPanel();
		popupMenusPanel.setBackground(defaultBorderBackColor);
		popupMenusPanel.setLayout(new FlowLayout());
        setLayout(new BorderLayout());

        JPanel scrollPanel = new JPanel();
        scrollPanel.setBackground(defaultBackColor);
        scrollPanel.setForeground(defaultForeColor);
        scrollPanel.setLayout(new GridBagLayout());
        GridBagConstraints c = new GridBagConstraints();


        JPanel modeSelectPanel = new JPanel();
        modeSelectPanel.setBackground(defaultBackColor);
        modeSelectPanel.setForeground(defaultForeColor);
        modeSelectPanel.setLayout(new FlowLayout(FlowLayout.CENTER, 0,0));

        radioButtonPanel = new JPanel();
        radioButtonPanel.setBackground(defaultBorderBackColor);
        radioButtonPanel.setForeground(defaultForeColor);
        radioButtonPanel.setLayout(new GridBagLayout());
        c.gridy=0; c.fill=GridBagConstraints.HORIZONTAL;

        c.gridx=0;c.weightx=0;

        c.insets=new Insets(0,0,0,0);
        c.gridy=0;c.weightx=1;

        scrollBarHash.put(zoomLabel, zoomSB);
        scrollBarHash.put(rotateLabel, rotateSB);
		scrollBarHash.put(localityLabel, localitySB);
		scrollBarHash.put(hyperLabel, hyperSB);

		//Jenny need to add this back
	   JPanel scrollselect = scrollSelectPanel(new String[] {zoomLabel, rotateLabel /*, localityLabel*/, hyperLabel});
	   scrollselect.setBackground(defaultBorderBackColor);
	   scrollselect.setForeground(defaultForeColor);
	   radioButtonPanel.add(scrollselect,c);
    
        c.fill = GridBagConstraints.BOTH;
        c.gridwidth = 1;
        c.gridx = 0; c.gridy = 1; c.weightx = 1; c.weighty = 1;
        scrollPanel.add(tgPanel,c);

        c.gridx = 1; c.gridy = 1; c.weightx = 0; c.weighty = 0;
//        scrollPanel.add(verticalSB,c);    // For WDR We do not need scrollbars

        c.gridx = 0; c.gridy = 2;
 //       scrollPanel.add(horizontalSB,c);  // For WDR We do not need scrollbars     

  
       /* glPopup = new JPanel();
        glPopup.setBackground(defaultBorderBackColor);
       JButton toggleButton =  new JButton("Toggle Controls");
        ActionListener toggleControlsAction = new ActionListener() {
            boolean controlsVisible = true;
            public void actionPerformed(ActionEvent e) {
                controlsVisible = !controlsVisible;
                horizontalSB.setVisible(controlsVisible);
                verticalSB.setVisible(controlsVisible);
                radioButtonPanel.setVisible(controlsVisible);
                GLPanel.this.doLayout();
            }
        };
        toggleButton.addActionListener(toggleControlsAction); 
        glPopup.add(toggleButton);
        popupMenusPanel.add(glPopup);
        */
        
        add(scrollPanel,BorderLayout.CENTER);  // the tgPanel
        add(radioButtonPanel, BorderLayout.SOUTH);  // the radio buttons
       // add(popupMenusPanel, BorderLayout.NORTH);	// needed by JDK11 Popupmenu..
    }
   
    public void toggleButtonHandler(){
	    controlsVisible = !controlsVisible;
	    hvScroll.getHorizontalSB().setVisible(controlsVisible);
	    hvScroll.getVerticalSB().setVisible(controlsVisible);
	    radioButtonPanel.setVisible(controlsVisible);
	    GLPanel.this.doLayout();
    }
    
    protected JPanel scrollSelectPanel(final String[] scrollBarNames) {
      final JPanel sbp = new JPanel(new GridBagLayout());

//    UI: Scrollbarselector via Radiobuttons.................................

      sbp.setBackground(defaultBorderBackColor);
      sbp.setForeground(defaultForeColor);

      JPanel firstRow=new JPanel(new GridBagLayout());
      firstRow.setBackground(defaultBorderBackColor);
      firstRow.setForeground(defaultForeColor);
      final CheckboxGroup bg = new CheckboxGroup();
      
      int cbNumber = scrollBarNames.length;
      Checkbox checkboxes[] = new Checkbox[cbNumber];
      
      GridBagConstraints c = new GridBagConstraints();      
      c.anchor=GridBagConstraints.WEST;
      c.gridy = 0; c.weightx= 0; c.fill = GridBagConstraints.HORIZONTAL;

      for (int i=0;i<cbNumber;i++) {
      	checkboxes[i] = new Checkbox(scrollBarNames[i],true,bg);
      	checkboxes[i].setBackground(defaultBorderBackColor);
        c.gridx = i; 
        firstRow.add(checkboxes[i],c);
      }
      checkboxes[0].setState(true);
      
      c.gridx=cbNumber;c.weightx=1;
    //  JLabel lbl = new JLabel("     Right-click nodes and background for more options");
    //   lbl.setForeground(defaultForeColor);
    //   firstRow.add(lbl,c);
      	
      class radioItemListener implements ItemListener{
        private String scrollBarName;
        public radioItemListener(String str2Act){
          this.scrollBarName=str2Act;
        }
        public void itemStateChanged(ItemEvent e){
          JScrollBar selectedSB = (JScrollBar) scrollBarHash.get((String) bg.getSelectedCheckbox().getLabel());		 
          if (e.getStateChange()==ItemEvent.SELECTED){
            for (int i = 0;i<scrollBarNames.length;i++) {
                JScrollBar sb = (JScrollBar) scrollBarHash.get(scrollBarNames[i]);
                sb.setVisible(false);
            }
            selectedSB.setBounds(currentSB.getBounds());
            if (selectedSB!=null)
              selectedSB.setVisible(true);
              currentSB = selectedSB;
            sbp.invalidate();
          }
        }
      };

      for (int i=0;i<cbNumber;i++) {      
        checkboxes[i].addItemListener(new radioItemListener(scrollBarNames[0]));
      }
      
      c.anchor = GridBagConstraints.NORTHWEST;
      c.insets=new Insets(1,5,1,5);
      c.gridx = 0; c.gridy = 0; c.weightx = 10;
      c.gridwidth=3;   //Radiobutton UI
      c.gridheight=1;
      c.fill=GridBagConstraints.NONE;
      c.anchor=GridBagConstraints.WEST;
      sbp.add(firstRow,c);
      
      c.gridy=1;
      c.fill=GridBagConstraints.HORIZONTAL;
      for (int i = 0;i<scrollBarNames.length;i++) {
          JScrollBar sb = (JScrollBar) scrollBarHash.get(scrollBarNames[i]);          
          if(sb==null) continue;
          if(currentSB==null) currentSB = sb;
          sbp.add(sb,c);
      }
      
      return sbp;
    }

    public void addUIs() {
        tgUIManager = new TGUIManager();
        GLEditUI editUI = new GLEditUI(this);
        GLNavigateUI navigateUI = new GLNavigateUI(this);
        tgUIManager.addUI(editUI,"Edit");
        tgUIManager.addUI(navigateUI,"Navigate");
        tgUIManager.activate("Navigate");
    }

    public Node addNode() throws TGException {
    	return tgPanel.addNode();
    }
    
    public Node addNode(SOCRNode n)  {
    	try{
    		return tgPanel.addNode(Integer.toString(n.getId()), n.getDisplayName());
    		//return tgPanel.addNode(n.getName());
    	}catch(TGException e){
    		return null;
    	}
    }
    
    public Node addNode(SOCRNode n, Color bg)  { 	    
    		Node node = addNode(n);
    		if (node!=null)
    			node.setBackColor(bg);
    		return node;   	
    }
    
    public Edge addEdge(SOCREdge e, String f, String t) {   
    	
    	Node r = tgPanel.getGES().findNode(f);
    	Node n = tgPanel.getGES().findNode(t);
    	if(r!=n && tgPanel.findEdge(r,n)==null){ 
    		//System.out.println("addEdge: "+f+"->"+t);
		    return tgPanel.addEdge(r,n,Edge.DEFAULT_LENGTH);
    	}else return null;
    }
    
	public void randomGraph() throws TGException {
        Node n1= tgPanel.addNode();
        n1.setType(0);
        for ( int i=0; i<249; i++ ) {
        	tgPanel.addNode();
    	}
        
        TGForEachNode fen = new TGForEachNode() {
            public void forEachNode(Node n) {
				for(int i=0;i<5;i++) {
				    Node r = tgPanel.getGES().getRandomNode();
				    r.setType(4);  //Jenny
				    if(r!=n && tgPanel.findEdge(r,n)==null) 
					    tgPanel.addEdge(r,n,Edge.DEFAULT_LENGTH);	
			    }
			}
		};    	
		tgPanel.getGES().forAllNodes(fen);
	
        tgPanel.setLocale(n1,1);
        tgPanel.setSelectNode(n1);
        try {
       	    Thread.currentThread().sleep(2000); 
        } catch (InterruptedException ex) {}                    				

        getHVScroll().slowScrollToCenter(n1);
    }    

    public static void main(String [] args) {

        final JFrame frame;
        final GLPanel glPanel = new GLPanel();
        frame = new JFrame("TouchGraph GraphLayout");
        frame.addWindowListener(new WindowAdapter() {
            public void windowClosing(WindowEvent e) {
              frame.remove(glPanel);
              frame.dispose();
            }
        });
        frame.add("Center", glPanel);
        frame.setSize(800,600);
        frame.setVisible(true);
    }


} // end com.touchgraph.graphlayout.GLPanel
