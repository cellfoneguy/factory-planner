
// globals
// stations
STATIONS = [
  "Miner",
  "Smelter",
  "Oil Refinery",
]

// recipes
RECIPES = {};
RECIPES["Miner"] = [
  "Iron Ore",
  "Copper Ore",
  "Coal",
];
RECIPES["Smelter"] = [
  "Iron Ingot",
  "Copper Ingot",
  "Energetic Graphene",
];
RECIPES["Oil Refinery"] = [
  "Plasma Refining",
]

// populate the station selector dropdown
function populateStationSelector(stationSelector) {
  for (let i=0; i < STATIONS.length; i++) {
    let opt = document.createElement("option");
    opt.text = STATIONS[i];
    stationSelector.add(opt, null);
  }
}

// populate the recipe selector dropdown
function populateRecipeSelector (recipeSelector) {
  let station = recipeSelector.parentNode.parentNode.cells[0].children[0].value
  let recipes = RECIPES[station];
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
  let recipes = RECIPES[stationSelector.value];
  for (let i=0; i < recipes.length; i++) {
    let opt = document.createElement("option");
    opt.text = recipes[i];
    recipeSelector.add(opt, null);
  }
}

function recalculate() {
}

function addRow() {
  let tbl = document.getElementById("table1");

  let row = tbl.insertRow(-1);

  // add station dropdown
  let stationCell = row.insertCell(-1);
  let stationSelector = document.createElement("select");
  stationSelector.setAttribute("class", "stationSelector");
  stationCell.appendChild(stationSelector);
  populateStationSelector(stationSelector);
  stationSelector.addEventListener("change", repopulateRecipeSelector, false);

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
  populateRecipeSelector(recipeSelector);
  recipeCell.appendChild(recipeSelector);
}