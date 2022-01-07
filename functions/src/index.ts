import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";
import { Recipe } from "schema-dts";


export function getRecipesFromPage(doc: Document, url: string): Recipe[] {
  let recipes: Recipe[] = [];
  // Pull ld+json metadata from the page and look for a recipe
  let schemas = doc.querySelectorAll('script[type="application/ld+json"]');
  if (schemas === null) {
    return recipes
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
      console.debug("no type or context");
      return false;
    }
    if (elt["@context"].toString().match(/recipe.org/) || (elt["@type"] !== "Recipe" && elt["@type"][0] !== "Recipe")) {
      console.debug("wrong type or context");
      return false;
    }
    console.debug("found recipe")
    return true
  }

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
            element.url = url
            recipes.push(element)
          }
        }
      )
    } else if (isRecipe(ldjson)) {
      ldjson.url = url // maybe get rid of this
      recipes.push(ldjson);
    }
  }

  return recipes

}

export const getRecipes = functions.https.onCall(async (data, context) => {
  const axios = require("axios")
  let url = data.url;
  if (url === undefined) {
    return new HttpsError("internal", "must specify url")
  }
  let tpc = await axios.get(data.url)
  const jsdom = require("jsdom")
  var htmlDom = new jsdom.JSDOM(tpc.data);
  let recipes = getRecipesFromPage(htmlDom.window.document, url)
  return { recipes: JSON.stringify(recipes) }
})