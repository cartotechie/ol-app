import Chart from 'chart.js/auto';
import { getRandomColor, customColors } from './style'
import { featureKeys, classVariableValues } from './variables'
import { sortKeysInObject } from './sorting'
import {aggregateFeaturesByAtt,updateObjectKeyValue} from './processing'





function generateChartData(features) {
  const valueCounts = aggregateFeaturesByAtt(features)
  console.log(valueCounts)

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
  console.log(valueCounts)
  
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


    //clear charts header name
    const divName = document.getElementsByClassName('div-name')
    const distName = document.getElementsByClassName('dist-name')
    const upazilaName = document.getElementsByClassName('upazila-name')

    for (let i = 0; i < divName.length; i++) {
      divName[i].textContent = ''
     
  }

  for (let i = 0; i < distName.length; i++) {
      distName[i].textContent = ''

  }
  for (let i = 0; i < upazilaName.length; i++) {
      upazilaName[i].textContent = ''

  }
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


function displayUpezillasChart(features, selectedUpeName) {
  ////Charts
  for (let i = 0; i < upazilaName.length; i++) {
      upazilaName[i].textContent = ''
      upazilaName[i].textContent = selectedUpeName; // You can perform actions on each element here
  }
  let filteredDataUpe = generateChartData(features)
  createChart(`graph_upazila_class`, `bar`, filteredDataUpe.class);
  createChart(`graph_upazila_class_1`, `bar`, filteredDataUpe.class_1);
  createChart(`graph_upazila_class_1_13`, `bar`, filteredDataUpe.class_1_13);
  createChart(`graph_upazila_class_1_14`, `bar`, filteredDataUpe.class_1_14);
  createChart(`graph_upazila_class_1_15`, `bar`, filteredDataUpe.class_1_15);
  createChart(`graph_upazila_class_12`, `bar`, filteredDataUpe.class_12);
}

function displayDistrictChart(features, selectedDistName) {
  ////Charts
  for (let i = 0; i < distName.length; i++) {
      distName[i].textContent = ''
      distName[i].textContent = selectedDistName; // You can perform actions on each element here
  }

  let filteredDataDist = generateChartData(features)

  createChart(`graph_dist_class`, `bar`, filteredDataDist.class);
  createChart(`graph_dist_class_1`, `bar`, filteredDataDist.class_1);
  createChart(`graph_dist_class_1_13`, `bar`, filteredDataDist.class_1_13);
  createChart(`graph_dist_class_1_14`, `bar`, filteredDataDist.class_1_14);
  createChart(`graph_dist_class_1_15`, `bar`, filteredDataDist.class_1_15);
  createChart(`graph_dist_class_12`, `bar`, filteredDataDist.class_12);

}

function displayDivisionChart(features, selectedDivName) {
  ////Charts
  for (let i = 0; i < divName.length; i++) {
      divName[i].textContent = ''
      divName[i].textContent = selectedDivName; // You can perform actions on each element here
  }

  let filteredDataDiv = generateChartData(features);
  console.log(features)
  createChart(`graph_div_class`, `bar`, filteredDataDiv.class);
  createChart(`graph_div_class_1`, `bar`, filteredDataDiv.class_1);
  createChart(`graph_div_class_1_13`, `bar`, filteredDataDiv.class_1_13);
  createChart(`graph_div_class_1_14`, `bar`, filteredDataDiv.class_1_14);
  createChart(`graph_div_class_1_15`, `bar`, filteredDataDiv.class_1_15);
  createChart(`graph_div_class_12`, `bar`, filteredDataDiv.class_12);
}

export { generateChartData, createChartData, createChart, clearCharts, featureKeys, clearUpazilaCharts, clearDistCharts, clearDivCharts,displayDistrictChart,displayDivisionChart,displayUpezillasChart }