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

import edu.ucla.loni.dataflow.SourceTree;
import edu.ucla.loni.dataflow.TreeModule;
import edu.ucla.loni.dataflow.source.DataEncoder;
import edu.ucla.loni.dataflow.source.SourceTranslationListener;
import edu.ucla.loni.dataflow.source.TargetEncoder;
import edu.ucla.loni.debabel.events.engine.DebabelerEngine;
import edu.ucla.loni.debabel.events.engine.SourceFileManager;
import edu.ucla.loni.debabel.events.xml.DebabelerErrorHandler;
import edu.ucla.loni.flow.Module;
import edu.ucla.loni.flow.xml.DecodingException;
import edu.ucla.loni.flow.xml.EncodingException;
import edu.ucla.loni.xml.plugin.XMLReader;
import edu.ucla.loni.xml.plugin.XMLReaderSpi;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URI;

import javax.imageio.metadata.IIOMetadata;
import javax.imageio.stream.FileImageInputStream;
import javax.imageio.stream.ImageOutputStream;
import javax.imageio.stream.MemoryCacheImageInputStream;
import javax.imageio.stream.MemoryCacheImageOutputStream;
import javax.swing.JOptionPane;

import org.w3c.dom.Node;
import org.xml.sax.SAXParseException;



/**
 * Class that parses a file and extracts provenance data.
 *
 * @version 11 September 2007
 */
