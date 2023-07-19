
function recalculateRow1() {
  let arg1 = parseInt(document.getElementById("station1").value);
  let arg2 = parseInt(document.getElementById("stationQ1").value);
  document.getElementById("result1").innerHTML = arg1 + arg2;
}

window.recalculate = function() {
  let tbl = document.getElementById("table1");

  for (let i=1; i<tbl.rows.length; i++){
    let row = tbl.rows[i];
    let arg1 = parseInt(row.cells[0].children[0].value);
    let arg2 = parseInt(row.cells[1].children[0].value);
    row.cells[2].innerHTML = arg1 + arg2;
  }
}

window.addRow = function() {
  let tbl = document.getElementById("table1");

  let row = tbl.insertRow(-1);
  let rowCount = tbl.rows.length;
  for (let i=0; i<2; i++) {
    let cell = row.insertCell(-1);
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", rowCount + i);
    input.onchange = recalculate;
    cell.appendChild(input);
  }
  cell = row.insertCell(-1);
  document.getElementById("foo").innerHTML = "added row"
}