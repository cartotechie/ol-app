import Chart from 'chart.js/auto';
import { getRandomColor, customColors } from './style'
import { featureKeys, classVariableValues } from './variables'
import { sortKeysInObject } from './sorting'
import {aggregateFeaturesByAtt,updateObjectKeyValue} from './processing'





function generateChartData(features) {
  const valueCounts = aggregateFeaturesByAtt(features)

  return {
    class: createChartData('Flood exposure', 'class', valueCounts),
    class_1: createChartData('LULC', 'class_1', valueCounts),
    class_1_13: createChartData('Windspeed 100m', 'class_1_13', valueCounts),
    class_1_14: createChartData('Earthquake', 'class_1_14', valueCounts),
    class_1_15: createChartData('Landslide susceptibility', 'class_1_15', valueCounts),
    class_12: createChartData('Maintenance', 'class_12', valueCounts),
  };
}

function createChartData(label, key, valueCounts) {
  
  //console.log(valueCounts)
  const objectKeyValue = updateObjectKeyValue(key, valueCounts, classVariableValues)
  
  //console.log(sortKeysInObject(objectKeyValue))
  const sortedObjectKeyValue = sortKeysInObject(objectKeyValue)
  const labels = Object.keys(sortedObjectKeyValue);
  //console.log(valueCounts)
  //console.log(labels.sort(sortOrderLowToVeryHigh))
  const dataValues = Object.values(sortedObjectKeyValue);

  const colors = customColors || ['rgba(75, 192, 192, 0.2)'];

  return {
    labels: labels,
    datasets: [{
      //label: label,
      backgroundColor: colors,
      borderColor: 'black',
      borderWidth: 1,
      barThickness: 30,
      data: dataValues,
    }],

  };
}

function createChart(chartId, chartType, data) {
  var ctx = document.getElementById(chartId).getContext('2d');
  return new Chart(ctx, {
    type: chartType,
    data: data,
    options: {
      scales: {
        y: {
          suggestedMin: 0,
          //suggestedMax: 50,
        }
      },
      plugins: {
        legend: {
          display: false, // Set to false to hide the legend
        },
      },
    }
  });
}

function clearCharts() {
  // Get all chart elements and destroy them
  ['graph_div_class',
    'graph_div_class_1',
    'graph_div_class_1_13',
    'graph_div_class_1_14', 'graph_div_class_1_15', 'graph_div_class_12', 'graph_dist_class', 'graph_dist_class_1', 'graph_dist_class_1_13', 'graph_dist_class_1_14', 'graph_dist_class_1_15', 'graph_dist_class_12', 'graph_upazila_class', 'graph_upazila_class_1', 'graph_upazila_class_1_13', 'graph_upazila_class_1_14', 'graph_upazila_class_1_15', 'graph_upazila_class_12'].forEach(chartId => {
      var existingChart = Chart.getChart(chartId);
      if (existingChart) {
        existingChart.destroy();
      }
    });
}

function clearDivCharts() {
  // Get all chart elements and destroy them
  ['graph_div_class',
    'graph_div_class_1',
    'graph_div_class_1_13',
    'graph_div_class_1_14',
    'graph_div_class_1_15',
    'graph_div_class_12'].forEach(chartId => {
      var existingChart = Chart.getChart(chartId);
      if (existingChart) {
        existingChart.destroy();
      }
    });
}


function clearDistCharts() {
  // Get all chart elements and destroy them
  ['graph_dist_class', 'graph_dist_class_1', 'graph_dist_class_1_13', 'graph_dist_class_1_14', 'graph_dist_class_1_15', 'graph_dist_class_12',].forEach(chartId => {
    var existingChart = Chart.getChart(chartId);
    if (existingChart) {
      existingChart.destroy();
    }
  });
}

function clearUpazilaCharts() {
  // Get all chart elements and destroy them
  ['graph_upazila_class', 'graph_upazila_class_1', 'graph_upazila_class_1_13', 'graph_upazila_class_1_14', 'graph_upazila_class_1_15', 'graph_upazila_class_12'].forEach(chartId => {
    var existingChart = Chart.getChart(chartId);
    if (existingChart) {
      existingChart.destroy();
    }
  })
};


export { generateChartData, createChartData, createChart, clearCharts, featureKeys, clearUpazilaCharts, clearDistCharts, clearDivCharts }