/*const generateTable1 = (data) => {
    // Data to populate the table
    const tableData = [
        ["Barishal Division", "Barguna District", "Amtali Upazila"],
        ["Barishal Division", "Barguna District", "Taltali Upazila"],
        ["Barishal Division", "Barisal District", "Agailjhara Upazila"],
        ["Barishal Division", "Barisal District", "Babuganj Upazila"],
        ["Barishal Division", "Barisal District", "Bakerganj Upazila"],
        ["Barishal Division", "Barisal District", "Barisal Sadar Upazila"],
        ["Barishal Division", "Barisal District", "Gouranadi Upazila"],
        ["Barishal Division", "Barguna District", "Amtali Upazila"],
        ["Barishal Division", "Barguna District", "Taltali Upazila"],
        ["Barishal Division", "Barisal District", "Agailjhara Upazila"],
        ["Barishal Division", "Barisal District", "Babuganj Upazila"],
        ["Barishal Division", "Barisal District", "Bakerganj Upazila"],
        ["Barishal Division", "Barisal District", "Barisal Sadar Upazila"],
        ["Barishal Division", "Barisal District", "Gouranadi Upazila"],
        ["Barishal Division", "Barguna District", "Amtali Upazila"],
        ["Barishal Division", "Barguna District", "Taltali Upazila"],
        ["Barishal Division", "Barisal District", "Agailjhara Upazila"],
        ["Barishal Division", "Barisal District", "Babuganj Upazila"],
        ["Barishal Division", "Barisal District", "Bakerganj Upazila"],
        ["Barishal Division", "Barisal District", "Barisal Sadar Upazila"],
        ["Barishal Division", "Barisal District", "Gouranadi Upazila"]
        // Add more rows as needed
    ];

    // Assuming you have an ordered list with the id "featureList"
    const ol = document.getElementById("featureList");

    // Create a table element
    const table = document.createElement("table");

    // Create header row
    const headerRow = document.createElement("tr");

    // Loop to create header cells
    /*for (let i = 1; i <= 3; i++) {
        const headerCell = document.createElement("th");
        headerCell.textContent = "Column " + i;
        headerRow.appendChild(headerCell);
    }*/

    /*/ Append the header row to the table
    table.appendChild(headerRow);

    // Loop through the data array to create data rows
    for (let j = 0; j < tableData.length; j++) {
        const dataRow = document.createElement("tr");

        // Loop through each item in the current row to create data cells
        for (let k = 0; k < tableData[j].length; k++) {
            const dataCell = document.createElement("td");
            dataCell.textContent = tableData[j][k];
            dataRow.appendChild(dataCell);
        }

        table.appendChild(dataRow);
    }

    // Append the table to the div with id "table"
    const tableContainer = document.getElementById("table");
    tableContainer.appendChild(table);
};*/

/*const generateTable2 = (features)=>{
    console.log('I AM WORKING')
    console.log(features)

    var table = document.createElement('table');

  // Create header row
  var headerRow = table.insertRow();
  Object.keys(features[0].getProperties()).forEach(function(key) {
    var th = document.createElement('th');
    th.textContent = key;
    headerRow.appendChild(th);
  });

  // Create rows with data
  features.forEach(function(feature) {
    var row = table.insertRow();
    Object.values(feature.getProperties()).forEach(function(value) {
      var td = document.createElement('td');
      td.textContent = value;
      row.appendChild(td);
    });
  });

  // Append the table to the div with id "table"
  const tableContainer = document.getElementById("table");
  tableContainer.appendChild(table);
    
} */

const tableAttributes = ['div_name', 'dist_name', 'name_en'];

const generateTable = (features) => {
    console.log('I AM WORKING');
    console.log(features);

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
            td.textContent = feature.get(key); // Get the value using the specified key
            row.appendChild(td);
        });
    });

    // Append the table to the div with id "table"
    const tableContainer = document.getElementById("table");
    tableContainer.appendChild(table);
};

// Example usage:
// const features = ... // Your features array
// generateTable(features);



export {generateTable};
