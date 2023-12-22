function createDropdownTable(rows, columns) {
    var table = document.getElementById("dropdownTable");
    var tbody = table.getElementsByTagName("tbody")[0];

    for (var i = 0; i < rows; i++) {
      var row = document.createElement("tr");

      for (var j = 0; j < columns; j++) {
        var cell = document.createElement("td");
        var select = document.createElement("select");

        for (var k = 1; k <= 3; k++) {
          var option = document.createElement("option");
          option.value = "option" + k;
          option.text = "Option " + k;
          select.appendChild(option);
        }

        cell.appendChild(select);
        row.appendChild(cell);
      }

      tbody.appendChild(row);
    }
  }

  export{createDropdownTable} 