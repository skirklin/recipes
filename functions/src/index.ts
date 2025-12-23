import { onCall, HttpsError } from "firebase-functions/v2/https";
import { Recipe, WithContext } from "schema-dts";
import axios from 'axios';
import * as jsdom from 'jsdom';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import Anthropic from '@anthropic-ai/sdk';
import { defineSecret } from "firebase-functions/params";
// Polyfill fetch globals for Anthropic SDK
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const nodeFetch = require('node-fetch');
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const FormData = require('form-data');
if (!globalThis.fetch) {
  globalThis.fetch = nodeFetch;
  globalThis.Headers = nodeFetch.Headers;
  globalThis.Request = nodeFetch.Request;
  globalThis.Response = nodeFetch.Response;
}
if (!globalThis.FormData) {
  globalThis.FormData = FormData;
}

const app = initializeApp();
const db = getFirestore(app);

// Define the secret
const anthropicApiKey = defineSecret("ANTHROPIC_API_KEY");

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
    if (!(Object.prototype.hasOwnProperty.call(elt, "@context") && Object.prototype.hasOwnProperty.call(elt, "@type"))) {
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

export const getRecipes = onCall(async (request) => {
  const url = request.data.url;
  if (url === undefined) {
    throw new HttpsError("internal", "must specify url")
  }
  const tpc = await axios.get(request.data.url)
  const htmlDom = new jsdom.JSDOM(tpc.data);
  const recipes = getRecipesFromPage(htmlDom.window.document, url)
  return { recipes: JSON.stringify(recipes) }
})

async function updateOwners(docRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>, newOwnerEmail: string) {
  const auth = getAuth()
  auth.getUserByEmail(newOwnerEmail)
    .then((user) => {
      docRef.update({ owners: FieldValue.arrayUnion(user.uid) })
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") {

        auth.createUser({
          email: newOwnerEmail,
        })
          .then((user) => {
            docRef.update({ owners: FieldValue.arrayUnion(user.uid) })
          })
          .catch((error) => {
            throw new HttpsError("internal", "Unable to find or create user for provided email address.", error)
          })
      } else {
        throw new HttpsError("internal", "Unable to find account for provided email address.", error)
      }
    })
}

export const addRecipeOwner = onCall(async (request) => {
  const { recipeId, boxId, newOwnerEmail } = request.data;
  const docRef = db.doc(`boxes/${boxId}/recipes/${recipeId}`)
  const recipe = (await docRef.get()).data()
  if (recipe === undefined) {
    throw new HttpsError("internal", "Specified recipe does not exist")
  }
  updateOwners(docRef, newOwnerEmail)
})


export const addBoxOwner = onCall(async (request) => {
  const { boxId, newOwnerEmail } = request.data;
  const docRef = db.doc(`boxes/${boxId}`)
  const box = (await docRef.get()).data()
  if (box === undefined) {
    throw new HttpsError("internal", "Specified box does not exist")
  }

  updateOwners(docRef, newOwnerEmail)
})

// Generate a recipe using Claude
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-opus-4-5-20251101";

export const generateRecipe = onCall(
  { secrets: [anthropicApiKey] },
  async (request) => {
    // Require authentication
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in to generate recipes")
    }

    const { prompt } = request.data;
    if (!prompt || typeof prompt !== "string") {
      throw new HttpsError("invalid-argument", "Must provide a prompt")
    }

    const apiKey = anthropicApiKey.value();
    if (!apiKey) {
      throw new HttpsError("internal", "API key not configured")
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are a helpful cooking assistant that generates recipes. When given a description of what the user wants, create a complete recipe.

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "@type": "Recipe",
  "name": "Recipe Name",
  "description": "A brief, appetizing description of the dish",
  "recipeIngredient": ["ingredient 1", "ingredient 2", ...],
  "recipeInstructions": [
    {"@type": "HowToStep", "text": "Step 1 instructions"},
    {"@type": "HowToStep", "text": "Step 2 instructions"},
    ...
  ],
  "recipeCategory": ["category1", "category2"],
  "recipeYield": "4 servings",
  "prepTime": "PT15M",
  "cookTime": "PT30M"
}

Guidelines:
- Use clear, concise ingredient measurements
- Write instructions as complete sentences
- Include relevant categories (cuisine type, meal type, dietary info)
- Be creative but practical`;

    try {
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        messages: [
          { role: "user", content: `Create a recipe for: ${prompt}` }
        ],
        system: systemPrompt,
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";

      // Parse the JSON response
      let recipe: Recipe;
      try {
        // Handle potential markdown code blocks
        let jsonStr = text.trim();
        if (jsonStr.startsWith("```")) {
          jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }
        recipe = JSON.parse(jsonStr);

        // Ensure tags are lowercase
        if (recipe.recipeCategory && Array.isArray(recipe.recipeCategory)) {
          recipe.recipeCategory = recipe.recipeCategory.map((t: string) => t.toLowerCase());
        }
      } catch {
        throw new HttpsError("internal", "Failed to parse recipe from AI response")
      }

      // Return as JSON string to avoid Firebase SDK decode issues with nested objects
      return { recipeJson: JSON.stringify(recipe) };
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      console.error("Error generating recipe:", error);
      throw new HttpsError("internal", "Failed to generate recipe")
    }
  }
)
