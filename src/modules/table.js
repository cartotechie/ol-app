const generateTable = (data) => {
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

    // Append the header row to the table
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
};



export { generateTable };
