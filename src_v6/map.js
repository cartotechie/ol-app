import LayerGroup from 'ol/layer/Group';
import {
    glowingStyle,
    substationStyle,
    adminBoundaryStyle,
    styleFunction,
    multiVarPointStyleFunction
} from './modules/sytle'
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
    createVectorLayer
} from './init'
import {
    province,
    commune,
    districts,
    upezilla,
    districtsByDivision
} from './modules/variables'
import {
    Fill,
    Stroke,
    Style,
    Text,
    Circle,
    RegularShape
} from "ol/style";
import {
    generateTable,
    clearTable
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
import {textPointStyle,customSVGPointStyle,starPointStyle,crossPointStyle,squarePointStyle,defaultPointStyle}from './modules/pointStyle'
const geoserverEndpoint = 'http://localhost/geoserver/geonode/ows';

function getPolygonStyle(feature) {
    // Extract attributes from the feature properties
    console.log(feature)
    // Default style
    var defaultStyle = new Style({
        fill: new Fill({
            color: 'rgba(204, 204, 204, 0.8)', // Default fill color
        }),
        stroke: new Stroke({
            color: 'grey', // Default border color
            width: 0, // Default border width
        }),
    });

    // Get the current zoom level
    var zoom = map.getView().getZoom();

    // Style based on admin_level_1 at zoom level 8 or above
    if (feature.get('div_name') === divisions[0]) {

        return new Style({
            fill: new Fill({
                color: 'red', // Red
            }),
            stroke: new Stroke({
                color: 'grey',
                width: 0,
            }),
        });
    }

    // Style based on admin_level_2 at zoom level 10 or above
    else if (feature.get('div_name') === divisions[1]) {

        return new Style({
            fill: new Fill({
                color: 'green', // Green
            }),
            stroke: new Stroke({
                color: 'grey',
                width: 0,
            }),
        });
    }

    // Style based on admin_level_3 at zoom level 12 or above
    else if (feature.get('div_name') === divisions[2]) {
        return new Style({
            fill: new Fill({
                color: 'blue', // Blue
            }),
            stroke: new Stroke({
                color: 'grey',
                width: 0,
            }),
        });
    }

    // Return default style if no condition is met
    return defaultStyle;
}

let selectedProvince = 'Sylhet Division';
let selectedDistrict = 'Sylhet District';
let selectedDistricts = [];
let selectedUpezillas = [];
let featureTable
const geoserverUrl = [
    './data/Admin_Boundaries_OSM_refined.geojson',
    './data/bangladesh_powertowers_withdem_flood_lulc_cfocus_wind_eq_ls_up.geojson',
    './data/Bangladesh_powertlines_withVoltage_ByExposure_upazilla.json'
]

/*const geoserverUrl =[
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Aadmin_boundaries_osm_refined&outputFormat=application/json&srsname=EPSG:4326',
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Abangladesh_powertowers_withdem_flood_lulc_cfocus_wind_eq_ls_up&outputFormat=application/json&srsname=EPSG:4326',
  
]*/


function updateCountDisplay(element, count, label) {
    element.textContent = `${count} ${label}`;
}

const featureKeys = ['class', 'class_1', 'class_1_13', 'class_1_14', 'class_1_15', 'class_12'];

const map = initMap();


const getLayers = async () => {
    try {
        const mapLayers = [];

        // Fetch GeoJSON data
        const response = await fetch(geoserverUrl[0]);
        const response1 = await fetch(geoserverUrl[1]);


        if (response.ok) {
            const responseJSON = await response.json();
            const layer = new VectorLayer({
                visible: false,
                style: function(feature) {
                    //return getPolygonStyle(feature)
                    return adminBoundaryStyle
                },
                source: new VectorSource({
                    features: new GeoJSON().readFeatures(responseJSON),

                }),

                title: 'Upazila boundary'
            });
            mapLayers.push(layer);;

        }

        if (response1.ok) {
            const responseJSON = await response1.json();

            // const layer = createVectorLayer(responseJSON, 'Layer2', substationStyle);
            const vectorSource = new VectorSource({features: new GeoJSON().readFeatures(responseJSON),})
            const layer = new VectorLayer({
                
                source: vectorSource,

                title: 'Powerlines'
                //title: 'Flood Exposure'
            });



            mapLayers.push(layer);

            
            
            

        }
        console.log(mapLayers[1].getSource())

        /****************************** */
        // Create sub-layers within the main vector layer
        const vectorSource = mapLayers[1].getSource()
        const subLayer1 = new VectorLayer({
            style: function(feature) {
              console.log(feature)
              
              //return getPolygonStyle(feature)
              return styleFunction(feature) //multiVarPointStyleFunction(feature)
          },
            source: vectorSource,
            // styling or other options for subLayer1...
            title: 'Flood Exposure',
            visible:false
          });
          
          const subLayer2 = new VectorLayer({
            source: vectorSource,
            style:defaultPointStyle,
            title: 'LULC',
            visible:false
          });
          const subLayer3 = new VectorLayer({
              source: vectorSource,
              style:defaultPointStyle,
              title: 'WindSpeed 100m',
              visible:false
            });
            const subLayer4 = new VectorLayer({
              source: vectorSource,
              style:defaultPointStyle,
              title: 'Earthquake',
              visible:false
            });
            const subLayer5 = new VectorLayer({
              source: vectorSource,
              style:defaultPointStyle,
              title: 'Landslide susceptibility',
              visible:false
            });

            const subLayer6 = new VectorLayer({
              source: vectorSource,
              style:defaultPointStyle,
              title: 'Maintenance',
              visible:false
            });

         

          const layerGroup = new LayerGroup({
            layers: [new LayerGroup({
              layers:[subLayer1, subLayer2,subLayer3,subLayer4,subLayer5,subLayer6],
              title:'Classes'

            })],
            title:'Powerlines'
          });
          //console.log(layerGroup.get('title'))

          //map.addLayer(layerGroup)


        /****************************+ */

        if (mapLayers.length > 0) {



            // Add layers to LayerGroup and then to the map
            map.addLayer(new LayerGroup({
                title: 'MapLayers',
                layers: [mapLayers[0],layerGroup]
            }));

            const adminlayer = mapLayers[0]
            const layer = mapLayers[1]



            /******************************************* */
            const features = layer.getSource().getFeatures();




            // info box

            map.on('click', function(event) {
                var coordinate = event.coordinate;

                // Get features at the clicked pixel
                var features = map.getFeaturesAtPixel(event.pixel);

                if (features.length > 0) {
                    // Open the info box and display information for the first feature
                    var firstFeature = features[0];
                    var properties = firstFeature.getProperties();

                    // Keep only specific properties
                    properties = {
                        'class': properties['class'],
                        'class_1_13': properties['class_1_13'],
                        'class_1_14': properties['class_1_14'],
                        'class_1_15': properties['class_1_15'],
                        'class_12': properties['class_12'],
                        'div_name': properties['div_name'],
                        'dist_name': properties['dist_name'],
                        'name_en': properties['name_en'],
                    };

                    // Log the properties to the console
                    //console.log(properties);

                    // Customize this part based on your feature properties
                    var infoContent = '<strong>Feature Info:</strong><br>';
                    for (var key in properties) {
                        if (properties.hasOwnProperty(key)) {
                            infoContent += key + ': ' + properties[key] + '<br>';
                        }
                    }

                    // Open the info box and display information
                    var infoBox = document.getElementById('info-box');
                    infoBox.innerHTML = infoContent;

                    // Position the info box just below the selected point
                    infoBox.style.left = event.pixel[0] + 'px';
                    infoBox.style.top = event.pixel[1] + 10 + 'px'; // Add some margin below the point
                    infoBox.style.display = 'block';

                    // Highlight the selected point
                    highlightPoint(firstFeature, 2000);
                } else {
                    // If no feature is clicked, close the info box
                    var infoBox = document.getElementById('info-box');
                    infoBox.style.display = 'none';
                }
            });

            function highlightPoint(feature) {
                // You can customize the highlight style based on your requirements
                var highlightStyle = new Style({
                    image: new Circle({
                        radius: 12,
                        fill: new Fill({
                            color: 'yellow',
                        }),
                        stroke: new Stroke({
                            color: 'red',
                            width: 2,
                        }),
                    }),
                });

                // Apply the highlight style to the selected feature
                feature.setStyle(highlightStyle);


                // Reset the style after the specified duration
                setTimeout(function() {
                    feature.setStyle(null); // Reset to the default style
                }, 2000);
            }


            /***************************************** */

            const countDisplayDistricts = document.getElementById('countDisplayDistricts');
            const countDisplayUpezillas = document.getElementById('countDisplayUpezillas');
            const adminName = document.getElementById('adminName');
            const countDisplayedFeatures = document.getElementById('countDisplayedFeatures');
            const countDisplayDivisions = document.getElementById('countDisplayDivisions');

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

const divName = document.getElementsByClassName('div-name')
const distName = document.getElementsByClassName('dist-name')
const upazilaName = document.getElementsByClassName('upazila-name')
//console.log(divName)
//console.log(distName)

for (let i = 0; i < divName.length; i++) {
    divName[i].textContent;
}

getOptionDOMValues(divisions, districts);

/****************************************************************************************** */

const countDisplayDistricts = document.getElementById('countDisplayDistricts');
const countDisplayUpezillas = document.getElementById('countDisplayUpezillas');
const adminName = document.getElementById('adminName');
const countDisplayedFeatures = document.getElementById('countDisplayedFeatures');
const countDisplayDivisions = document.getElementById('countDisplayDivisions');

/******************************************************************************************* */

function onchangeDivision(event) {
    const layer = map.getAllLayers()[2]
    const features = layer.getSource().getFeatures();

    event.preventDefault();
    selectedProvince = event.target.value;
    adminName.innerHTML = `${selectedProvince}`



    const filteredFeatures = features.filter(feature => feature.get(province) === selectedProvince);
    const extent = olExtent.boundingExtent(filteredFeatures.map(feature => feature.getGeometry().getExtent()));

    map.getView().fit(extent, {
        padding: [10, 10, 10, 10],
        duration: 1000
    });
    /* Apply the glowing style to the selected features
filteredFeatures.forEach(feature => {
    feature.setStyle(glowingStyle);
});

// Optionally, remove the glowing effect after a certain time
setTimeout(() => {
    filteredFeatures.forEach(feature => {
        feature.setStyle(null); // Remove the style to revert to the default
    });
}, 10000); // Adjust the time (in milliseconds) as needed*/

    console.log(filteredFeatures)
    countDisplayedFeatures.innerHTML = `${filteredFeatures.length} Powerlines`
    const uniqueCommunesCount = countFeatures(filteredFeatures, commune, selectedDistricts);
    updateCountDisplay(countDisplayDistricts, uniqueCommunesCount, 'Districts');
    updateCountDisplay(countDisplayDivisions, '', '')

    const uniqueUpezillasCount = countFeatures(filteredFeatures, 'name_en', selectedUpezillas);
    updateCountDisplay(countDisplayUpezillas, uniqueUpezillasCount, 'Upezillas');
    // Clear the existing table
    clearTable();
    generateTable(createUniqueAttributes(filteredFeatures, 'name_en'))

    /*****************************************************************************/


    featureKeys.forEach(className => console.log(className))
    // Iterate over the array using forEach

    const filteredData = generateChartData(filteredFeatures);

    // Create charts
    clearDivCharts()
    clearDistCharts()
    clearUpazilaCharts()

    for (let i = 0; i < divName.length; i++) {

        divName[i].textContent = selectedProvince
    }



    createChart(`graph_div_class`, `bar`, filteredData.class);
    createChart(`graph_div_class_1`, `bar`, filteredData.class_1);
    createChart(`graph_div_class_1_13`, `bar`, filteredData.class_1_13);
    createChart(`graph_div_class_1_14`, `bar`, filteredData.class_1_14);
    createChart(`graph_div_class_1_15`, `bar`, filteredData.class_1_15);
    createChart(`graph_div_class_12`, `bar`, filteredData.class_12);

    layer.changed();
}

document.getElementById("division").addEventListener('change', onchangeDivision);

/****************************************************************************************** */

function onchangeDistrict(event) {
    const layer = map.getAllLayers()[2]
    const features = layer.getSource().getFeatures();

    //console.log(features)
    event.preventDefault();
    selectedDistrict = event.target.value;
    adminName.innerHTML = `${selectedDistrict}`

    const filteredFeatures = features.filter(feature => feature.get(commune) === selectedDistrict);
    const extent = olExtent.boundingExtent(filteredFeatures.map(feature => feature.getGeometry().getExtent()));

    map.getView().fit(extent, {
        padding: [10, 10, 10, 10],
        duration: 1000
    });
    countDisplayedFeatures.innerHTML = `${filteredFeatures.length} Powerlines`
    //const uniqueCommunesCount = countFeatures(filteredFeatures, commune, selectedDistricts);
    updateCountDisplay(countDisplayDistricts, '', '');
    updateCountDisplay(countDisplayDivisions, '', '')

    const uniqueUpezillasCount = countFeatures(filteredFeatures, 'name_en', selectedUpezillas);
    updateCountDisplay(countDisplayUpezillas, uniqueUpezillasCount, 'Upezillas');
    // Clear the existing table
    clearTable();
    generateTable(createUniqueAttributes(filteredFeatures, 'name_en'))
    console.log(filteredFeatures)
    const filteredData = generateChartData(filteredFeatures)

    clearDistCharts()
    clearUpazilaCharts()

    for (let i = 0; i < distName.length; i++) {
        distName[i].textContent = ''
        distName[i].textContent = selectedDistrict; // You can perform actions on each element here
    }


    createChart(`graph_dist_class`, `bar`, filteredData.class);
    createChart(`graph_dist_class_1`, `bar`, filteredData.class_1);
    createChart(`graph_dist_class_1_13`, `bar`, filteredData.class_1_13);
    createChart(`graph_dist_class_1_14`, `bar`, filteredData.class_1_14);
    createChart(`graph_dist_class_1_15`, `bar`, filteredData.class_1_15);
    createChart(`graph_dist_class_12`, `bar`, filteredData.class_12);

    layer.changed();

}

document.getElementById('district').addEventListener('change', onchangeDistrict);

/************************************************************************************************* */


const displayUpazilaInfo = (event) => {
    // Get the clicked row
    const clickedRow = event.target.closest('tr');
    let valueUpazila
    let valueDivision
    let valueDistrict

    // Check if a row was clicked
    if (clickedRow) {
        // Get data from the clicked row
        const columns = clickedRow.querySelectorAll('td');
        const rowData = Array.from(columns).map(column => column.textContent);

        // Display the data in an alert
        //alert('Clicked Row Data:\n' + rowData.join('\n'));
        console.log(rowData[2])
        valueDivision = rowData[0]
        valueDistrict = rowData[1]
        valueUpazila = rowData[2]

    }

    const layer = map.getAllLayers()[2]
    const features = layer.getSource().getFeatures()
    /********** generate table */

    generateTable(createUniqueAttributes(features, 'name_en'))

    /****************************+ */

    const filterUpezillaFeatures = features.filter(feature => feature.get(upezilla) === valueUpazila)
    const filterDistFeatures = features.filter(feature => feature.get(commune) === valueUpazila)
    console.log(filterDistFeatures)
    // Clear the existing table
    clearUpazilaCharts()


    // Get the extent of the filtered features
    const extent = olExtent.boundingExtent(filterUpezillaFeatures.map(feature => feature.getGeometry().getExtent()));

    map.getView().fit(extent, {
        padding: [30, 30, 30, 30],
        duration: 1000
    });
    // Sample data

    // Update the content of the elements
    document.getElementById('upezilla-name').innerHTML = `<strong>${valueUpazila}</strong>`;
    document.getElementById('countUpezillaPowerlines').innerHTML = `${filterUpezillaFeatures.length} Powerlines `;

    // Clear existing charts

    for (let i = 0; i < upazilaName.length; i++) {
        upazilaName[i].textContent = ''
        upazilaName[i].textContent = valueUpazila
    }




    // Generate and create new charts
    const filteredDataUpazila = generateChartData(filterUpezillaFeatures);

    /*********** Upazila ********************************/
    createChart(`graph_upazila_class`, `bar`, filteredDataUpazila.class);
    createChart(`graph_upazila_class_1`, `bar`, filteredDataUpazila.class_1);
    createChart(`graph_upazila_class_1_13`, `bar`, filteredDataUpazila.class_1_13);
    createChart(`graph_upazila_class_1_14`, `bar`, filteredDataUpazila.class_1_14);
    createChart(`graph_upazila_class_1_15`, `bar`, filteredDataUpazila.class_1_15);
    createChart(`graph_upazila_class_12`, `bar`, filteredDataUpazila.class_12);

}

// Add click event listener to the table
document.getElementById('table').addEventListener('click', displayUpazilaInfo);

/********************************************* */