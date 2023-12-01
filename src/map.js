import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import Map from 'ol/Map';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/Vector';
import { OSM, Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import LayerGroup from 'ol/layer/Group';
import LayerSwitcher from 'ol-layerswitcher';
import LayerTile from 'ol/layer/Tile';
import {substationStyle,powerLineStyle,adminBoundaryStyle} from './modules/sytle'




const geoserverEndpoint = 'http://localhost/geoserver/geonode/ows';
const geoserverUrl = [
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Aadmin_boundaries_osm_refined&outputFormat=application/json&srsname=EPSG:4326',
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Abangladesh_powerplants_updated_upazilla&outputFormat=application/json&srsname=EPSG:4326',
  'http://localhost/geoserver/geonode/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=geonode%3Abangladesh_powertlines_withvoltage_lulc&outputFormat=application/json&srsname=EPSG:4326']
const defaultCenter = [90, 24];
const defaultZoom = 7.8;

// Function to create a Vector Layer from GeoJSON
const createVectorLayer = (geoJSON, title,style) => {
  return new VectorLayer({
    style:style,
    source: new VectorSource({
      features: new GeoJSON().readFeatures(geoJSON),
      
    }),
    
    title: title
  });
};

const initMap = () => {
  const osm = new LayerTile({
    title: 'OSM',
    type: 'base',
    visible: false,
    source: new OSM()
  });

  const map = new Map({
    target: 'map',
    layers: [osm],
    view: new View({
      projection: 'EPSG:4326',
      center: defaultCenter,
      zoom: defaultZoom,
    }),
  });

  const layerSwitcher = new LayerSwitcher({
    reverse: true,
    groupSelectStyle: 'group'
  });
  map.addControl(layerSwitcher);

  return map;
};

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
    } else {
      throw new Error('No valid GeoJSON data available');
    }

  } catch (error) {
    console.error('There was a problem fetching the data:', error);
  }
};

getLayers();
