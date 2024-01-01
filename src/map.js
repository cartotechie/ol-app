import LayerGroup from 'ol/layer/Group';
import {
    glowingStyle,
    substationStyle,
    adminBoundeleselectedStyle,
    multiVarPointStyleFunction,defaultStyle, styleFunction, adminBoundaryStyle
} from './modules/style'
import {handleMapInfoBoxClick} from './modules/infoBox'
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
    createVectorLayer,createSubVectorLayer
} from './init'
import {
    province,
    commune,
    districts,
    upezilla,
    districtsByDivision,featureKeys
} from './modules/variables'

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
import {classesValues} from './modules/dataStore'
import{createDropdownTable} from './modules/dropDownTable' 
const geoJsonEndpoint = './data/powertowers.json';


let searchTerm
let selected //= 'Sylhet Division';
let selectedDistrict //= 'Sylhet District';
let valueUpazila
let selectedDistricts = [];
let selectedUpezillas = [];

const selectedPointStyle = (feature)=>{
  
    if(feature.get(province)===selected||feature.get(commune)===selectedDistrict||feature.get('name_en')===valueUpazila){
     //cases= feature.get('cases')
    //deaths=  feature.get('deaths')
    console.log('selected')
return glowingStyle
    }
    

    return styleFunction(feature)
}
const selectedPolyStyle = (feature)=>{
  
    if(feature.get(province)===selected||feature.get(commune)===selectedDistrict||feature.get('name_en')===valueUpazila){
     //cases= feature.get('cases')
    //deaths=  feature.get('deaths')
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


createDropdownTable(4, 4); 
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
        


        if (response.ok) {
            
            const responseJSON = await response.json();
            console.log(responseJSON)
            const layer = new VectorLayer({
                visible: true,
                style:selectedPolyStyle,
                source: new VectorSource({
                    features: new GeoJSON().readFeatures(responseJSON[1] ),

                }),

                title: 'Upazila boundary'
            });
            

            mapLayers.push(layer);
            mapLayers.push(createVectorLayer(responseJSON[0] , 'Powerlines', ''));

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
                layers: [mapLayers[0],layerGroup]
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

    function getSearchTerm(event) {
        event.preventDefault
        
        const searchInputTerm = document.getElementById('search-input')
        
        
        const layer = map.getAllLayers()[2]
        const features = layer.getSource().getFeatures();
        
        onclickDivision(searchInputTerm.value)
        

        
    }
//const searchFormElement = document.getElementById('geocode-form')
document.getElementById('geocode-form').addEventListener('click',getSearchTerm)



function onclickDivision(term) {

    const layer = map.getAllLayers()[2]
    const features = layer.getSource().getFeatures();

    searchTerm = term;
    adminName.innerHTML = `${searchTerm}`



    const filteredFeatures = features.filter(feature => feature.get(province)=== searchTerm||feature.get(commune)=== searchTerm||feature.get(upezilla) === searchTerm);
    if (filteredFeatures.length>0) {
        const extent = olExtent.boundingExtent(filteredFeatures.map(feature => feature.getGeometry().getExtent()));
    console.log(filteredFeatures)
    map.getView().fit(extent, {
        padding: [10, 10, 10, 10],
        duration: 1000
    });
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


    /**featureKeys.forEach(className => className)
    // Iterate over the array using forEach

    const filteredData = generateChartData(filteredFeatures);

    // Create charts
    clearDivCharts()
    clearDistCharts()
    clearUpazilaCharts()




    createChart(`graph_div_class`, `bar`, filteredData.class);
    createChart(`graph_div_class_1`, `bar`, filteredData.class_1);
    createChart(`graph_div_class_1_13`, `bar`, filteredData.class_1_13);
    createChart(`graph_div_class_1_14`, `bar`, filteredData.class_1_14);
    createChart(`graph_div_class_1_15`, `bar`, filteredData.class_1_15);
    createChart(`graph_div_class_12`, `bar`, filteredData.class_12);***/

    layer.changed();
}


