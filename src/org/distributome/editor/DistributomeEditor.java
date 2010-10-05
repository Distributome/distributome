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

 package org.distributome.editor;

import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.KeyStroke;

import org.distributome.data.SOCREdge;
import org.distributome.data.SOCRFormula;
import org.distributome.data.SOCRNode;
import org.distributome.data.SOCRReference;


public class DistributomeEditor extends JFrame implements ActionListener
{
    /** Application name. */
    private static String APPLICATION_NAME = "Distributome Editor";

    /** Resource name of the LONI look-and-feel package. */
   // private static String LOOK_AND_FEEL = "/theme/theme.zip";

    /** Main Panel. */
    private ElementPanel _mainPanel;

    /** Last user-selected source file. */
    private File _lastSourceFile;

    /** Last user-selected provenance file. */
    private URL codeBase;
    
    private TreeTableCodec modelMaker;

    /** Constructs a Provenance Editor. */
    public DistributomeEditor()
    {
	super(APPLICATION_NAME);
	getContentPane().setLayout( new BorderLayout() );
	
	// Set the LONI look-and-feel
	//_setLoniLookAndFeel();

	// Create the menu bar
	JMenuBar menuBar = new JMenuBar();
	setJMenuBar(menuBar);

	// File Menu
	JMenu fileMenu = new JMenu("File");
	menuBar.add(fileMenu);

	// File Menu - New
	JMenuItem item = new JMenuItem("New");
/*	item.addActionListener(this);
	item.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_N,
						   InputEvent.CTRL_DOWN_MASK));
	fileMenu.add(item);*/

	// File Menu - Open
	/*item = new JMenuItem("Open ...");
	item.addActionListener(this);
	item.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_O,
						   InputEvent.CTRL_DOWN_MASK));
	fileMenu.add(item);*/

	// File Menu - ###########
	fileMenu.addSeparator();

	// File Menu - Save
	item = new JMenuItem("Save ...");
	item.addActionListener(this);
	item.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_S,
						   InputEvent.CTRL_DOWN_MASK));
	fileMenu.add(item);

	// File Menu - ###########
/*	fileMenu.addSeparator();

	// File Menu - Close
	item = new JMenuItem("Close");
	item.addActionListener(this);
	item.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_W,
						   InputEvent.CTRL_DOWN_MASK));
	fileMenu.add(item);*/

	// File Menu - Quit
	item = new JMenuItem("Quit");
	item.addActionListener(this);
	item.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_Q,
						   InputEvent.CTRL_DOWN_MASK));
	fileMenu.add(item);

	// Create the table models
	modelMaker = new TreeTableCodec();
	
	// Add a scrollable main panel
	_mainPanel = new ElementPanel(modelMaker);
	
	getContentPane().add(new JScrollPane(_mainPanel), BorderLayout.CENTER);

	// Add a message bar
