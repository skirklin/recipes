import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/v1/https";
import { Recipe, WithContext } from "schema-dts";
import axios from 'axios';
import * as jsdom from 'jsdom';

type RecipeWithContext = WithContext<Recipe>

export function getRecipesFromPage(doc: Document, url: string): Recipe[] {
  const recipes: Recipe[] = [];
  // Pull ld+json metadata from the page and look for a recipe
  const schemas = doc.querySelectorAll('script[type="application/ld+json"]');
  if (schemas === null) {
    return recipes
  }

  function isGraph(elt: Record<string, unknown>) {
    if (Object.prototype.hasOwnProperty.call(elt, "@graph")) {
      /* the "graph" style ld+json puts objects at the root level, but 
      cross-object references may be represented by simply referencing their ids.
      */
      return true
    }
    return false
  }

  function isRecipe(elt: RecipeWithContext) {
    if (!(Object.prototype.hasOwnProperty.call(elt,"@context") && Object.prototype.hasOwnProperty.call(elt,"@type"))) {
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

    if (schema.textContent === null) {
      continue
    }

    let ldjson = JSON.parse(schema.textContent);
    if (isGraph(ldjson)) {
      ldjson = ldjson["@graph"];
    }
    if (Array.isArray(ldjson)) {
      ldjson.forEach(
        (element: RecipeWithContext) => {
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

export const getRecipes = functions.https.onCall(async (data) => {
  const url = data.url;
  if (url === undefined) {
    return new HttpsError("internal", "must specify url")
  }
  const tpc = await axios.get(data.url)
  const htmlDom = new jsdom.JSDOM(tpc.data);
  const recipes = getRecipesFromPage(htmlDom.window.document, url)
  return { recipes: JSON.stringify(recipes) }
})