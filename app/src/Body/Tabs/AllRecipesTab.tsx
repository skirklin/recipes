import _ from 'lodash';
import { useContext } from 'react';
import { RecipeBoxContext } from '../../context';
import { AllType, RecipePointer } from '../../types';
import RecipeSummary from '../RecipeSummary';
import { getRecipeTabKey } from './RecipeTab';

export function isAllRecipesTab(content: AllType) {
    return _.isEqual(content, {})
}

export function getAllRecipesTabKey(content: AllType) {
    return "AllRecipes"
}

export function AllRecipesTabName() {
    return <div>All Recipes</div>
}

export function AllRecipesTab() {
    const { state } = useContext(RecipeBoxContext)
    let recipePtrs: RecipePointer[] = []
    for (let [boxId, box] of state.boxes.entries()) {
        for (let recipeId of box.recipes.keys()) {
            recipePtrs.push({ boxId, recipeId })
        }
    }
    let summaries = recipePtrs.map(ptr => <RecipeSummary key={getRecipeTabKey(ptr)} recipePointer={ptr} />)

    return (
        <ol>
            {summaries}
        </ol>
    )
}
