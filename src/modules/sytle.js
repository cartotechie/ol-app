import { Fill, Stroke, Style, Text, Circle, RegularShape } from "ol/style";
import {map} from '../init'
import { division } from './variables';



// Styles for Power Lines
const powerLineStyle = new Style({
  stroke: new Stroke({
    color: '#FF5733', // Orange color
    width: 2,
  }),
});

// Style for Substations (as points)
const substationStyle = new Style({
  image: new Circle({
    radius: 8,
    fill: new Fill({
      color: '#33A1DE', // Light blue fill
    }),
    stroke: new Stroke({
      color: '#FFFFFF', // White stroke
      width: 2,
    }),
  }),
});

// Style for Administrative Boundaries
const adminBoundaryStyle = new Style({
  stroke: new Stroke({
    color: '#4CAF50', // Green color
    width: 1,
  }),
//fill: new Fill({color: 'rgba(76, 175, 80, 0.1)', /*Green with reduced opacity*/}),
});


// Style function for the polygon layer
function getPolygonStyle(feature) {

  console.log(feature);
  // Extract attributes from the feature properties

  // Default style
  var defaultStyle = new Style({
    fill: new Fill({
      color: 'rgba(204, 204, 204, 0.8)', // Default fill color
    }),
    stroke: new Stroke({
      color: '#000000', // Default border color
      width: 1, // Default border width
    }),
  });

  var zoom = map.getView().getZoom();
// Define a mapping of division names to colors
const divisionColors = {
  [division[0]]: 'rgba(255, 0, 0, 0.8)', // Red
  [division[1]]: 'purple', // Green
  [division[2]]: 'rgba(0, 0, 255, 0.8)', // Blue
  [division[3]]: 'brown', // Blue
  [division[4]]: 'black', // Blue
  [division[5]]: 'lime', // Blue
  [division[6]]: 'orange', // Blue
  [division[7]]: 'white', // Blue

};

// Base style for different divisions
let baseStyle = new Style({
  fill: new Fill({
    color: 'rgba(0, 0, 0, 0)', // Transparent fill color
  }),
  stroke: new Stroke({
    color: '#000000',
    width: 1,
  }),
});

const divName = feature.get('div_name');

// Modify baseStyle based on the division
if (divisionColors.hasOwnProperty(divName)) {
  baseStyle.getFill().setColor(divisionColors[divName]);
}

// Return modified style if a condition is met, otherwise, return default style
return divisionColors.hasOwnProperty(divName) ? baseStyle : defaultStyle;
}



  export {powerLineStyle,substationStyle,adminBoundaryStyle,getPolygonStyle}