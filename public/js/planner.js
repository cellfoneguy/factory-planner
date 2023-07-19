
// fetch data
const res = await fetch("data.json");
const data = await res.json()

console.log(data);
const STATIONS = data.stations;
console.log(STATIONS);

// get station object by name
function getStationByName(name) {
  for (let i=0; i<STATIONS.length; i++) {
    if (STATIONS[i].name == name) {
      return STATIONS[i];
    }
  }
  return null;
}


// init populate the station selector dropdown
function populateStationSelector(stationSelector) {
  for (let i=0; i < STATIONS.length; i++) {
    let opt = document.createElement("option");
    opt.text = STATIONS[i].name;
    stationSelector.add(opt, null);
  }
}

// DEPRECATED - init populate the recipe selector dropdown
function populateRecipeSelector (recipeSelector) {
  let station = recipeSelector.parentNode.parentNode.cells[0].children[0].value
  let recipes = getStationByName(station).recipes;
  document.getElementById("debug").innerHTML = recipes;
  for (let i=0; i < recipes.length; i++) {
    let opt = document.createElement("option");
    opt.text = recipes[i];
    recipeSelector.add(opt, null);
  }
}

// when the station is changed, repopulate the recipe dropdown
function repopulateRecipeSelector (evt) {
  let stationSelector = evt.currentTarget;
  let recipeSelector = stationSelector.parentNode.parentNode.cells[2].children[0]

  // clear dropdown
  while (recipeSelector.length > 0) {
    recipeSelector.remove(0);
  }

  // repopulate
  let recipes = getStationByName(stationSelector.value).recipes;
  for (let i=0; i < recipes.length; i++) {
    let opt = document.createElement("option");
    opt.text = recipes[i];
    recipeSelector.add(opt, null);
  }
}

// when station is changed, reset station quantity field
function clearStationQuantity (evt) {
  let stationSelector = evt.currentTarget;
  let stationQuantityInput = stationSelector.parentNode.parentNode.cells[1].children[0]
  stationQuantityInput.value = '';
}

// manually trigger recalculations
window.recalculate = function() {
}

// add a row(station) and its related cells
window.addRow = function() {
  let tbl = document.getElementById("table1");

  let row = tbl.insertRow(-1);

  // add station dropdown
  let stationCell = row.insertCell(-1);
  let stationSelector = document.createElement("select");
  stationSelector.setAttribute("class", "stationSelector");
  stationCell.appendChild(stationSelector);
  populateStationSelector(stationSelector);
  stationSelector.addEventListener("change", repopulateRecipeSelector, false);
  stationSelector.addEventListener("change", clearStationQuantity, false)

  // add station quantity
  let stationQuantityCell = row.insertCell(-1);
  let stationQuantityInput = document.createElement("input");
  stationQuantityCell.appendChild(stationQuantityInput);
  stationQuantityInput.setAttribute("type", "text");

  // add recipe
  let recipeCell = row.insertCell(-1);
  let recipeSelector = document.createElement("select");
  recipeSelector.setAttribute("class", "recipeAll");
  recipeCell.appendChild(recipeSelector);
  // trigger recipe population
  let event = new Event('change');
  stationSelector.dispatchEvent(event);

  // add input quantity

  // add input item type


}