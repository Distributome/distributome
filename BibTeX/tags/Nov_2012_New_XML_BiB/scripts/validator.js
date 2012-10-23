$(document).ready(function() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "Distributome.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;

    DistributomeXML_Objects = xmlDoc.documentElement.childNodes;

    var divContent = document.getElementById('wrapper-content');
    var content = '';

    var i_corr = 0;

    for (i = 0; i < DistributomeXML_Objects.length; i++) {

        var j_corr = 0;

        if (DistributomeXML_Objects[i].nodeType == 1) {

            //Process only level=1 element nodes (type 1)
            content += DistributomeXML_Objects[i].nodeName + " : "
                + DistributomeXML_Objects[i].childNodes[0].nodeValue;
            content += "<br />";

            Level1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].childNodes;
            // Level1Prop = vector of "distributions"
            currLevel1Prop=xmlDoc.getElementsByTagName(DistributomeXML_Objects[i].nodeName)[0].firstChild;
            // currLevel1Prop = "first distribution" object (arc-sine distribution)

            if (i < 5) {	// for "distributions" and "relations" objects ****/

                if (i == 1)
                    content += "<br />DISTRIBUTIONS ... <br />";
                else if (i == 3)
                    content += "<br />RELATIONS ... <br />";

                for (j = 0; j < Level1Prop.length; j++) {
                    var k_corr = 0;
                    if (currLevel1Prop.nodeType == 1) {

                        //Process only level=2 element nodes (type 1)
                        content += "------" + currLevel1Prop.nodeName + ": " +
                            currLevel1Prop.childNodes[0].nodeValue;
                        // currLevel1Prop.childNodes[0].nodeValue == "distribution"
                        content += "<br />";

                        Level2Prop = xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j - j_corr].childNodes;
                        //Level2Prop = vector of property-objects for "distribution" parent
                        currLevel2Prop = xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j - j_corr].firstChild;
                        // currLevel2Prop = "first" property object "name" for the first "distribution"

                        for (k = 0; k < Level2Prop.length; k++) {
                            try {
                                if (currLevel2Prop.nodeType == 1) {
                                    //Process only level=3 element nodes (type 1)
                                    if(currLevel2Prop.nodeName == 'cite') {

                                        content += "<div class='citation'>" + currLevel2Prop.childNodes[0].nodeValue + "</div>"

                                    } else {
                                        content += "---------" + currLevel2Prop.nodeName + ": " +
                                            currLevel2Prop.childNodes[0].nodeValue;
                                    }
                                    content += "<br />";
                                } else
                                    k_corr++;

                                currLevel2Prop = currLevel2Prop.nextSibling;

                            } catch (err) {
                                content += "Empty tag: " +
                                    currLevel2Prop.nodeName + "<br />";
                            }
                        }
                    } else
                        j_corr++;

                    currLevel1Prop = currLevel1Prop.nextSibling;
                }
                // End for "distributions" and "relations" objects
            } else if (i == 5) { // for "references" objects - separated because each reference is of

                // different type - e.g., books, reports, articles, etc.
                content += "<br />REFERENCES ...<br />";
                for (j = 0; j < Level1Prop.length; j++) {
                    var k_corr = 0;

                    if (currLevel1Prop.nodeType == 1) {

                        //Process only level=2 element nodes (type 1)
                        content += "------" + currLevel1Prop.nodeName + ": " +
                            currLevel1Prop.childNodes[0].nodeValue;
                        // currLevel1Prop.childNodes[0].nodeValue == "distribution"
                        content += "<br />";

                        Level2Prop = xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j - j_corr].childNodes;
                        //Level2Prop = vector of property-objects for "distribution" parent
                        currLevel2Prop = xmlDoc.getElementsByTagName(Level1Prop[j].nodeName)[j - j_corr].firstChild;
                        // currLevel2Prop = "first" property object "name" for the first "distribution"

                        for (k = 0; k < Level2Prop.length; k++) {
                            try {
                                if (currLevel2Prop.nodeType == 1) {

                                    //Process only level=3 element nodes (type 1)
                                    content += "---------" + currLevel2Prop.nodeName + ": " +
                                        currLevel2Prop.childNodes[0].nodeValue;
                                    //currLevel2Prop.childNodes[k-k_corr].nodeValue);

                                    content += "<br />";
                                } else
                                    k_corr++;

                                currLevel2Prop = currLevel2Prop.nextSibling;

                            } catch (err) {
                                content += "Empty tag: " +
                                    currLevel2Prop.nodeName + "<br />";
                            }
                        }
                    } else
                        j_corr++;

                    currLevel1Prop = currLevel1Prop.nextSibling;
                }
            } // End for "references" objects
            /*******/
            content += "<br />";
        } else
            i_corr++;
    }

    // Add content to the page
    divContent.innerHTML = content;

    // Replace citations with info from Distributome.bib
    var cites = document.getElementsByClassName('citation');
    for(i = 0; i < cites.length; i++) {
        BibtexManager.pasteCitationByCiteTag(cites[i].innerHTML
            , function(citation) {
                cites[i].innerHTML = "---------cite: " + citation;
             }
        );
    }

    MathJax.Hub.Queue(["Typeset",MathJax.Hub,divContent]);
});