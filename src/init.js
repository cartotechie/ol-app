import 'ol/ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import Map from 'ol/Map';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/Vector';
import { OSM, Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';

import LayerSwitcher from 'ol-layerswitcher';
import LayerTile from 'ol/layer/Tile';

const defaultCenter = [90, 24];
const defaultZoom = 7;

const map = new Map({
  target: 'map',
  layers: [],
  view: new View({
    projection: 'EPSG:4326',
    center: defaultCenter,
    maxZoom:18,
    zoom: defaultZoom,
  }),
});

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
      //visible: false,
      source: new OSM()
    });
  
   
  
    const layerSwitcher = new LayerSwitcher({
      reverse: true,
      groupSelectStyle: 'group'
    });
    map.addControl(layerSwitcher);
  
    return map;
  };

  export {initMap,createVectorLayer,map}