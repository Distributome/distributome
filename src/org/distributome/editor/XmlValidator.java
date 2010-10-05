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

import java.io.InputStream;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.xml.sax.EntityResolver;
import org.xml.sax.ErrorHandler;
import org.xml.sax.InputSource;
import org.xml.sax.SAXParseException;

/**
 * Class that validates an XML encoded stream using an XSD.
 *
 * @version 11 September 2007
 */
public class XmlValidator implements EntityResolver, ErrorHandler
{
    /** XSD URI used to validate the XML. */
    private static String XSD_URI = "distributome.xsd";

    /** Invalidation messages. */
    private StringBuffer _invalidMsgs;

    /** Constructs an XML Validator. */
    public XmlValidator()
    {
    }

    /**
     * Validates the encoded XML in the input stream.
     *
     * @param xmlStream Encoded XML.
     *
     * @return Invalidation messages, or the empty string if the XML file is
     *         valid.
     */
    public String validate(InputStream xmlStream)
    {
	_invalidMsgs = new StringBuffer();

	try {

	    // Get the factory for obtaining XML parsers
	    DocumentBuilderFactory factory=DocumentBuilderFactory.newInstance();

	    // Set the attributes for reading XML schema
	    String l = "http://java.sun.com/xml/jaxp/properties/schemaLanguage";
	    String w3c = "http://www.w3.org/2001/XMLSchema";
	    String src = "http://java.sun.com/xml/jaxp/properties/schemaSource";
	    try {
		factory.setAttribute(l, w3c);
		factory.setAttribute(src, XSD_URI);
	    }

	    // Requires Java 1.5 or higher
	    catch (Exception e) { return "Java 1.5 or higher is required"; }

	    // Make the XML parsers aware of name spaces
	    factory.setNamespaceAware(true);

	    // Make the XML parsers validate the XML code using the given XSD
	    factory.setValidating(true);

	    // Make the XML parsers ignore comments in the XML
	    factory.setIgnoringComments(true);

	    // Make the XML parsers eliminate ignorable spaces
	    factory.setIgnoringElementContentWhitespace(true);

	    // Obtain an XML parser from the factory with these constraints
	    DocumentBuilder builder = factory.newDocumentBuilder();
	    builder.setErrorHandler(this);

	    // Set a new Entity Resolver to read the XSD file from a jar file
	    builder.setEntityResolver(this);

	    // Parse the XML document from the input stream
	    Document document = builder.parse(xmlStream, XSD_URI);
	}
	catch (SAXParseException e) { return _getFormattedDesc(e); }
	catch (Exception e) {
	    e.printStackTrace();
	    return e.getMessage();
	}

	return _invalidMsgs.toString();
    }

    /**
     * Resolves access to external entities.
     *
     * @param publicId Public identifier of the external entity being
     *                 referenced, or null if none was supplied.
     * @param systemId System identifier of the external entity being
     *                 referenced.
     *
     * @return InputSource object describing the new input source, or null to
     *         request that the parser open a regular URI connection to the
     *         system identifier.
     */
    public InputSource resolveEntity(String publicId, String systemId)
    {
        InputStream inStream = null;

	// Get the XSD
	try {
	    inStream = getClass().getClassLoader().getResourceAsStream(XSD_URI);
	}
	catch (Exception e) { e.printStackTrace(); }

	// Return an Input Source to the File
        if (inStream != null) { return new InputSource(inStream); }
        return null;
    }

    /**
     * Receives notification of a parser warning.
     *
     * @param e Exception resulting from the warning.
     */
    public void warning(SAXParseException e)
    {
	// No warning messages
    }

    /**
     * Receives notification of a recoverable parser error.
     *
     * @param e Exception resulting from the recoverable error.
     */
    public void error(SAXParseException e)
    {
	// Add the error message
	_invalidMsgs.append(_getFormattedDesc(e));
    }

    /**
     * Receives notification of a non-recoverable parser error.
     *
     * @param e Exception resulting from the non-recoverable error.
     */
    public void fatalError(SAXParseException e)
    {
	error(e);
    }

    /**
     * Gets a formatted description of the parsing error.
     *
     * @param e Parsing error.
     *
     * @return Formatted description of the parsing error.
     */
    private static String _getFormattedDesc(SAXParseException e)
    {
        // Truncate the error message if it is too long
        String msg = e.getMessage();
        if (msg.length() > 200) { msg = msg.substring(0, 200) + "..."; }
 
        // Return the formatted message
        return msg + "\n";
    }
}
