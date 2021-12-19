

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
  let schema = document.querySelector('script[type="application/ld+json"]');
  if (schema === null) {
    return
  }
  let ldjson = JSON.parse(schema.innerText);
  var recipe;
  if (Array.isArray(ldjson)) {
    ldjson.forEach(
      element => {
        if (element["@type"] === "Recipe" || element["@type"][0] === "Recipe") {
          recipe = element
        }
      }
    )
  } else if (ldjson["@type"] === "Recipe" || ldjson["@type"][0] === "Recipe") {
    recipe = ldjson;
  } else {
    alert("Failed to identify a recipe in page metadata")
    return
  }

  console.log("found a recipe", recipe)
  
  // Create a download link
  var downloadLink = document.createElement("a");
  downloadLink.download = recipe.name + ".json"
  downloadLink.innerHTML = "Download File";

  // Create a "file" to download
  downloadLink.href = makeTextFile(JSON.stringify(ldjson))
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