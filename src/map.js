import LayerGroup from 'ol/layer/Group';
import tableFunctions from './modules/tables/tablesDOMFunctions';
import {
    glowingStyle,
    substationStyle,
    adminBoundeleselectedStyle,
    multiVarPointStyleFunction, defaultStyle, styleFunction, adminBoundaryStyle
} from './modules/style'
import { handleMapInfoBoxClick } from './modules/infoBox'
import {
    getOptionDOMValues
} from './modules/domElements';

import VectorLayer from 'ol/layer/Vector';
import {
    OSM,
    Vector as VectorSource
} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {
    initMap,
    createVectorLayer, createSubVectorLayer
} from './init'
import {
    province,
    commune,
    upezilla,
    featureKeys
} from './modules/variables'

import {
    generateTable,
    clearTable, generateTableDataHeader, generateTable1, generateTableDataRow
} from './modules/table'

import {
    generateCharts
} from './modules/charts'
import GeometryCollection from 'ol/geom/GeometryCollection';
import * as olExtent from 'ol/extent';
import {
    generateChartData,
    createChartData,
    createChart,
    clearUpazilaCharts,
    clearDistCharts,
    clearDivCharts
} from './modules/charts'
import {
    countFeatures,
    createUniqueAttributes,
    updateObjectKeyValue
} from './modules/processing'
import { textPointStyle, customSVGPointStyle, starPointStyle, crossPointStyle, squarePointStyle, defaultPointStyle } from './modules/pointStyle'
import { classesValues } from './modules/dataStore'
import { getLayers, map } from './fetchData';
import { autocomplete } from './modules/searchAutoComplete';
import { Fill, Stroke, Style, Text, Circle, RegularShape } from "ol/style";



// Display loading indicator
document.getElementById("loadingIndicator").style.display = "block";

function resetLayerHighlights(map) {
    const powerLayerFeatures = map.getAllLayers()[2].getSource().getFeatures();
    const adminLayerFeatures = map.getAllLayers()[1].getSource().getFeatures();

    powerLayerFeatures.forEach(unsetHighlight);
    adminLayerFeatures.forEach(unsetHighlight);

   
    

    function unsetHighlight(feature) {
        feature.setStyle(null); // This removes the style from the feature
    }


}





let searchTerm
let selected //= 'Sylhet Division';



const selectedPointStyle = (feature) => {


    /*if (feature.get(province) === selected || feature.get(commune) === selected || feature.get('name_en') === selected) {
        setTimeout(() => {
            feature.setStyle(styleFunction(feature));
        }, 2000); // 5000 milliseconds (5 seconds)
        //console.log('selected')
        return glowingStyle
       
    }*/

   
        feature.setStyle(glowingStyle(feature));
    
    //return styleFunction(feature)
}
const selectedPolyStyle = (feature) => {

    /*if (feature.get(province) === selected || feature.get(commune) === selected || feature.get('name_en') === selected) {
        setTimeout(() => {
            feature.setStyle(defaultStyle);
        }, 5000); // 5000 milliseconds (5 seconds)
        //console.log('selected')
        return defaultStyle
    }*/
    //return adminBoundaryStyle

    feature.setStyle(defaultStyle)
}



const highlightStyle = new Style({
    image: new Circle({
        radius: 4,
        fill: new Fill({
            color: '#33A1DE', // Light blue fill
        }),
        stroke: new Stroke({
            color: '#FFFFFF', // grey stroke
            width: 1,
        })
    })
});

// Function to apply highlight style to a feature
const highlightFeature = (feature) => {
    feature.setStyle(highlightStyle);
};

// Function to unset (remove) highlight style from a feature

/****************************************************************************************** */

const divName = document.getElementsByClassName('div-name')
const distName = document.getElementsByClassName('dist-name')
const upazilaName = document.getElementsByClassName('upazila-name')


for (let i = 0; i < divName.length; i++) {
    divName[i].textContent;
}


/****************************************************************************************** */

const countDisplayDistricts = document.getElementById('countDisplayDistricts');
const countDisplayUpezillas = document.getElementById('countDisplayUpezillas');
const adminName = document.getElementById('adminName');
const countDisplayedFeatures = document.getElementById('countDisplayedFeatures');
const countDisplayDivisions = document.getElementById('countDisplayDivisions');


/******************************************************************************************* */

function updateCountDisplay(element, count, label) {
    element.textContent = `${count} ${label}`;
}




getLayers()

map.on('click', function(event) {
    handleMapInfoBoxClick(event, map)
});


/************************************************************************ */

document.getElementById('clear-icon').addEventListener('click', function () {
    var searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    document.querySelector('.clear-icon').style.display = 'none';
    const powerLayerFeatures = map.getAllLayers()[2].getSource().getFeatures();
    const adminLayerFeatures = map.getAllLayers()[1].getSource().getFeatures();
    clearTable()
    resetLayerHighlights(map)
    generateTable(createUniqueAttributes(powerLayerFeatures, 'name_en'))
});

