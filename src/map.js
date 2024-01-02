import LayerGroup from 'ol/layer/Group';
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
    districts,
    upezilla,
    districtsByDivision, featureKeys
} from './modules/variables'

import {
    generateTable,
    clearTable,generateCollapsibleTable
} from './modules/table'
import {
    divisions
} from './modules/variables'
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
    createUniqueAttributes
} from './modules/processing'
import { textPointStyle, customSVGPointStyle, starPointStyle, crossPointStyle, squarePointStyle, defaultPointStyle } from './modules/pointStyle'
import { classesValues } from './modules/dataStore'


document.addEventListener("DOMContentLoaded", function() {
    // Display loading indicator
    document.getElementById("loadingIndicator").style.display = "block";


const geoJsonEndpoint = './data/powertowers.json';


let searchTerm
let selected //= 'Sylhet Division';
let selectedDistrict //= 'Sylhet District';
let valueUpazila
let selectedDistricts = [];
let selectedUpezillas = [];


const selectedPointStyle = (feature) => {

    if (feature.get(province) === selected || feature.get(commune) === selected || feature.get('name_en') === selected) {
        setTimeout(() => {
            feature.setStyle(styleFunction(feature));
        }, 2000); // 5000 milliseconds (5 seconds)
        console.log('selected')
        return glowingStyle
    }


    return styleFunction(feature)
}
const selectedPolyStyle = (feature) => {

    if (feature.get(province) === selected || feature.get(commune) === selected || feature.get('name_en') === selected) {
        setTimeout(() => {
            feature.setStyle(defaultStyle);
        }, 5000); // 5000 milliseconds (5 seconds)
        console.log('selected')
        return defaultStyle
    }


    return adminBoundaryStyle
}

/****************************************************************************************** */

const divName = document.getElementsByClassName('div-name')
const distName = document.getElementsByClassName('dist-name')
const upazilaName = document.getElementsByClassName('upazila-name')


for (let i = 0; i < divName.length; i++) {
    divName[i].textContent;
}


//createDropdownTable(5, 5);
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



const map = initMap();


const getLayers = async () => {
    try {
        const mapLayers = [];

        // Fetch GeoJSON data
        const response = await fetch(geoJsonEndpoint);
        document.getElementById("loadingIndicator").style.display = "none";
       


        if (response.ok) {
            

            const responseJSON = await response.json();
            console.log(responseJSON)
            const layer = new VectorLayer({
                visible: true,
                style: selectedPolyStyle,
                source: new VectorSource({
                    features: new GeoJSON().readFeatures(responseJSON[1]),

                }),

                title: 'Upazila boundary'
            });


            mapLayers.push(layer);
            mapLayers.push(createVectorLayer(responseJSON[0], 'Powerlines', ''));

        }



        const vectorSource = mapLayers[1].getSource();

        const subLayersData = [
            { style: selectedPointStyle, title: 'Flood Exposure', visible: true },
            { style: substationStyle, title: 'LULC', visible: false },
            { style: defaultPointStyle, title: 'WindSpeed 100m', visible: false },
            { style: crossPointStyle, title: 'Earthquake', visible: false },
            { style: defaultPointStyle, title: 'Landslide susceptibility', visible: false },
            { style: defaultPointStyle, title: 'Maintenance', visible: false }
        ];

        const subLayers = subLayersData.map(layerData =>
            createSubVectorLayer(vectorSource, layerData.style, layerData.title, layerData.visible)
        );

        const layerGroup = new LayerGroup({
            layers: [
                new LayerGroup({
                    layers: subLayers.reverse(), // Reverse the order if needed
                    title: 'Classes'
                })
            ],
            title: 'Powerlines'
        });




        /*************************************/

        if (mapLayers.length > 0) {



            // Add layers to LayerGroup and then to the map
            map.addLayer(new LayerGroup({
                title: 'MapLayers',
                layers: [mapLayers[0], layerGroup]
            }));

            const adminlayer = mapLayers[0]
            const layer = mapLayers[1]



            /******************************************* */
            const features = layer.getSource().getFeatures();


            classesValues(features)


            /***************************************** */

            const uniqueUpezillasCount = countFeatures(features, 'name_en', selectedUpezillas);
            updateCountDisplay(adminName, '', 'Bangladesh (data according to data)')
            updateCountDisplay(countDisplayDistricts, districts.length, 'Districts')
            updateCountDisplay(countDisplayUpezillas, uniqueUpezillasCount, 'Upezillas')
            updateCountDisplay(countDisplayedFeatures, features.length, 'Powerlines')
            updateCountDisplay(countDisplayDivisions, divisions.length, 'Divisions')


            //console.log(features)

            generateTable(createUniqueAttributes(features, 'name_en'))
            // Clear existing charts
            clearDivCharts();
            clearDistCharts()
            clearUpazilaCharts()




        } else {
            throw new Error('No valid GeoJSON data available');
        }

    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
};



getLayers();






/************************************************************************ */

/*const getSearchTerm=(event)=>{
    event.preventDefault
    const searchInputTerm = document.getElementById('search-input')
    console.log(searchInputTerm)} */

    /*document.getElementById('searchInput').addEventListener('input', function() {
        var clearIcon = document.querySelector('.clear-icon');
        clearIcon.style.display = this.value.length ? 'block' : 'none';
      });*/
  
      
   document.getElementById('clear-icon').addEventListener('click', function() {
        var searchInput = document.getElementById('searchInput');
        searchInput.value = '';
        document.querySelector('.clear-icon').style.display = 'none';
        clearTable()
        const layer = map.getAllLayers()[2]
        const features = layer.getSource().getFeatures();
        generateTable(createUniqueAttributes(features, 'name_en'))
      });

function getSearchTerm(event) {
    event.preventDefault
    var clearIcon = document.querySelector('.clear-icon');
    clearIcon.style.display = this.value.length ? 'block' : 'none';
    //document.querySelector('.clear-icon').style.display = 'none';

    const searchInputTerm = document.getElementById('searchInput')

    selected = searchInputTerm.value.trim()
    onclickDivision(searchInputTerm.value.trim())



}
//const searchFormElement = document.getElementById('geocode-form')
document.getElementById('searchInput').addEventListener('input', getSearchTerm)



function onclickDivision(term) {


    const layer = map.getAllLayers()[2]
    const features = layer.getSource().getFeatures();

    searchTerm = term;

   // adminName.innerHTML = `${searchTerm}`

    const divName = document.getElementsByClassName('div-name')
    const distName = document.getElementsByClassName('dist-name')
    const upazilaName = document.getElementsByClassName('upazila-name')

    //const filteredFeatures = features.filter(feature => feature.get(province)=== searchTerm||feature.get(commune)=== searchTerm||feature.get(upezilla) === searchTerm);
    const filteredFeatures = features.filter(feature => feature.get(province) === searchTerm || feature.get(commune) === searchTerm || feature.get(upezilla) === searchTerm);



    if (filteredFeatures.length > 0) {
        const extent = olExtent.boundingExtent(filteredFeatures.map(feature => feature.getGeometry().getExtent()));
        console.log(filteredFeatures)
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
                console.log(feature.get(province));
                const attributeValue = feature.get(province);

                // Check if the attributeValue is defined (not undefined)
                if (attributeValue !== undefined) {
                    uniqueValuesSetDiv.add(attributeValue);
                }
            });

            // Convert the Set to an array
            let uniquefilteredDataDiv = Array.from(uniqueValuesSetDiv);

            // Now, uniquefilteredDataDiv contains an array of unique province values
            console.log(uniquefilteredDataDiv);

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

        }


        if (filteredFeaturesUpe.length > 0) {
            clearTable();
            generateTable(createUniqueAttributes(filteredFeaturesUpe, 'name_en'))

            // Assuming you have already defined filteredFeaturesDist
            const uniqueValuesSetDiv = new Set();

            // Iterate through filteredFeaturesDist to get unique province values
            filteredFeaturesUpe.forEach(feature => {
                console.log(feature.get(province));
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
            console.log(uniquefilteredDataDiv);
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

        }



        layer.changed();
    } else {
        console.log('No feature filtered')
    }







    /**countDisplayedFeatures.innerHTML = `${filteredFeatures.length} Powerlines`
    const uniqueCommunesCount = countFeatures(filteredFeatures, commune, selectedDistricts);
    updateCountDisplay(countDisplayDistricts, uniqueCommunesCount, 'Districts');
    updateCountDisplay(countDisplayDivisions, '', '')

    const uniqueUpezillasCount = countFeatures(filteredFeatures, 'name_en', selectedUpezillas);
    updateCountDisplay(countDisplayUpezillas, uniqueUpezillasCount, 'Upezillas');
    // Clear the existing table
    clearTable();
    generateTable(createUniqueAttributes(filteredFeatures, 'name_en'))

    /*****************************************************************************/




}


 // Call the function to generate the table
 generateCollapsibleTable();

})