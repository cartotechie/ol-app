
import LayerGroup from 'ol/layer/Group';
import {substationStyle,powerLineStyle,adminBoundaryStyle,getPolygonStyle} from './modules/sytle'
import { countFeatures, populateOptionElemets, generateSelectElementValues } from './modules/domElements';
import { getProvinceName,getDistrictName } from './modules/search_select';
import VectorLayer from 'ol/layer/Vector';
import { OSM, Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import{  initMap,createVectorLayer} from './init'
import {province,commune, districts,upazilla} from './modules/variables'
import{generateTable} from './modules/table' 
import{divisions}  from './modules/variables' 
import{generateCharts} from './modules/charts' 


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
        style:function(feature) {
          //return getPolygonStyle(feature)
          return adminBoundaryStyle
        },
        source: new VectorSource({
          features: new GeoJSON().readFeatures(responseJSON),
          
        }),
        
        title: 'title'
      });
      mapLayers.push(layer);
      ;
      
    }

    if (response1.ok) {
      const responseJSON = await response1.json();
      
      const layer = createVectorLayer(responseJSON, 'Layer2',substationStyle);
      mapLayers.push(layer);
      
    }

    if (response2.ok) {
      const responseJSON = await response2.json();
      
      const layer = createVectorLayer(responseJSON, 'Layer3',powerLineStyle);
      mapLayers.push(layer);
      
    }

    if (mapLayers.length > 0) {
      const map = initMap();
      

      // Add layers to LayerGroup and then to the map
      map.addLayer(new LayerGroup({
        title: 'MapLayers',
        layers: mapLayers
      }));

      const layer =  mapLayers[1]



      /******************************************* */
      const features = layer.getSource().getFeatures();

             for(let i = 0;i < divisions.length;i++ ){
              
               populateOptionElemets(divisions[i], "division")
              
              }

                 for (let i = 0; i < districts.length; i++) {

                  populateOptionElemets(districts[i], "district")

                }

                /****************************************************** */




                /*************************************************************** */

                console.log('REMOVE POPULATE divion name from function below')

                const DIVISION_ID = "division";

                function onchange(event) {
                    event.preventDefault();
                    selectedProvince = event.target.value;
                
                    let divisionOptions = document.getElementById(DIVISION_ID).options;
                
                    /*for (let i = 0; i < divisionOptions.length; i++) {
                        document.querySelector(`#${DIVISION_ID} option[value="${divisionOptions[i].value}"]`).disabled = (selectedProvince === divisionOptions[i].value);
                    }*/
                                                        
const uniqueCommunes = new Set();
console.log(uniqueCommunes)

features
  .filter(feature => feature.get(province) === selectedProvince)
  .forEach(feature => {
    console.log(feature)
    const communeValue = feature.get(commune);
    selectedDistricts.push(communeValue);
    countFeatures(selectedDistricts, selectedProvince);


    // Add the commune value to the set for counting unique values
    uniqueCommunes.add(communeValue);
  });

// Update the DOM with the count
const countDisplayDistricts = document.getElementById('countDisplayDistricts');
countDisplayDistricts.textContent = `${uniqueCommunes.size} Districts`;

const uniqueUpezillas = new Set();


features
  .filter(feature => feature.get(province) === selectedProvince)
  .forEach(feature => {
    const upazillaValue = feature.get('name_en');
    
    selectedUpezillas.push(upazillaValue);
    

    const newex = feature.getGeometry();
    map.getView().fit(newex);

    // Add the upazilla value to the set for counting unique values
    uniqueUpezillas.add(upazillaValue);
  });

// Update the DOM with the count
const countDisplayUpezillas = document.getElementById('countDisplayUpezillas');
countDisplayUpezillas.textContent = ` ${uniqueUpezillas.size} Upezillas`;

//console.log(features.length)

layer.changed();
                

                
                
                  
                }
                
                document.getElementById(DIVISION_ID).addEventListener('change', onchange);
                

      // info box

      map.on('click', function (event) {
        var coordinate = event.coordinate;
        console.log('Clicked coordinate:', coordinate);
        // Open the info box and display information
        var infoBox = document.getElementById('info-box');
        infoBox.innerHTML = 'Latitude: ' + coordinate[1] + '<br>Longitude: ' + coordinate[0];
        infoBox.style.left = event.pixel[0] + 'px';
        infoBox.style.top = event.pixel[1] + 'px';
        infoBox.style.display = 'block';

        
      });
      
      
      generateTable(layer.getSource().getFeatures())

      generateCharts()



    } else {
      throw new Error('No valid GeoJSON data available');
    }

  } catch (error) {
    console.error('There was a problem fetching the data:', error);
  }
};

getLayers();


/*****************************************+ */

 