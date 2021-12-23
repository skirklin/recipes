/* TODO:
    add content script to enable/disable the download button if a recipe is found.
      OR 
    add action into omnibar if recipe is found
*/

function getPageRecipe() {
  var textFile = null;
  makeTextFile = function (text) {
    var data = new Blob([text], { type: 'application/ld+json' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return textFile;
  };

  // Pull ld+json metadata from the page and look for a recipe
  let schemas = document.querySelectorAll('script[type="application/ld+json"]');
  if (schemas === null) {
    return
  }

  function isGraph(elt) {
    if (elt.hasOwnProperty("@graph")) {
      /* the "graph" style ld+json puts objects at the root level, but 
      cross-object references may be represented by simply referencing their ids.
      */
      return true
    }
    return false
  }

  function isRecipe(elt) {
    if (!(elt.hasOwnProperty("@context") && elt.hasOwnProperty("@type"))) {
      console.log("no type or context");
      return false;
    }
    if (elt["@context"].toString().match(/recipe.org/) || (elt["@type"] !== "Recipe" && elt["@type"][0] !== "Recipe")) {
      console.log("wrong type or context");
      return false;
    }
    console.log("found recipe")
    return true
  }

  let recipe;

  for (let index = 0; index < schemas.length; index++) {
    const schema = schemas[index];

    let ldjson = JSON.parse(schema.innerText);
    console.log("json", ldjson);
    if (isGraph(ldjson)) {
      ldjson = ldjson["@graph"];
    }
    if (Array.isArray(ldjson)) {
      ldjson.forEach(
        element => {
          if (isRecipe(element)) {
            recipe = element
          }
        }
      )
    } else if (isRecipe(ldjson)) {
      recipe = ldjson;
    }
  }

  if (recipe === undefined) {
    alert("Failed to identify a recipe in page metadata")
    return
  }

  console.debug("found a recipe", recipe)
  recipe.url = document.URL;

  // Create a download link
  var downloadLink = document.createElement("a");
  downloadLink.download = recipe.name + ".json"
  downloadLink.innerHTML = "Download File";

  // Create a "file" to download
  downloadLink.href = makeTextFile(JSON.stringify(recipe, null, 2))
  document.body.appendChild(downloadLink);

  // wait for the link to be added to the document
  window.requestAnimationFrame(function () {
    var event = new MouseEvent('click');
    downloadLink.dispatchEvent(event); // synthetically click on it
    document.body.removeChild(downloadLink);
  });
}


// When the button is clicked, try to scrape a recipe from the page
scrapeRecipe.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getPageRecipe,
  });
});
