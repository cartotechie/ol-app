// Function 1: Create a table element
function createTable() {
    return document.createElement('table');
}

// Function 2: Create a header row
function createHeaderRow(table) {
    const headerRow = table.insertRow();
    return headerRow;
}

// Function 3: Create a table header cell
function createTableHeaderCell(key) {
    const th = document.createElement('th');
    th.textContent = key;
    return th;
}

// Function 4: Append a table header cell to the header row
function appendTableHeaderCell(headerRow, th) {
    headerRow.appendChild(th);
}

// Function 5: Create a data row
function createDataRow(table) {
    const dataRow = table.insertRow();
    return dataRow;
}

// Function 6: Create a table data cell
function createTableDataCell(value) {
    const td = document.createElement('td');
    td.textContent = value;
    return td;
}

// Function 7: Append a table data cell to the data row
function appendTableDataCell(dataRow, td) {
    dataRow.appendChild(td);
}

// Function 8: Generate header row for "class" property
function generateHeaderRowForClass(table, classData) {

    const headerRow = createHeaderRow(table);
    for (const key in classData) {
        const th = createTableHeaderCell(key);
        appendTableHeaderCell(headerRow, th);
    }
}

// Function 9: Generate data row for "class" property
function generateDataRowForClass(table, classData,adminName) {
const dataRow = createDataRow(table);

const nameCell = document.createElement('td');
nameCell.textContent = adminName;
dataRow.appendChild(nameCell);
    for (const key in classData) {
        const td = createTableDataCell(classData[key]);
        appendTableDataCell(dataRow, td);
    }
}

// Export the functions as an object
const tableFunctions = {
    createTable,
    createHeaderRow,
    createTableHeaderCell,
    appendTableHeaderCell,
    createDataRow,
    createTableDataCell,
    appendTableDataCell,
    generateHeaderRowForClass,
    generateDataRowForClass
};

export default tableFunctions;
