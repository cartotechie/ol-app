import LayerGroup from 'ol/layer/Group';
import {
    substationStyle,
    powerLineStyle,
    adminBoundaryStyle,
    getPolygonStyle
} from './modules/sytle'
import {getOptionDOMValues
} from './modules/domElements';
import {
    getProvinceName,
    getDistrictName
} from './modules/search_select';
import VectorLayer from 'ol/layer/Vector';
import {
    OSM,
    Vector as VectorSource
} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {
    initMap,
    createVectorLayer
} from './init'
import {
    province,
    commune,
    districts,
    upezilla
} from './modules/variables'
import {
    generateTable,clearTable
} from './modules/table'
import {
    divisions
} from './modules/variables'
import {
    generateCharts
} from './modules/charts'
import GeometryCollection from 'ol/geom/GeometryCollection';
import * as olExtent from 'ol/extent';
import {generateChartData,createChartData,createChart,clearCharts} from './modules/charts'
import {countFeatures} from './modules/processing'
const geoserverEndpoint = 'http://localhost/geoserver/geonode/ows';


let selectedProvince;
let selectedMunicipality;
let selectedDistricts = [];
let selectedUpezillas = [];
let featureTable
const geoserverUrl = [
    './data/Admin_Boundaries_OSM_refined.geojson',
    './data/bangladesh_powertowers_withdem_flood_lulc_cfocus_wind_eq_ls_up.geojson',
    './data/Bangladesh_powertlines_withVoltage_ByExposure_upazilla.json'
]


function updateCountDisplay(element, count, label) {
    element.textContent = `${count} ${label}`;
}

const map = initMap();


const getLayers = async () => {
    try {
        const mapLayers = [];

        // Fetch GeoJSON data
        const response = await fetch(geoserverUrl[0]);
        const response1 = await fetch(geoserverUrl[1]);
        const response2 = await fetch(geoserverUrl[2]);

        if (response.ok) {
            const responseJSON = await response.json();
            const layer = new VectorLayer({
                style: function(feature) {
                    //return getPolygonStyle(feature)
                    return adminBoundaryStyle
                },
                source: new VectorSource({
                    features: new GeoJSON().readFeatures(responseJSON),

                }),

                title: 'title'
            });
            mapLayers.push(layer);;

        }

        if (response1.ok) {
            const responseJSON = await response1.json();

            const layer = createVectorLayer(responseJSON, 'Layer2', substationStyle);
            mapLayers.push(layer);

        }

        if (response2.ok) {
            const responseJSON = await response2.json();

            const layer = createVectorLayer(responseJSON, 'Layer3', powerLineStyle);
            mapLayers.push(layer);

        }

        if (mapLayers.length > 0) {
            


            // Add layers to LayerGroup and then to the map
            map.addLayer(new LayerGroup({
                title: 'MapLayers',
                layers: mapLayers
            }));

            const adminlayer = mapLayers[0]
            const layer = mapLayers[1]



            /******************************************* */
            const features = layer.getSource().getFeatures();
            

         
            // info box

            map.on('click', function(event) {
                var coordinate = event.coordinate;
                //console.log('Clicked coordinate:', coordinate);
                // Open the info box and display information
                var infoBox = document.getElementById('info-box');
                infoBox.innerHTML = 'Latitude: ' + coordinate[1] + '<br>Longitude: ' + coordinate[0];
                infoBox.style.left = event.pixel[0] + 'px';
                infoBox.style.top = event.pixel[1] + 'px';
                infoBox.style.display = 'block';


            });

            const countDisplayDistricts = document.getElementById('countDisplayDistricts');
            const countDisplayUpezillas = document.getElementById('countDisplayUpezillas');
            const adminName = document.getElementById('adminName');
            const countDisplayedFeatures = document.getElementById('countDisplayedFeatures');
            const countDisplayDivisions = document.getElementById('countDisplayDivisions');

            const uniqueUpezillasCount = countFeatures(features, 'name_en', selectedUpezillas);

updateCountDisplay(adminName,'','Bangladesh( data according to data)')
updateCountDisplay(countDisplayDistricts,districts.length,'Districts')
updateCountDisplay(countDisplayUpezillas,uniqueUpezillasCount,'Upezillas')
updateCountDisplay(countDisplayedFeatures,features.length,'Powerlines')
updateCountDisplay(countDisplayDivisions,divisions.length,'Divisions')


console.log(features)

            generateTable(features)
            // Clear existing charts
clearCharts();

// Generate and create new charts
            const filteredData = generateChartData(features);

// Create charts
createChart('graph4', 'bar', filteredData.class);
createChart('graph1', 'bar', filteredData.class_1);
createChart('graph2', 'bar', filteredData.class_1_13);
createChart('graph3', 'bar', filteredData.class_1_14);
createChart('graph5', 'bar', filteredData.class_1_15);
createChart('graph6', 'bar', filteredData.class_12);



        } else {
            throw new Error('No valid GeoJSON data available');
        }

    } catch (error) {
        console.error('There was a problem fetching the data:', error);
    }
};



