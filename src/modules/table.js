import { tableAttributes, featureKeys, classVariableValues } from './variables'
import { createUniqueAttributes, aggregateFeaturesByAtt, updateObjectKeyValue } from './processing'
import { sortKeysInObject } from './sorting'
import tableFunctions from './tables/tablesDOMFunctions';


const generateTable = (features) => {
    const table = document.createElement('table');
    

    // Create header row
    const headerRow = table.insertRow();
    tableAttributes.forEach(function (key) {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    // Create rows with data
    features.forEach(function (feature) {
        const row = table.insertRow();
        tableAttributes.forEach(function (key) {
            const td = document.createElement('td');
            //console.log(td)
            td.textContent = feature.get(key); // Get the value using the specified key
            row.appendChild(td);
        });
    });

    // Append the table to the div with id "table"
    const tableContainer = document.getElementById("table");
    tableContainer.appendChild(table);
};


function generatetableDataObject(features, featureKeys) {

    const tableDataObject = {}

    for (let i = 0; i < featureKeys.length; i++) {

        const updatedObjectKeyValue = updateObjectKeyValue(featureKeys[i], aggregateFeaturesByAtt(features, featureKeys[0]), classVariableValues)
        const sortedKeysInObject = sortKeysInObject(updatedObjectKeyValue)

        tableDataObject[featureKeys[i]] = sortedKeysInObject
        //console.log(featureKeys[i],sortedKeysInObject)
    }

    return tableDataObject
}

function generateTableDataRow(features, name,table,attributeName) {

    const tableDataObject = generatetableDataObject(features, featureKeys)
    tableDataObject['name'] = name

    // Create data row
    const dataRow = table.insertRow();
    const nameCell = document.createElement('td');
    nameCell.textContent = tableDataObject.name;
    dataRow.appendChild(nameCell);

    for (const key in tableDataObject[attributeName]) {
        const td = document.createElement('td');
        td.textContent = tableDataObject[attributeName][key];
        dataRow.appendChild(td);
    }

    //tableFunctions.generateDataRowForClass(table, tableDataObject.class, tableDataObject.name);
    return dataRow
}


function generateTableDataHeader(features, table,attributeName) {
    const tableDataObject = generatetableDataObject(features, featureKeys)
    //tableDataObject['name'] = name
    // Create header row
    const headerRow = table.insertRow();
    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Name';
    headerRow.appendChild(nameHeader);

    for (const key in tableDataObject[attributeName]) {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    }
    return headerRow
}

function generateTable1() {

    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');

    collapsibleHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            const contentRow = this.nextElementSibling;
            const section = this.getAttribute('data-section');

            // Toggle the display of all content rows in the section
            const allContentRowsInSection = document.querySelectorAll(`.collapsible-content[data-section="${section}"]`);
            allContentRowsInSection.forEach(function (row) {
                row.style.display = (row.style.display === 'none') ? 'table-row' : 'none';
            });
        });
    });

}






function clearTable() {
    const tableContainer = document.getElementById('table');
    const summaryStatsElement = document.getElementById('summary-stats')
    if (tableContainer) {
        tableContainer.innerHTML = ''; // Clear the content
        // Alternatively, you can remove the entire table element
        // tableContainer.parentNode.removeChild(tableContainer);
    }
    if (summaryStatsElement) {
        summaryStatsElement.innerHTML = ''; // Clear the content
        // Alternatively, you can remove the entire table element
        // tableContainer.parentNode.removeChild(tableContainer);
    }
}



export { generateTable, clearTable, generateTableDataHeader, generateTable1,generateTableDataRow };
