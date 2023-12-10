
const featureKeys = ['class', 'class_1', 'class_1_13', 'class_1_14', 'class_1_15', 'class_12'];

function generateChartData(features) {
  const valueCounts = {};
  const featureKeys = ['class', 'class_1', 'class_1_13', 'class_1_14', 'class_1_15', 'class_12'];

  features.forEach(feature => {
    featureKeys.forEach(key => {
      const value = feature.get(key);
      valueCounts[key] = { ...(valueCounts[key] || {}), [value]: (valueCounts[key]?.[value] || 0) + 1 };
    });
  });

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
  return {
    labels: Object.keys(valueCounts[key]),
    datasets: [{
      label: label,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      data: Object.values(valueCounts[key]),
    }]
  };
}

function createChart(chartId, chartType, data) {
  var ctx = document.getElementById(chartId).getContext('2d');
  return new Chart(ctx, {
    type: chartType,
    data: data,
    options: {} // You can customize options here
  });
}

function clearCharts() {
  // Get all chart elements and destroy them
  ['graph_div_class', 
  'graph_div_class_1', 
  'graph_div_class_1_13',
   'graph_div_class_1_14', 'graph_div_class_1_15', 'graph_div_class_12','graph_dist_class', 'graph_dist_class_1', 'graph_dist_class_1_13', 'graph_dist_class_1_14', 'graph_dist_class_1_15', 'graph_dist_class_12','graph_upazila_class', 'graph_upazila_class_1', 'graph_upazila_class_1_13', 'graph_upazila_class_1_14', 'graph_upazila_class_1_15', 'graph_upazila_class_12'].forEach(chartId => {
    var existingChart = Chart.getChart(chartId);
    if (existingChart) {
      existingChart.destroy();
    }
  });
}


export {generateChartData,createChartData,createChart,clearCharts,featureKeys}