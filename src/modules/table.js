const tableAttributes = ['div_name', 'dist_name', 'name_en'];

const generateTable = (features) => {
    //console.log('TABLE LOADED');
    //console.log(features);

    var table = document.createElement('table');

    // Create header row
    var headerRow = table.insertRow();
    tableAttributes.forEach(function (key) {
        var th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    // Create rows with data
    features.forEach(function (feature) {
        var row = table.insertRow();
        tableAttributes.forEach(function (key) {
            var td = document.createElement('td');
            //console.log(td)
            td.textContent = feature.get(key); // Get the value using the specified key
            row.appendChild(td);
        });
    });

    // Append the table to the div with id "table"
    const tableContainer = document.getElementById("table");
    tableContainer.appendChild(table);
};



function clearTable() {
    const tableContainer = document.getElementById('table');
    if (tableContainer) {
      tableContainer.innerHTML = ''; // Clear the content
      // Alternatively, you can remove the entire table element
      // tableContainer.parentNode.removeChild(tableContainer);
    }
  }

  function generateCollapsibleTable() {
    
      // Sample data
      var data = [
        { section: 'dhakaDivision', label: 'Dhaka Division', low: 1020, moderate: 3432, high: 1175, veryHigh: 0 },
        { section: 'dhakaDistrict', label: 'Dhaka District', low: 116, moderate: 680, high: 277, veryHigh: 0 },
        { section: 'dhakaDistrict', label: 'Dhaka Metropolitan', low: 36, moderate: 235, high: 71, veryHigh: 0 },
        { section: 'dhakaDistrict', label: 'Dhamrai Upazila', low: 17, moderate: 67, high: 50, veryHigh: 0 },
        { section: 'dhakaDistrict', label: 'Dohar Upazila', low: 0, moderate: 5, high: 3, veryHigh: 0 }
      ];
  
      var tableBody = document.getElementById('tableBody');
  
      // Generate table rows dynamically
      data.forEach(function (row) {
        var headerRow = document.createElement('tr');
        headerRow.className = 'collapsible-header';
        headerRow.setAttribute('data-section', row.section);
  
        var labelCell = document.createElement('td');
        labelCell.textContent = row.label;
  
        var lowCell = document.createElement('td');
        lowCell.textContent = row.low;
  
        var moderateCell = document.createElement('td');
        moderateCell.textContent = row.moderate;
  
        var highCell = document.createElement('td');
        highCell.textContent = row.high;
  
        var veryHighCell = document.createElement('td');
        veryHighCell.textContent = row.veryHigh;
  
        headerRow.appendChild(labelCell);
        headerRow.appendChild(lowCell);
        headerRow.appendChild(moderateCell);
        headerRow.appendChild(highCell);
        headerRow.appendChild(veryHighCell);
  
        tableBody.appendChild(headerRow);
  
        // Check if there are collapsible contents for this section
        if (row.section === 'dhakaDistrict') {
          var contentRow = document.createElement('tr');
          contentRow.className = 'collapsible-content';
          contentRow.setAttribute('data-section', row.section);
  
          var contentLabelCell = document.createElement('td');
          contentLabelCell.textContent = row.label; // Use the same label as the header
  
          var contentLowCell = document.createElement('td');
          contentLowCell.textContent = row.low;
  
          var contentModerateCell = document.createElement('td');
          contentModerateCell.textContent = row.moderate;
  
          var contentHighCell = document.createElement('td');
          contentHighCell.textContent = row.high;
  
          var contentVeryHighCell = document.createElement('td');
          contentVeryHighCell.textContent = row.veryHigh;
  
          contentRow.appendChild(contentLabelCell);
          contentRow.appendChild(contentLowCell);
          contentRow.appendChild(contentModerateCell);
          contentRow.appendChild(contentHighCell);
          contentRow.appendChild(contentVeryHighCell);
  
          tableBody.appendChild(contentRow);
        }
      });
  
      // Attach event listeners to collapsible headers
      var collapsibleHeaders = document.querySelectorAll('.collapsible-header');
  
      collapsibleHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
          var contentRow = this.nextElementSibling;
          var section = this.getAttribute('data-section');
  
          // Toggle the display of all content rows in the section
          var allContentRowsInSection = document.querySelectorAll(`.collapsible-content[data-section="${section}"]`);
          allContentRowsInSection.forEach(function (row) {
            row.style.display = (row.style.display === 'none') ? 'table-row' : 'none';
          });
        });
      });
    
  }
  
 
  

export {generateTable,clearTable,generateCollapsibleTable};
