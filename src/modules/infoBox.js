
import {
    generateChartData,
    createChartData,
    createChart,
    clearUpazilaCharts,
    clearDistCharts,
    clearDivCharts
} from './charts'
import {
    countFeatures,
    createUniqueAttributes,
    updateObjectKeyValue
} from './processing'
import {
    generateTable,
    clearTable, generateTableDataHeader, generateTable1, generateTableDataRow
} from './table'


import { Fill, Stroke, Style, Text, Circle, RegularShape } from "ol/style";




function handleMapInfoBoxClick(event, map) {
   let coordinate = event.coordinate;
    let powerLayerFeatures = map.getAllLayers()[2].getSource().getFeatures();

    // Get features at the clicked pixel
   let features = map.getFeaturesAtPixel(event.pixel);
    console.log(features)
    console.log(features)
    //generateTable(createUniqueAttributes(features, 'name_en'))
    if (features.length > 0) {
        
        // Open the info box and display information for the first feature
       let firstFeature = features[0];
       let properties = firstFeature.getProperties();
       let upazilaName = firstFeature.get('name_en')
        console.log(powerLayerFeatures.filter(feature=>feature.get('name_en')===upazilaName))
        const filteredFeaturesUpe = powerLayerFeatures.filter(feature=>feature.get('name_en')===upazilaName)
        console.log(filteredFeaturesUpe)
        clearTable()
        generateTable(createUniqueAttributes(powerLayerFeatures, 'name_en'))

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

        // Customize this part based on your feature properties
       let infoContent = '<strong>Feature Info:</strong><br>';
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                infoContent += key + ': ' + properties[key] + '<br>';
            }
        }

        // Open the info box and display information
       let infoBox = document.getElementById('info-box');
        infoBox.innerHTML = infoContent;

        // Position the info box just below the selected point
        infoBox.style.left = event.pixel[0] + 'px';
        infoBox.style.top = event.pixel[1] + 10 + 'px'; // Add some margin below the point
        infoBox.style.display = 'block';

        // Highlight the selected point
        highlightPoint(firstFeature, 2000);
    } else {
        // If no feature is clicked, close the info box
       let infoBox = document.getElementById('info-box');
        infoBox.style.display = 'none';
    }
}


function highlightPoint(feature) {
    // You can customize the highlight style based on your requirements
   let highlightStyle = new Style({
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
    setTimeout(function () {
        feature.setStyle(null); // Reset to the default style
    }, 2000);
}

function zoomToClickedFeature(event, map) {
   let coordinate = event.coordinate;
    clearInfoBox()
    // Get features at the clicked pixel
   let features = map.getFeaturesAtPixel(event.pixel);
    console.log(features)
    if (features.length > 0) {
        // Open the info box and display information for the first feature
       let firstFeature = features[0];
       let properties = firstFeature.getProperties();

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

        // Customize this part based on your feature properties
       let infoContent = '<strong>Feature Info:</strong><br>';
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                infoContent += key + ': ' + properties[key] + '<br>';
            }
        }

        // Open the info box and display information
       let infoBox = document.getElementById('info-box');
        infoBox.innerHTML = infoContent;

        // Position the info box just below the selected point
        infoBox.style.left = event.pixel[0] + 'px';
        infoBox.style.top = event.pixel[1] + 10 + 'px'; // Add some margin below the point
        infoBox.style.display = 'block';

        // Highlight the selected point
        highlightPoint(firstFeature, 2000);

    } else {
        // If no feature is clicked, close the info box
       let infoBox = document.getElementById('info-box');
        infoBox.style.display = 'none';
    }
}

function clearInfoBox() {
   let infoBox = document.getElementById('info-box');
    infoBox.style.display = 'none';
}


export { handleMapInfoBoxClick, highlightPoint, zoomToClickedFeature, clearInfoBox }