function getSearchTerm(event) {
    event.preventDefault
    var clearIcon = document.querySelector('.clear-icon');
    clearIcon.style.display = this.value.length ? 'block' : 'none';
    const layer = map.getAllLayers()[2]
   
    // Get unique values for province, commune, and upezila
    const uniqueProvinces = Array.from(new Set(layer.getSource().getFeatures().map(function (feature) {
        return feature.get(province);
    })));

    const uniqueCommunes = Array.from(new Set(layer.getSource().getFeatures().map(function (feature) {
        return feature.get(commune);
    })));

    const uniqueUpezilas = Array.from(new Set(layer.getSource().getFeatures().map(function (feature) {
        return feature.get(upezilla);
    })));

    // Combine unique values
    const uniqueValues = [...uniqueProvinces, ...uniqueCommunes, ...uniqueUpezilas];

    console.log(uniqueValues)

    const searchInputTerm = document.getElementById('searchInput')
    // Filter unique values based on the search query



    //Autocomplete

    const query = searchInputTerm.value.toLowerCase();
    // Filter features based on the first letter of the input
    var filteredValues = uniqueValues.filter(function (value) {
        return value.toLowerCase().includes(query);
    });


    console.log(filteredValues);
    autocomplete(searchInputTerm, filteredValues, function (selectedValue) {
        // Do something with the selected value
        if (selectedValue) {
            selected = selectedValue
            onclickDivision(selected)
        }




    });

    selected = searchInputTerm.value.trim()
    onclickDivision(selected)


    console.log(searchInputTerm.value.trim());
}

document.getElementById('searchInput').addEventListener('input', getSearchTerm)



