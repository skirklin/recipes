import { TabType } from "../types"
import { isAllRecipesTab, AllRecipesTab, getAllRecipesTabKey, AllRecipesTabName } from "./AllRecipesTab";
import { isSearchResultTab, SearchResultTab, getSearchResultKey, SearchResultTabName } from "./SearchResultTab";
import { isRecipeTab, RecipeTab, getRecipeTabKey, RecipeTabName } from "./RecipeTab";
import { isRecipeBoxTab, RecipeBoxTab, getRecipeBoxTabKey, RecipeBoxTabName } from "./RecipeBoxTab";
import { BoxPointer, RecipePointer, SearchResultType } from '../../types';

/*
TODO: deduplicate this? The different tab contents take different props, and TypeScript
seems to make it difficult to blindly pass along props via the spread operator. Realistically
I think this is just _my_ problem, given what libraries do, but not motivated to dig into that just now.
*/

interface TabPropsType {
    content: TabType
}

export function getTabName(content: TabType) {
    switch (true) {
        case isAllRecipesTab(content): {
            return <AllRecipesTabName />
        }
        case isSearchResultTab(content): {
            let searchResult = content as SearchResultType;
            return <SearchResultTabName queryString={searchResult.queryString} recipePtrs={searchResult.recipePtrs} />
        }
        case isRecipeBoxTab(content): {
            let boxPtr = content as BoxPointer;
            return <RecipeBoxTabName boxPtr={boxPtr} />

        }
        case isRecipeTab(content):
            let recipePtr = content as RecipePointer
            return <RecipeTabName recipePtr={recipePtr} />
        default:
            alert("Unrecognized tab type.")
    }
}

export function getKey(content: TabType) {
    switch (true) {
        case isAllRecipesTab(content): return getAllRecipesTabKey(content)
        case isSearchResultTab(content): return getSearchResultKey(content as SearchResultType)
        case isRecipeBoxTab(content): return getRecipeBoxTabKey(content as BoxPointer)
        case isRecipeTab(content): return getRecipeTabKey(content as RecipePointer)
        default:
            alert("Unrecognized tab type.")
    }
}

export function Tab(props: TabPropsType) {
    const { content } = props;
    switch (true) {
        case isAllRecipesTab(content):
            return <AllRecipesTab />
        case isSearchResultTab(content):
            let searchResult = content as SearchResultType;
            return <SearchResultTab queryString={searchResult.queryString} recipePtrs={searchResult.recipePtrs} />;
        case isRecipeBoxTab(content):
            let boxPtr = content as BoxPointer;
            return <RecipeBoxTab boxPtr={boxPtr} />
        case isRecipeTab(content):
            let recipePtr = content as RecipePointer
            return <RecipeTab recipePtr={recipePtr} />
        default:
            alert("Unrecognized tab type.")
            return null
    }
}