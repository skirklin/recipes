// background.js

const recipes = {}

// NB: Is there actually persistent storage for the extension between chrome sessions?
let existingRecipes = chrome.storage.local.get("recipes");
if (existingRecipes !== undefined) {
  Object.entries(existingRecipes).forEach((key, value) => {
    recipes[key] = value
  });
} 


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ recipes });
  console.log('Initializing recipes db');
});
