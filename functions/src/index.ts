import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


export function getPageRecipe(doc: Document) {
  // Pull ld+json metadata from the page and look for a recipe
  let schemas = doc.querySelectorAll('script[type="application/ld+json"]');
  if (schemas === null) {
    return
  }

  function isGraph(elt: Object) {
    if (elt.hasOwnProperty("@graph")) {
      /* the "graph" style ld+json puts objects at the root level, but 
      cross-object references may be represented by simply referencing their ids.
      */
      return true
    }
    return false
  }

  function isRecipe(elt: any) {
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

    let ldjson = JSON.parse(schema.textContent!);
    if (isGraph(ldjson)) {
      ldjson = ldjson["@graph"];
    }
    if (Array.isArray(ldjson)) {
      ldjson.forEach(
        (element: any) => {
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

  return recipe

}

export const getRecipes = functions.https.onCall(async (data, context) => {
  const axios = require("axios")
  console.log(data)
  let tpc = await axios.get(data.url)
  const jsdom = require("jsdom")
  var htmlDom = new jsdom.JSDOM(tpc.data);
  let recipe = getPageRecipe(htmlDom.window.document)
  recipe.url = data.url
  console.log(recipe)
  return {recipe: JSON.stringify(recipe)}
})