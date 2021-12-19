let page = document.getElementById("recipeBoxForm");


/*
Nothing to do right now actually. In principle might:
  keep track of the root directory of where recipes are saved
  maybe embed the recipe viewer?
*/
function constructOptions() {
  // let br = document.getElementById("recipeBoxRoot");
  // chrome.storage.sync.get("recipeBoxRoot", (result) => {br.text = result || ""})
}

// Pull configuration details from storage before rendering the options page
page.onload = constructOptions();