function onclickDivision(term) {


    const layer = map.getAllLayers()[2]
    const adminLayerFeatures = map.getAllLayers()[1].getSource().getFeatures()
    const features = layer.getSource().getFeatures();
    const summaryStatsElement = document.getElementById('summary-stats')

    const table = document.createElement('table');

    searchTerm = term;

    // adminName.innerHTML = `${searchTerm}`

    const divName = document.getElementsByClassName('div-name')
    const distName = document.getElementsByClassName('dist-name')
    const upazilaName = document.getElementsByClassName('upazila-name')

    //const filteredFeatures = features.filter(feature => feature.get(province)=== searchTerm||feature.get(commune)=== searchTerm||feature.get(upezilla) === searchTerm);
    const filteredFeatures = features.filter(feature => feature.get(province) === searchTerm || feature.get(commune) === searchTerm || feature.get(upezilla) === searchTerm);
    const filteredFeaturesAd = adminLayerFeatures.filter(feature => feature.get(province) === searchTerm || feature.get(commune) === searchTerm || feature.get(upezilla) === searchTerm);


    if (filteredFeatures.length > 0) {
        const extent = olExtent.boundingExtent(filteredFeatures.map(feature => feature.getGeometry().getExtent()));
        //console.log(filteredFeatures)

        map.getView().fit(extent, {
            padding: [10, 10, 10, 10],
            duration: 1000
        });
        // Create charts
        clearDivCharts()
        clearDistCharts()
        clearUpazilaCharts()

        const filteredFeaturesDiv = features.filter(feature => feature.get(province) === searchTerm);
        const filteredFeaturesDist = features.filter(feature => feature.get(commune) === searchTerm);
        const filteredFeaturesUpe = features.filter(feature => feature.get(upezilla) === searchTerm);

        resetLayerHighlights(map)

        // Apply highlight style to the filtered features
        filteredFeatures.forEach(selectedPointStyle);
        filteredFeaturesAd.forEach(selectedPolyStyle)


        if (filteredFeaturesDiv.length > 0) {


            clearTable();
            generateTable(createUniqueAttributes(filteredFeaturesDiv, 'name_en'))

            for (let i = 0; i < divName.length; i++) {
                divName[i].textContent = ''
                divName[i].textContent = searchTerm; // You can perform actions on each element here
            }

            for (let i = 0; i < distName.length; i++) {
                distName[i].textContent = ''

            }
            for (let i = 0; i < upazilaName.length; i++) {
                upazilaName[i].textContent = ''

            }




            for (let i = 0; i < featureKeys.length; i++) {

                // Statistical tables
                // Append the generated table to the summaryStatsElement
                table.appendChild(generateTableDataHeader(filteredFeaturesDiv, table, featureKeys[i]));
                const generatedTableRow = generateTableDataRow(filteredFeaturesDiv, searchTerm, table, featureKeys[i]);
                table.appendChild(generatedTableRow);
                summaryStatsElement.appendChild(table);

            }


            let filteredDataDiv = generateChartData(filteredFeaturesDiv);
            createChart(`graph_div_class`, `bar`, filteredDataDiv.class);
            createChart(`graph_div_class_1`, `bar`, filteredDataDiv.class_1);
            createChart(`graph_div_class_1_13`, `bar`, filteredDataDiv.class_1_13);
            createChart(`graph_div_class_1_14`, `bar`, filteredDataDiv.class_1_14);
            createChart(`graph_div_class_1_15`, `bar`, filteredDataDiv.class_1_15);
            createChart(`graph_div_class_12`, `bar`, filteredDataDiv.class_12);

        }
        if (filteredFeaturesDist.length > 0) {

            clearTable();
            generateTable(createUniqueAttributes(filteredFeaturesDist, 'name_en'))
            // Assuming you have already defined filteredFeaturesDist
            const uniqueValuesSetDiv = new Set();

            // Iterate through filteredFeaturesDist to get unique province values
            filteredFeaturesDist.forEach(feature => {
                //console.log(feature.get(province));
                const attributeValue = feature.get(province);

                // Check if the attributeValue is defined (not undefined)
                if (attributeValue !== undefined) {
                    uniqueValuesSetDiv.add(attributeValue);
                }
            });

            // Convert the Set to an array
            let uniquefilteredDataDiv = Array.from(uniqueValuesSetDiv);

            // Now, uniquefilteredDataDiv contains an array of unique province values
            //console.log(uniquefilteredDataDiv);

            for (let i = 0; i < divName.length; i++) {
                divName[i].textContent = ''
                divName[i].textContent = uniquefilteredDataDiv[0]; // You can perform actions on each element here
            }

            for (let i = 0; i < distName.length; i++) {
                distName[i].textContent = ''
                distName[i].textContent = searchTerm; // You can perform actions on each element here
            }
            for (let i = 0; i < upazilaName.length; i++) {
                upazilaName[i].textContent = ''

            }


            let filteredData = features.filter(feature => feature.get(province) === uniquefilteredDataDiv[0])

            let filteredDataDiv = generateChartData(filteredData);
            createChart(`graph_div_class`, `bar`, filteredDataDiv.class);
            createChart(`graph_div_class_1`, `bar`, filteredDataDiv.class_1);
            createChart(`graph_div_class_1_13`, `bar`, filteredDataDiv.class_1_13);
            createChart(`graph_div_class_1_14`, `bar`, filteredDataDiv.class_1_14);
            createChart(`graph_div_class_1_15`, `bar`, filteredDataDiv.class_1_15);
            createChart(`graph_div_class_12`, `bar`, filteredDataDiv.class_12);

            let filteredDataDist = generateChartData(filteredFeaturesDist)

            createChart(`graph_dist_class`, `bar`, filteredDataDist.class);
            createChart(`graph_dist_class_1`, `bar`, filteredDataDist.class_1);
            createChart(`graph_dist_class_1_13`, `bar`, filteredDataDist.class_1_13);
            createChart(`graph_dist_class_1_14`, `bar`, filteredDataDist.class_1_14);
            createChart(`graph_dist_class_1_15`, `bar`, filteredDataDist.class_1_15);
            createChart(`graph_dist_class_12`, `bar`, filteredDataDist.class_12);

            // Statistical tables
            // Append the generated table to the summaryStatsElement
            table.appendChild(generateTableDataHeader(filteredFeaturesDist, table, featureKeys[0]));
            const generatedTableRow = generateTableDataRow(filteredData, uniquefilteredDataDiv[0], table, featureKeys[0]);
            table.appendChild(generatedTableRow);
            //table.appendChild(generateTableDataRow(filteredFeaturesUpe, uniquefilteredDataDiv[2],table));
            summaryStatsElement.appendChild(table);

        }


        if (filteredFeaturesUpe.length > 0) {
            clearTable();
            generateTable(createUniqueAttributes(filteredFeaturesUpe, 'name_en'))



            // Assuming you have already defined filteredFeaturesDist
            const uniqueValuesSetDiv = new Set();

            // Iterate through filteredFeaturesDist to get unique province values
            filteredFeaturesUpe.forEach(feature => {
                //console.log(feature.get(province));
                const attributeValue1 = feature.get(province);
                const attributeValue2 = feature.get(commune);
                const attributeValue3 = feature.get(upezilla);

                // Check if the attributeValue1 is defined (not undefined)
                if (attributeValue1 !== undefined & attributeValue2 !== undefined) {
                    uniqueValuesSetDiv.add(attributeValue1);
                    uniqueValuesSetDiv.add(attributeValue2);
                    uniqueValuesSetDiv.add(attributeValue3);
                }
            });

            // Convert the Set to an array
            let uniquefilteredDataDiv = Array.from(uniqueValuesSetDiv);

            // Now, uniquefilteredDataDiv contains an array of unique province values
            //console.log(uniquefilteredDataDiv);
            for (let i = 0; i < divName.length; i++) {
                divName[i].textContent = ''
                divName[i].textContent = uniquefilteredDataDiv[0]; // You can perform actions on each element here
            }

            for (let i = 0; i < distName.length; i++) {
                distName[i].textContent = ''
                distName[i].textContent = uniquefilteredDataDiv[1]; // You can perform actions on each element here
            }
            let filteredDataDivUn = features.filter(feature => feature.get(province) === uniquefilteredDataDiv[0])

            let filteredDataDiv = generateChartData(filteredDataDivUn);
            createChart(`graph_div_class`, `bar`, filteredDataDiv.class);
            createChart(`graph_div_class_1`, `bar`, filteredDataDiv.class_1);
            createChart(`graph_div_class_1_13`, `bar`, filteredDataDiv.class_1_13);
            createChart(`graph_div_class_1_14`, `bar`, filteredDataDiv.class_1_14);
            createChart(`graph_div_class_1_15`, `bar`, filteredDataDiv.class_1_15);
            createChart(`graph_div_class_12`, `bar`, filteredDataDiv.class_12);

            let filteredDataComUn = features.filter(feature => feature.get(commune) === uniquefilteredDataDiv[1])


            let filteredDataDist = generateChartData(filteredDataComUn)

            createChart(`graph_dist_class`, `bar`, filteredDataDist.class);
            createChart(`graph_dist_class_1`, `bar`, filteredDataDist.class_1);
            createChart(`graph_dist_class_1_13`, `bar`, filteredDataDist.class_1_13);
            createChart(`graph_dist_class_1_14`, `bar`, filteredDataDist.class_1_14);
            createChart(`graph_dist_class_1_15`, `bar`, filteredDataDist.class_1_15);
            createChart(`graph_dist_class_12`, `bar`, filteredDataDist.class_12);


            for (let i = 0; i < upazilaName.length; i++) {
                upazilaName[i].textContent = ''
                upazilaName[i].textContent = uniquefilteredDataDiv[2]; // You can perform actions on each element here
            }
            let filteredDataUpe = generateChartData(filteredFeaturesUpe)
            createChart(`graph_upazila_class`, `bar`, filteredDataUpe.class);
            createChart(`graph_upazila_class_1`, `bar`, filteredDataUpe.class_1);
            createChart(`graph_upazila_class_1_13`, `bar`, filteredDataUpe.class_1_13);
            createChart(`graph_upazila_class_1_14`, `bar`, filteredDataUpe.class_1_14);
            createChart(`graph_upazila_class_1_15`, `bar`, filteredDataUpe.class_1_15);
            createChart(`graph_upazila_class_12`, `bar`, filteredDataUpe.class_12);



            // Statistical tables
            // Append the generated table to the summaryStatsElement
            table.appendChild(generateTableDataHeader(filteredFeaturesUpe, table, featureKeys[0]));
            const generatedTableRow = generateTableDataRow(filteredDataDivUn, uniquefilteredDataDiv[0], table, featureKeys[0]);
            table.appendChild(generatedTableRow);
            table.appendChild(generateTableDataRow(filteredDataComUn, uniquefilteredDataDiv[1], table, featureKeys[0]));
            table.appendChild(generateTableDataRow(filteredFeaturesUpe, uniquefilteredDataDiv[2], table, featureKeys[0]));
            summaryStatsElement.appendChild(table);


        }



        layer.changed();
    } else {
        console.error('No feature filtered')
    }

}


