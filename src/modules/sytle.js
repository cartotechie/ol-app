import { Fill, Stroke, Style, Text, Circle, RegularShape } from "ol/style";

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


  export {powerLineStyle,substationStyle,adminBoundaryStyle}