// 	JLabel message = new JLabel("Cut (Ctrl+X); Copy (Ctrl+C); " +
// 				    "Paste (Ctrl+V)");
// 	getContentPane().add(message, BorderLayout.SOUTH);

	// Display
	setDefaultCloseOperation(DISPOSE_ON_CLOSE);	
    }

    public void setCodeBase(URL _codeBase){
    	codeBase = _codeBase;
    }
    
    public void loadElements(SOCRNode node){
    	modelMaker.loadNode(node); 
    	
    } 
    public void loadElements(SOCREdge edge){
    	modelMaker.loadEdge(edge);    	
    }
    public void loadElements(SOCRFormula formula){
    	modelMaker.loadFormula(formula);    	
    }
    public void loadElements(SOCRReference ref){
    	modelMaker.loadRef(ref);    	
    }
    
    public void showView(){
    	_mainPanel.setTableModels();
    	pack();
    	setVisible(true);
    }
    
    /**
     * Performs the specified action.
     *
     * @param e Action event.
     */
    public void actionPerformed(ActionEvent e)
    {
	String command = e.getActionCommand();

	// New
	if ( command.equals("New") ) { new DistributomeEditor(); }

	// Open
	else if ( command.equals("Open ...") ) {

	    // Get the source file to open
	/*    JFileChooser chooser = new JFileChooser(_lastSourceFile);
	    chooser.setDialogTitle("Open ...");
	    chooser.setSelectedFile(_lastSourceFile);
	    int returnValue = chooser.showOpenDialog(this);

	    // No user-selected file
	    if ( returnValue != JFileChooser.APPROVE_OPTION ) { return; }

	    try {
		_lastSourceFile = chooser.getSelectedFile();

		// Parse the file for provenance data
		FileParser parser = new FileParser(_lastSourceFile);
		Node provNode = parser.getProvenanceNode();

		// Convert the provenance data to tabular data
	
		modelMaker.toTableModels(provNode);

		// Replace the data in the main panel
		_mainPanel.setTableModels();
	    }
	    catch (Exception ex) {
		String msg = "Unable to parse:  " + ex.getMessage();
		JOptionPane.showMessageDialog(this, msg, "Parse Error",
					      JOptionPane.ERROR_MESSAGE);
	    }*/
	}

	// Save
	else if ( command.equals("Save ...") ) {

		
	    // Get the provenance file to write
		String DATE_FORMAT_NOW = "yyMMddHHmm";
		Calendar cal = Calendar.getInstance();
	    SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT_NOW);
		File file = null;
		try {
			file = new File(codeBase+"Distributome_"+sdf.format(cal.getTime())+".xml").getCanonicalFile();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	//	System.out.println(file);
	    JFileChooser chooser = new JFileChooser(file);
	    chooser.setDialogTitle("Save ...");
	   
	    
	   // File f = new File((String)codeBase).getCanonicalFile();
	    
	 //   System.out.println("codeBase="+ new File(codeBase.toString()));
	    if (codeBase.toString().startsWith("http")){
	    	
	    }else if(codeBase.toString().startsWith("file"))
	    	 chooser.setCurrentDirectory(new File(codeBase.toString().substring("file:".length())));
		
	  //  System.out.println("chooser current directory ="+chooser.getCurrentDirectory());
	 
	    ExampleFileFilter filter = new ExampleFileFilter();
	    filter.addExtension("xml");
	    
	    chooser.setFileFilter(filter);
	    chooser.setSelectedFile(file);
	    int returnValue = chooser.showSaveDialog(this);

	    // No user-selected file
	    if ( returnValue != JFileChooser.APPROVE_OPTION ) { return; }
	    file = chooser.getSelectedFile();

	    // Convert the tabular data to XML
	    ElementTableModel[] nodeModels = _mainPanel.getNodeModels();
	    ElementTableModel[] edgeModels = _mainPanel.getEdgeModels();
	    ElementTableModel[] formulaModels = _mainPanel.getFormulaModels();
	    ElementTableModel[] refModels = _mainPanel.getRefModels();
	    
	    String xml = TreeTableCodec.toXml(nodeModels, edgeModels, formulaModels, refModels);
	    
	 //   System.out.println("output xml = \n"+xml);

	    // Validate the XML contents
	    byte[] b = xml.getBytes();
	    ByteArrayInputStream inputStream = new ByteArrayInputStream(b);
	    XmlValidator validator = new XmlValidator();
	    String invalidMsgs = validator.validate(inputStream);

	    // XML is invalid
	    if ( !"".equals(invalidMsgs) ) {
		String msg = "Invalid Fields:\n" + invalidMsgs;
		JOptionPane.showMessageDialog(this, msg, "Invalid Error",
					      JOptionPane.ERROR_MESSAGE);
		return;
	    }

	    // Write the XML to disk
	    try {
		FileWriter fWriter = new FileWriter(file);
		BufferedWriter bWriter = new BufferedWriter(fWriter);
		PrintWriter pWriter = new PrintWriter(bWriter);

		pWriter.write(xml);
		pWriter.flush();
		pWriter.close();
	    }
	    catch (Exception ex) {
		String msg = "Unable to write:  " + ex.getMessage();
		JOptionPane.showMessageDialog(this, msg, "Write Error",
					      JOptionPane.ERROR_MESSAGE);
	    }
	    
	}

	// Close
	else if ( command.equals("Close") ) { dispose(); }

	// Quit
	else if ( command.equals("Quit") ) { System.exit(0); }
    }

    /**
     * Main application method.
     *
     * @param args Command-line arguments.
     */
    public static void main(String[] args) 
    {
	// Add for OS X
	System.setProperty("com.apple.mrj.application.apple.menu.about.name",
			   APPLICATION_NAME);

	new DistributomeEditor ();
    }

}
