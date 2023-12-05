
import LayerGroup from 'ol/layer/Group';
import {substationStyle,powerLineStyle,adminBoundaryStyle,getPolygonStyle} from './modules/sytle'
import { countMunicipalities, populateOptionElemets, generateSelectElementValues } from './modules/domElements';
import { getProvinceName,getDistrictName } from './modules/search_select';
import VectorLayer from 'ol/layer/Vector';
import { OSM, Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import{  initMap,createVectorLayer} from './init'
import {province,commune, districts} from './modules/variables'
import{generateTable} from './modules/table' 
import{divisions}  from './modules/variables' 
import{generateCharts} from './modules/charts' 


const geoserverEndpoint = 'http://localhost/geoserver/geonode/ows';


  let selectedProvince;
  let selectedMunicipality;
  let selectedMunicipalities = [];

/*const geoserverUrl = [
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Aadmin_boundaries_osm_refined&outputFormat=application/json&srsname=EPSG:4326',
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Abangladesh_powerplants_updated_upazilla&outputFormat=application/json&srsname=EPSG:4326',
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Abangladesh_powertlines_withvoltage_lulc&outputFormat=application/json&srsname=EPSG:4326'
]*/

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
      //console.log(layer.getSource().getFeatures())

// Assuming 'layer' is your vector layer
var features = layer.getSource().getFeatures();

/*/ Iterate through the features
features.forEach(function(feature) {
    // Access individual feature properties or geometry
    var geometry = feature.getGeometry();
    var properties = feature.getProperties();

    // Do something with the geometry and properties
    console.log("Geometry:", geometry);
    console.log("Properties:", properties);
});*/
//console.log(getDistrictName(layer.getSource().getFeatures()))
       ///populate province dropdown menu
             for(let i = 0;i < /*getProvinceName(layer.getSource().getFeatures())*/divisions.length;i++ ){
              //console.log((layer.getSource().getFeatures())[i])
              //console.log(/*getProvinceName(layer.getSource().getFeatures())*/divisions[i])
               populateOptionElemets(/*getProvinceName(layer.getSource().getFeatures())*/divisions[i], "division")}

                 // Select features from options dropdown arrow
			function onchange(event) {
				event.preventDefault()
				selectedProvince = event.target.value;
				//console.log(selectedProvince)
				/*for (let i = 0; document.getElementById("division").options.length > i; i++) {
					console.log(document.getElementById("provinces").options[i].value)
					if (selectedProvince === event.target.value) {
						document.querySelector(`#division option[value= "${document.getElementById("division").options[i].value}"]`).disabled = true
					}
				}*/

        let divisionOptions = document.getElementById("division").options;
for (let i = 0; i < divisionOptions.length; i++) {
   // console.log(document.getElementById("division").options[i].value);

    if (selectedProvince === event.target.value) {
        document.querySelector(`#division option[value="${divisionOptions[i].value}"]`).disabled = true;
    }
}

      
				/*********************** */
				/*for (let i = 0; i < layer.getSource().getFeatures().length; i++) {
					if (layer.getSource().getFeatures()[i].get(province) === selectedProvince) {
						//console.log(layer.getSource().getFeatures()[i].get(commune))
						selectedMunicipalities.push(layer.getSource().getFeatures()[i].get(commune))
						//console.log(selectedMunicipalities)
						countMunicipalities(selectedMunicipalities,selectedProvince)
						populateOptionElemets(layer.getSource().getFeatures()[i].get(commune), "district")
						//layer.setStyle(newStyle);
						const newex = layer.getSource().getFeatures()[i].getGeometry()
						map.getView().fit(newex);
						
					}
				}*/

        for (let i = 0; i < districts.length; i++) {
					
						populateOptionElemets(districts[i], "district")

						
						
					}
				

				layer.changed();
				
			}
			document.getElementById('division').addEventListener('change', onchange)
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

 