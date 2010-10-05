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

import javax.swing.table.AbstractTableModel;

/**
 * Abstract Table Model for displaying the attributes of an provenance element.
 *
 * @version 10 September 2007
 */
public class ElementTableModel extends AbstractTableModel
{
    /** Name of the element. */
    private String _elementName;

    /** Names of the attributes. */
    private String[] _attrNames;

    /** Values of the attributes. */
    private String[] _attrValues;

    /**
     * Constructs an Element Table Model.
     *
     * @param elementName Name of the element.
     * @param attrNames Names of the attributes of the element.
     */
    public ElementTableModel(String elementName, String[] attrNames)
    {
	_elementName = elementName;
	_attrNames = attrNames;

	// Initialize empty values
	_attrValues = new String[_attrNames.length];
	for (int i = 0; i < _attrValues.length; i++) { _attrValues[i] = ""; }
    }

    /**
     * Gets the name of the element.
     *
     * @return Name of the element.
     */
    public String getElementName()
    {
	return _elementName;
    }

    /**
     * Gets the names of the attributes.
     *
     * @return Names of the attributes.
     */
    public String[] getAttributeNames()
    {
	return _attrNames;
    }

    /**
     * Gets the value of the attribute.
     *
     * @param attrName Name of the attribute.
     *
     * @return Value of the attribute.
     */
    public String getAttributeValue(String attrName)
    {
	for (int i = 0; i < _attrNames.length; i++) {
	    if ( _attrNames[i].equals(attrName) ) { return _attrValues[i]; }
	}

	// Attribute not found
	return "";
    }

    /**
     * Sets the value of the attribute.
     *
     * @param attrName Name of the attribute.
     * @param attrValue Value for the attribute.
     */
    public void setAttribute(String attrName, String attrValue)
    {
	// Set the attribute
	for (int i = 0; i < _attrNames.length; i++) {
	    if ( _attrNames[i].equals(attrName) ) {
		setValueAt(attrValue, i+1, 1);
	    }
	}
    }

    /**
     * Returns the number of rows in the model.
     *
     * @return Number of rows in the model.
     */
    public int getRowCount()
    {
	return _attrNames.length + 1;
    }

    /**
     * Returns the number of columns in the model.
     *
     * @return Number of columns in the model.
     */
    public int getColumnCount()
    {
	return 2;
    }

    /**
     * Returns the name of the specified column.
     *
     * @param columnIndex Index of the column.
     *
     * @return Name of the column.
     */
    public String getColumnName(int columnIndex)
    {
	if (columnIndex == 0) { return "Name"; }
	return "Value";
    }

    /**
     * Returns the most specific superclass for all the cell values 
     * in the column.
     *
     * @param columnIndex Index of the column.
     *
     * @return Common ancestor class of the object values in the model.
     */
    public Class getColumnClass(int columnIndex)
    {
	return String.class;
    }

    /**
     * Determines if the specified table cell is editable.
     *
     * @param rowIndex Index of the row.
     * @param columnIndex Index of the column.
     *
     * @return True if the table cell is editable; false otherwise.
     */
    public boolean isCellEditable(int rowIndex, int columnIndex)
    {
	if (columnIndex == 0) { return false; }
	return true;
    }

    /**
     * Returns the value of the specified table cell.
     *
     * @param rowIndex Index of the row.
     * @param columnIndex Index of the column.
     *
     * @return Value of the specified table cell.
     */
    public Object getValueAt(int rowIndex, int columnIndex)
    {
	// Name
	if (columnIndex == 0) {
	    if (rowIndex == 0) {
		return "<html><b>" + _elementName + "</b></html>";
	    }
	    return _attrNames[rowIndex-1];
	}

	// Value
	if (rowIndex == 0) { return ""; }
	return _attrValues[rowIndex-1];
    }
	
    /**
     * Sets the value of the specified table cell.
     *
     * @param newValue New value for the table cell.
     * @param rowIndex Index of the row.
     * @param columnIndex Index of the column.
     */
    public void setValueAt(Object newValue, int rowIndex, int columnIndex)
    {
	if (columnIndex == 0) { return; }
	if (rowIndex == 0) { return; }

	_attrValues[rowIndex-1] = newValue.toString();
    }
}
