

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
    clearTable, generateTableDataHeader, generateTable1, generateTableDataRow, generatetableDataObject
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
     readableClassNames
} from './modules/variables'

import {
    countFeatures,
    createUniqueAttributes,
    updateObjectKeyValue
} from './modules/processing'
import { textPointStyle, customSVGPointStyle, starPointStyle, crossPointStyle, squarePointStyle, defaultPointStyle } from './modules/pointStyle'
import { classesValues } from './modules/dataStore'

const geoJsonEndpoint = './data/powertowers.json';
//const geoJsonEndpoint ='/worldbank/geojsonapi/'
const map = initMap();
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
        //console.log('selected')
        return glowingStyle
    }


    return styleFunction(feature)
}
const selectedPolyStyle = (feature) => {

    if (feature.get(province) === selected || feature.get(commune) === selected || feature.get('name_en') === selected) {
        setTimeout(() => {
            feature.setStyle(defaultStyle);
        }, 5000); // 5000 milliseconds (5 seconds)
        //console.log('selected')
        return defaultStyle
    }


    return defaultStyle
}
function updateCountDisplay(element, count, label) {
    element.textContent = `${count} ${label}`;
}

/****************************************************************************************** */


const getLayers = async () => {
    try {
        const mapLayers = [];

        // Fetch GeoJSON data
        const response = await fetch(geoJsonEndpoint);
        document.getElementById("loadingIndicator").style.display = "none";



        if (response.ok) {


            const responseJSON = await response.json();
            //console.log(responseJSON)
            const layer = new VectorLayer({
                visible: true,
                //style: selectedPolyStyle,
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
                    layers: subLayers.reverse(), // Reverse the order
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

            updateCountDisplay(countDisplayUpezillas, uniqueUpezillasCount, 'Upezillas')
            updateCountDisplay(countDisplayedFeatures, features.length, 'Powerlines')



            //console.log(features)

            generateTable(createUniqueAttributes(features, 'name_en'))
            generateTable1()
            // Clear existing charts
            clearDivCharts();
            clearDistCharts()
            clearUpazilaCharts()
            /**************** 
            const adminLayerFeatures = map.getAllLayers()[1].getSource().getFeatures()
            const powerLayerFeatures = map.getAllLayers()[1].getSource().getFeatures();
            console.log(generatetableDataObject(powerLayerFeatures, featureKeys))
            featureKeys.forEach(featureKey => {
                
                powerLayerFeatures.filter(feature=>feature.get(province)==='Dhaka')
            console.log(selected)
               
            
                const readableFeatureName = readableClassNames[featureKey] || featureKey;
                const table = `<h3>${readableFeatureName}</h3>
                <table border="1">
                <thead>
                    <tr>
                        <th>Labels</th>
                        <th>Sum of Flood (Low)</th>
                        <th>Sum of Flood (Moderate)</th>
                        <th>Sum of Flood (High)</th>
                        <th>Sum of Flood (Very High)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="collapsible-header" data-section="dhakaDivision">
                        <td>Dhaka Division</td>
                        <td>1020</td>
                        <td>3432</td>
                        <td>1175</td>
                        <td>0</td>
                    </tr>
            
                    <tr class="collapsible-header" data-section="dhakaDistrict">
                        <td>Dhaka District</td>
                        <td>116</td>
                        <td>680</td>
                        <td>277</td>
                        <td>0</td>
                    </tr>
            
                    <tr class="collapsible-content" data-section="dhakaDistrict">
                        <td>Dhaka Metropolitan</td>
                        <td>36</td>
                        <td>235</td>
                        <td>71</td>
                        <td>0</td>
                    </tr>
            
                    <tr class="collapsible-content" data-section="dhakaDistrict">
                        <td>Dhamrai Upazila</td>
                        <td>17</td>
                        <td>67</td>
                        <td>50</td>
                        <td>0</td>
                    </tr>
            
                    <tr class="collapsible-content" data-section="dhakaDistrict">
                        <td>Dohar Upazila</td>
                        <td>0</td>
                        <td>5</td>
                        <td>3</td>
                        <td>0</td>
                    </tr>
                </tbody>
            </table>`
                const tableContainer = document.getElementById('summary-stats');
                const tableElement = document.createElement('div');
                tableElement.innerHTML = table;
                tableContainer.appendChild(tableElement);
            })*/

        } else {
            throw new Error('No valid GeoJSON data available');
        }

    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
};



//getLayers();



export{getLayers,map} 