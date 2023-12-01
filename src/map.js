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




const geoUrl = 'http://localhost/geoserver/geonode/ows';
const geoserverUrl = 'http://localhost/geoserver/rest/workspaces/geonode/layers.json'

const getLayers = async()=>{
  try {
    nonExistentFunction();
  } catch (error) {
    console.error(error);
    // Expected output: ReferenceError: nonExistentFunction is not defined
    // (Note: the exact output may be browser-dependent)
  }
  
} 