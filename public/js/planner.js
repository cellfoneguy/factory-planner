
// fetch data
const res = await fetch("data.json");
const data = await res.json()

const STATIONS = data.stations;

// get cell child (or cell if no child) from same row by column name
function getChildInRowByName(obj, name) {
  // go up family tree until we get the row object
  let elem = obj;
  while (elem.nodeName != "TR") {
    elem = elem.parentNode;
  }

  switch(name) {
    case "Station":
      return elem.cells[0].children[0];
    case "Station Quantity":
      return elem.cells[1].children[0];
    case "Recipe":
      return elem.cells[2].children[0];
    case "Input Quantity":
      return elem.cells[3];
    case "Input Item":
      return elem.cells[4];
    case "Output Quantity":
      return elem.cells[5];
    case "Output Item":
      return elem.cells[6];
    default:
      throw new Error("getChildInRowByName(): name not found");
  }
}

// get station object by name
function getStationByName(name) {
  for (let i=0; i<STATIONS.length; i++) {
    if (STATIONS[i].name == name) {
      return STATIONS[i];
    }
  }
  throw new Error("getStationByName(): name not found");
}

// get recipe object by name
function getRecipeByName(station, name) {
  for (let i=0; i<station.recipes.length; i++) {
    if (station.recipes[i].name == name) {
      return station.recipes[i];
    }
  }
  throw new Error("getRecipeByName(): name not found");
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

// when the station is changed, clear station quantity, and repopulate the recipe dropdown and related fields
function stationChanged(evt) {
  let stationSelector = evt.currentTarget;
  let stationQuantityInput = getChildInRowByName(stationSelector, "Station Quantity");
  stationQuantityInput.value = '';

  let recipeSelector = getChildInRowByName(stationSelector, "Recipe");

  // clear dropdown
  while (recipeSelector.length > 0) {
    recipeSelector.remove(0);
  }

  // repopulate
  let recipes = getStationByName(stationSelector.value).recipes;
  for (let i=0; i < recipes.length; i++) {
    let opt = document.createElement("option");
    opt.text = recipes[i].name;
    recipeSelector.add(opt, null);
  }

  // now update recipe fields
  let event = new Event("change");
  recipeSelector.dispatchEvent(event);
}

// when station quantity or recipe is changed, repopulate inputs/outputs
function recalculateQuantities(evt) {
  // get field pointers
  let stationQuantityInput = getChildInRowByName(evt.currentTarget, "Station Quantity");
  let recipeSelector = getChildInRowByName(evt.currentTarget, "Recipe");
  let inputQuantityCell = getChildInRowByName(evt.currentTarget, "Input Quantity");
  let inputItemCell = getChildInRowByName(evt.currentTarget, "Input Item");
  let outputQuantityCell = getChildInRowByName(evt.currentTarget, "Output Quantity");
  let outputItemCell = getChildInRowByName(evt.currentTarget, "Output Item");

  // get recipe
  let stationName = getChildInRowByName(recipeSelector, "Station").value;
  let recipe = getRecipeByName(getStationByName(stationName), recipeSelector.value);
  
  // recalculate. gatherers are a bit special with input quantities
  inputItemCell.innerHTML = recipe.input;
  outputItemCell.innerHTML = recipe.output;
  if (stationName == "Mining Machine") {
    inputQuantityCell.innerHTML = stationQuantityInput.value;
  } else if (stationName == "Oil Extractor") {
    inputQuantityCell.innerHTML = '';
  } else {
    inputQuantityCell.innerHTML = 1.0 * recipe.inputQuantityBase * stationQuantityInput.value * 60 / recipe.cycleTime;
  }
  outputQuantityCell.innerHTML = 1.0 * recipe.outputQuantityBase * stationQuantityInput.value * 60 / recipe.cycleTime;
}

// add a row(station) and its related cells
window.addRow = function() {
  let tbl = document.getElementById("table1");

  let row = tbl.insertRow(-1);

  // add station dropdown
  let stationCell = row.insertCell(-1);
  let stationSelector = document.createElement("select");
  stationCell.appendChild(stationSelector);
  
  // add station quantity
  let stationQuantityCell = row.insertCell(-1);
  let stationQuantityInput = document.createElement("input");
  stationQuantityInput.setAttribute("type", "number");
  stationQuantityInput.setAttribute("min", "0");
  stationQuantityCell.appendChild(stationQuantityInput);

  // add recipe
  let recipeCell = row.insertCell(-1);
  let recipeSelector = document.createElement("select");
  recipeSelector.setAttribute("class", "recipeAll");
  recipeCell.appendChild(recipeSelector);

  // add input quantity
  let inputQuantityCell = row.insertCell(-1);

  // add input item type
  let inputItemCell = row.insertCell(-1);

  // add output quantity
  let outputQuantityCell = row.insertCell(-1);
  
  // add output item type
  let outputItemCell = row.insertCell(-1);

  /* POPULATE FIELDS */
  // station
  populateStationSelector(stationSelector);
  let station = getStationByName(stationSelector.value);
  stationSelector.addEventListener("change", stationChanged, false);

  // station quantity
  stationQuantityInput.addEventListener("change", recalculateQuantities, false);

  // manually trigger recipe and related fields population
  let event = new Event('change');
  stationSelector.dispatchEvent(event);

  recipeSelector.addEventListener("change", recalculateQuantities, false);
  event = new Event('change');
  recipeSelector.dispatchEvent(event);

}