getLayers();

/************************************************************************ */


  getOptionDOMValues(divisions, districts);
  
/****************************************************************************************** */

const countDisplayDistricts = document.getElementById('countDisplayDistricts');
const countDisplayUpezillas = document.getElementById('countDisplayUpezillas');
const adminName = document.getElementById('adminName');
const countDisplayedFeatures = document.getElementById('countDisplayedFeatures');



/******************************************************************************************* */

function onchange(event) {
    const layer = map.getAllLayers()[2]
    const features = layer.getSource().getFeatures();

    event.preventDefault();
    const selectedProvince = event.target.value;
    adminName.innerHTML=`${selectedProvince}`
 
    const filteredFeatures = features.filter(feature => feature.get(province) === selectedProvince);
    const extent = olExtent.boundingExtent(filteredFeatures.map(feature => feature.getGeometry().getExtent()));

    map.getView().fit(extent, { padding: [10, 10, 10, 10], duration: 1000 });

    console.log(filteredFeatures)
    countDisplayedFeatures.innerHTML=`${filteredFeatures.length} Powerlines`
    const uniqueCommunesCount = countFeatures(filteredFeatures, commune, selectedDistricts);
    updateCountDisplay(countDisplayDistricts, uniqueCommunesCount, 'Districts');

    const uniqueUpezillasCount = countFeatures(filteredFeatures, 'name_en', selectedUpezillas);
    updateCountDisplay(countDisplayUpezillas, uniqueUpezillasCount, 'Upezillas');
    // Clear the existing table
    clearTable();
    generateTable(filteredFeatures)

    layer.changed();
}

document.getElementById("division").addEventListener('change', onchange);

/****************************************************************************************** */

function onchangeDistrict(event) {
     const layer = map.getAllLayers()[2]
     const features = layer.getSource().getFeatures();

    console.log(features)
    event.preventDefault();
    const selectedDistrict = event.target.value;
    adminName.innerHTML=`${selectedDistrict}`
 
    const filteredFeatures = features.filter(feature => feature.get(commune) === selectedDistrict);
    const extent = olExtent.boundingExtent(filteredFeatures.map(feature => feature.getGeometry().getExtent()));

map.getView().fit(extent, { padding: [10, 10, 10, 10], duration: 1000 });
    countDisplayedFeatures.innerHTML=`${filteredFeatures.length} Powerlines`
    //const uniqueCommunesCount = countFeatures(filteredFeatures, commune, selectedDistricts);
    updateCountDisplay(countDisplayDistricts, '', '');

    const uniqueUpezillasCount = countFeatures(filteredFeatures, 'name_en', selectedUpezillas);
    updateCountDisplay(countDisplayUpezillas, uniqueUpezillasCount, 'Upezillas');
    // Clear the existing table
    clearTable();
    generateTable(filteredFeatures)

    layer.changed();

}

document.getElementById('district').addEventListener('change', onchangeDistrict);

/************************************************************************************************* */


const displayInfo = (event) => {
    // Get the clicked row
    const clickedRow = event.target.closest('tr');
    let value 
    
    // Check if a row was clicked
    if (clickedRow) {
        // Get data from the clicked row
        const columns = clickedRow.querySelectorAll('td');
        const rowData = Array.from(columns).map(column => column.textContent);

        // Display the data in an alert
        //alert('Clicked Row Data:\n' + rowData.join('\n'));
        console.log(rowData[2])
        value = rowData[2]
    }

    const layer = map.getAllLayers()[2]
    const features = layer.getSource().getFeatures()
    const filterUpezillaFeatures =features.filter(feature=>feature.get(upezilla)===value)
    // Clear the existing table
  clearTable();
    generateTable(filterUpezillaFeatures)
    
   // Get the extent of the filtered features
const extent = olExtent.boundingExtent(filterUpezillaFeatures.map(feature => feature.getGeometry().getExtent()));

map.getView().fit(extent, { padding: [10, 10, 10, 10], duration: 1000 });
// Sample data

// Update the content of the elements
document.getElementById('upezilla-name').innerHTML = `<strong>${value}</strong>`;
document.getElementById('countUpezillaPowerlines').innerHTML = `${filterUpezillaFeatures.length} Powerlines `;
////////////////////*****************+ */
// Clear existing charts
clearCharts();

// Generate and create new charts
const filteredData = generateChartData(filterUpezillaFeatures);

// Create charts
createChart('graph4', 'bar', filteredData.class);
createChart('graph1', 'bar', filteredData.class_1);
createChart('graph2', 'bar', filteredData.class_1_13);
createChart('graph3', 'bar', filteredData.class_1_14);
createChart('graph5', 'bar', filteredData.class_1_15);
createChart('graph6', 'bar', filteredData.class_12);

  
}

// Add click event listener to the table
document.getElementById('table').addEventListener('click', displayInfo);

/********************************************* */