public class FileParser implements DebabelerErrorHandler,
				   SourceTranslationListener, TargetEncoder
{
    /** Debabeler engine that parses the file. */
    private DebabelerEngine _engine;

    /** Node containing the parsed provenance data. */
    private Node _provenanceNode;

    /**
     * Constructs a File Parser.
     *
     * @param file File to parse and extract provenance data from.
     *
     * @throws IOException If an I/O error occurs.
     */
    public FileParser(File file) throws IOException
    {
	// Check for an XML file
	FileImageInputStream fis = new FileImageInputStream(file);
	XMLReaderSpi spi = new XMLReaderSpi();
	if ( spi.canDecodeInput(fis) ) {
	    XMLReader reader = (XMLReader)spi.createReaderInstance();
	    reader.setInput(fis);

	    // Get the DOM Node
	    IIOMetadata metadata = reader.getTextMetadata();
	    _provenanceNode = metadata.getAsTree("edu_ucla_loni_xml_1.0");
	    return;
	}

	// Initialize the Debabeler engine
	_engine = new DebabelerEngine(this, this);
	_engine.registerDefaultMappings(this);

	// Add the file to the source file manager
	SourceFileManager fileManager = _engine.getSourceFileManager();
	fileManager.addSourceFile(file);

	// Execute the engine
	_engine.identifyAndGroup();
	_engine.translate( new String[]{"provenance"} );
    }

    /**
     * Gets the parsed provenance data.
     *
     * @return Node containing the parsed provenance data.
     */
    public Node getProvenanceNode()
    {
	return _provenanceNode;
    }

    /**
     * Encodes data to the specified target.
     *
     * @param targetTree Source Tree that describes the target.
     * @param data Tree Module of data to encode.
     *
     * @return String representation of the targets written to.
     *
     * @throws IOException If an I/O error occurs.
     */
    public String[] encodeData(SourceTree targetTree, TreeModule data)
	throws IOException
    {
	// Get the Data Encoder
	DataEncoder encoder = DataEncoder.getDataEncoder(data);
	if (encoder == null) {
	    String msg = "Unable to find an encoder.";
	    throw new IOException(msg);
	}

	// Buffer the output
	ByteArrayOutputStream outStream = new ByteArrayOutputStream();
	ImageOutputStream[] streams = new ImageOutputStream[1];
	streams[0] = new MemoryCacheImageOutputStream(outStream);

	// Encode the data to the buffer
	try {
	    encoder.writeData(streams);
	    streams[0].close();
	}

	catch (Exception e) {
	    String msg = "Unable to encode data.";
	    IOException ioe = new IOException(msg);
	    ioe.initCause(e);
	    throw ioe;
	}

	// Get an input stream to the buffer
	byte[] buffer = outStream.toByteArray();
	ByteArrayInputStream b = new ByteArrayInputStream(buffer);
	MemoryCacheImageInputStream mciis = new MemoryCacheImageInputStream(b);

	// Convert the buffer to a DOM Node
	try {

	    // Initialize the XML reader
	    XMLReaderSpi spi = new XMLReaderSpi();
	    XMLReader reader = (XMLReader)spi.createReaderInstance();
	    reader.setInput(mciis);

	    // Get the DOM Node
	    IIOMetadata metadata = reader.getTextMetadata();
	    _provenanceNode = metadata.getAsTree("edu_ucla_loni_xml_1.0");
	}

	catch (Exception e) {
	    String msg = "Unable to encode data.";
	    IOException ioe = new IOException(msg);
	    ioe.initCause(e);
	    throw ioe;
	}

	// Return the target
	return new String[]{"Provenance XML"};
    }

    /**
     * Called by a Source Translator when multiple sources are about to be
     * identified.
     */
    public void multipleSourceIdentificationBegun()
    {
    }

    /**
     * Called by a Source Translator when a source name has been identified.
     *
     * @param sourceName Name of the identified source.
     * @param uris URI's that have been identified.
     */
    public void sourceIdentified(String sourceName, URI[] uris)
    {
    }

    /**
     * Called by a Source Translator when a source is misidentified.
     *
     * @param sourceName Misidentified source name.
     * @param e Exception resulting from the error.
     * @param uris URI's that were misidentified.
     */
    public void sourceMisidentified(String sourceName, Exception e, URI[] uris)
    {
	sourceNotIdentified(e, uris);
    }

    /**
     * Called by a Source Translator when a source name can not be identified.
     *
     * @param e Exception resulting from the error.
     * @param uris URI's that have not been identified.
     */
    public void sourceNotIdentified(Exception e, URI[] uris)
    {
	_engine.stopEngine();

	// Cannot read the file
	String msg = "Unable to read the file:\n" + e.getMessage();
	JOptionPane.showMessageDialog(null, msg, "Unrecognized File",
				      JOptionPane.ERROR_MESSAGE);
    }

    /**
     * Called by a Source Translator when multiple sources have been identified.
     *
     * @param successNumber Number of successful sources identified.
     */
    public void multipleSourceIdentificationEnded(int successNumber)
    {
    }

    /**
     * Called by a Source Translator when multiple sources are about to be
     * assigned group ids.
     */
    public void multipleGroupAssignmentBegun()
    {
    }

    /**
     * Called by a Source Translator when a group id for a source has been
     * assigned.
     *
     * @param groupId Group id assigned.
     * @param uris URI's that have been assigned a group id.
     */
    public void groupIdAssigned(String groupId, URI[] uris)
    {
    }

    /**
     * Called by a Source Translator when the group id for a source cannot be
     * assigned.
     *
     * @param e Exception resulting from the error.
     * @param uris URI's that have not been assigned a group id.
     */
    public void groupIdNotAssigned(Exception e, URI[] uris)
    {
    }

    /**
     * Called by a Source Translator when multiple sources have been assigned
     * group ids.
     *
     * @param successNumber Number of successful group ids assigned.
     */
    public void multipleGroupAssignmentEnded(int successNumber)
    {
    }

    /**
     * Called by a Source Translator when multiple sources are about to be
     * translated.
     */
    public void multipleTranslationBegun()
    {
    }

    /**
     * Called by a Source Translator when multiple sources have been separated
     * into translation groups.
     *
     * @param numberOfGroups Number of translation groups formed.
     */
    public void translationGroupsFormed(int numberOfGroups)
    {
    }

    /**
     * Called by a Source Translator when a source has been decoded and its
     * values have been copied into a translation.
     *
     * @param sourceName Name of the source.
     * @param uris URI's that have been decoded and whose values have been
     *             copied into a translation.
     */
    public void sourceDataLoaded(String sourceName, URI[] uris)
    {
    }

    /**
     * Called by a Source Translator when a source has not been decoded and
     * its values were not copied into a translation.
     *
     * @param e Exception resulting from the error.
     * @param sourceName Name of the source.
     * @param uris URI's that have not been decoded and whose values were not
     *             copied into a translation.
     */
    public void sourceDataNotLoaded(Exception e, String sourceName, URI[] uris)
    {
	sourceNotIdentified(e, uris);
    }

    /**
     * Called by a Source Translator when a target has been written after a
     * successful translation.
     *
     * @param targetName Name of the target.
     * @param target String representation of the target.
     */
    public void targetDataWritten(String targetName, String[] target)
    {
    }

    /**
     * Called by a Source Translator when target data could not be written due
     * to an unsuccessful translation.
     *
     * @param e Exception resulting from the error.
     * @param targetName Name of the target.
     */
    public void targetDataNotWritten(Exception e, String targetName)
    {
    }

    /**
     * Called by a Source Translator when a translation group is translated.
     *
     * @param sourceNames Names of the translation sources.
     * @param targetNames Names of the translation targets.
     */
    public void groupTranslated(String[] sourceNames, String[] targetNames)
    {
    }

    /**
     * Called by a Source Translator when a translation group cannot be
     * translated.
     *
     * @param e Exception resulting from the error.
     * @param uris URI's that have not been translated.
     * @param sourceNames Names of the translation sources.
     * @param targetNames Names of the translation targets.
     */
    public void groupNotTranslated(Exception e, URI[] uris,
				   String[] sourceNames,
				   String[] targetNames)
    {
	sourceNotIdentified(e, uris);
    }      

    /**
     * Called by a Source Translator when multiple sources have been translated.
     *
     * @param successNumber Number of successful translations.
     */
    public void multipleTranslationEnded(int successNumber)
    {
    }

    /**
     * Called by a Flow Engine whenever it starts directing flow through a
     * Module.
     *
     * @param module Module that the Flow Engine is starting to direct flow
     *               through.
     */
    public void flowStarted(Module module)
    {
    }

    /**
     * Called by a Flow Engine whenever it finishes directing flow through a
     * Module.
     *
     * @param module Module that the Flow Engine has finished directing flow
     *               through.
     */
    public void flowFinished(Module module)
    {
    }

    /**
     * Receives notification of a parser warning.
     *
     * @param e Exception resulting from the warning.
     */
    public void warning(SAXParseException e)
    {
    }

    /**
     * Receives notification of a recoverable parser error.
     *
     * @param e Exception resulting from the recoverable error.
     */
    public void error(SAXParseException e)
    {
	_displayError(e);
    }

    /**
     * Receives notification of a non-recoverable parser error.
     *
     * @param e Exception resulting from the non-recoverable error.
     */
    public void fatalError(SAXParseException e)
    {
	_displayError(e);
    }

    /**
     * Receives notification of a decoding error.
     *
     * @param e Exception resulting from the decoding error.
     */
    public void decodeError(DecodingException e)
    {
	_displayError(e);
    }

    /**
     * Receives notification of an encoding error.
     *
     * @param e Exception resulting from the encoding error.
     */
    public void encodeError(EncodingException e)
    {
	_displayError(e);
    }

    /** 
     * Displays an error dialog.
     *
     * @param e Exception resulting from the error.
     */
    private void _displayError(Exception e)
    {
	_engine.stopEngine();

	String msg = "Error:\n" + e.getMessage();
	JOptionPane.showMessageDialog(null, msg, "Error",
				      JOptionPane.ERROR_MESSAGE);
    }
}