function highlightPolygon(feature) {
    // Customize the highlight style based on your requirements
    var highlightStyle = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 0, 0.4)', // Highlighted fill color (yellow with 40% opacity)
        }),
        stroke: new Stroke({
            color: 'red', // Highlighted stroke color (red)
            width: 2, // Highlighted stroke width
        }),
    });

    // Apply the highlight style to the selected feature
    feature.setStyle(highlightStyle);

    // Reset the style after the specified duration
    /*setTimeout(function() {
        feature.setStyle(null); // Reset to the default style
    }, 2000);*/
}


map.on('click', function(event) {
    var clickedFeature = null;
    const powerLayerfeatures = map.getAllLayers()[2].getSource().getFeatures();
    clearTable()
    
    resetLayerHighlights(map)
    
    const features=[]
    map.forEachFeatureAtPixel(event.pixel, function(feature) {
         features.push(feature)
        if (feature.getGeometry().getType() === 'Polygon') {
            clickedFeature = feature;
            //generateTable(createUniqueAttributes(features, 'name_en'))
            highlightPolygon(feature);
        }
    });

    if (clickedFeature) {
        // Zoom to the clicked feature
        var extent = clickedFeature.getGeometry().getExtent();
        map.getView().fit(extent, map.getSize(), { duration: 1000 });
    }
});
