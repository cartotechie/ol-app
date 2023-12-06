const generateCharts =()=> {
    // Sample data for each chart
var lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [{
        label: 'Line Chart',
        borderColor: 'rgba(75, 192, 192, 1)',
        data: [65, 59, 80, 81, 56],
        fill: false,
    }]
  };
  
  var barChartData = {
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
    datasets: [{
        label: 'Bar Chart',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [65, 59, 80, 81, 56],
    }]
  };
  
  var bar2ChartData = {
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
    datasets: [{
        label: 'Bar Chart',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [65, 59, 80, 81, 56],
    }]
  };
  
  var radarChartData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [{
        label: 'Radar Chart',
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        data: [65, 59, 90, 81, 56, 55, 40],
    }]
  };
  
  // Function to create a chart
  function createChart(chartId, chartType, data) {
    var ctx = document.getElementById(chartId).getContext('2d');
    return new Chart(ctx, {
        type: chartType,
        data: data,
        options: {} // You can customize options here
    });
  }
  
  // Create charts using the above data
  var lineChart = createChart('graph1', 'line', lineChartData);
  var barChart = createChart('graph2', 'bar', barChartData);
  var bar2Chart = createChart('graph3', 'bar', barChartData);
  var radarChart = createChart('graph4', 'radar', radarChartData);
}

export {generateCharts}