
import LayerGroup from 'ol/layer/Group';
import {substationStyle,powerLineStyle,adminBoundaryStyle} from './modules/sytle'
import { countMunicipalities, populateOptionElemets, generateSelectElementValues } from './modules/domElements';
import { getProvinceName } from './modules/search_select';

import{  initMap,createVectorLayer} from './init'


const geoserverEndpoint = 'http://localhost/geoserver/geonode/ows';
const geoserverUrl = [
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Aadmin_boundaries_osm_refined&outputFormat=application/json&srsname=EPSG:4326',
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Abangladesh_powerplants_updated_upazilla&outputFormat=application/json&srsname=EPSG:4326',
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Abangladesh_powertlines_withvoltage_lulc&outputFormat=application/json&srsname=EPSG:4326']

  let selectedProvince;
  let selectedMunicipality;
  let selectedMunicipalities = [];




const getLayers = async () => {
  try {
    const mapLayers = [];
    
    // Fetch GeoJSON data
    const response = await fetch(geoserverUrl[0]);
    const response1 = await fetch(geoserverUrl[1]);
    const response2 = await fetch(geoserverUrl[2]);
    
    if (response.ok) {
      const responseJSON = await response.json();
      const layer = createVectorLayer(responseJSON, 'Layer1',adminBoundaryStyle);
      mapLayers.push(layer);
      console.log(responseJSON);
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

      const layer =  mapLayers[0]
      console.log('layer.getSource().getFeatures()')
       ///populate province dropdown menu
             for(let i = 0;i < getProvinceName(layer.getSource().getFeatures()).length;i++ ){
              console.log((layer.getSource().getFeatures())[i])
              console.log(getProvinceName(layer.getSource().getFeatures())[i])
               populateOptionElemets(getProvinceName(layer.getSource().getFeatures())[i], "provinces")
            
             }
         
    } else {
      throw new Error('No valid GeoJSON data available');
    }

  } catch (error) {
    console.error('There was a problem fetching the data:', error);
  }
};

getLayers();
