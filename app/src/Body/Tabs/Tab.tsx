import { isContentsTab, ContentsTab, getContentsTabKey, ContentsTabName } from "./Contents";
import { isSearchResultTab, SearchResultTab, getSearchResultKey, SearchResultTabName } from "./SearchResultTab";
import { isRecipeTab, RecipeTab, getRecipeTabKey, RecipeTabName } from "./RecipeTab";
import { isRecipeBoxTab, RecipeBoxTab, getRecipeBoxTabKey, RecipeBoxTabName } from "./RecipeBoxTab";
import { BoxPointer, RecipeTabType, SearchResultTabType, TabType } from '../../types';

/*
TODO: deduplicate the switch statements? The different tab contents take different props, and TypeScript
seems to make it difficult to blindly pass along props via the spread operator. Realistically
I think this is just _my_ problem, given what libraries do, but not motivated to dig into that just now.
*/

interface TabPropsType {
    content: TabType
}

export function getTabName(content: TabType) {
    switch (true) {
        case isContentsTab(content): {
            return <ContentsTabName />
        }
        case isSearchResultTab(content): {
            let searchResult = content as SearchResultTabType;
            return <SearchResultTabName queryString={searchResult.queryString} recipePtrs={searchResult.recipePtrs} />
        }
        case isRecipeBoxTab(content): {
            let boxPtr = content as BoxPointer;
            return <RecipeBoxTabName boxPtr={boxPtr} />

        }
        case isRecipeTab(content):
            let rt = content as RecipeTabType
            return <RecipeTabName recipeId={rt.recipeId} boxId={rt.boxId} recipe={rt.recipe} />
        default:
            console.log("unreconized tab type:", content)
    }
}

export function getKey(content: TabType) {
    switch (true) {
        case isContentsTab(content): return getContentsTabKey(content)
        case isSearchResultTab(content): return getSearchResultKey(content as SearchResultTabType)
        case isRecipeBoxTab(content): return getRecipeBoxTabKey(content as BoxPointer)
        case isRecipeTab(content): return getRecipeTabKey(content as RecipeTabType)
        default:
            console.log("unreconized tab type:", content)
    }
}

export function Tab(props: TabPropsType) {
    const { content } = props;
    switch (true) {
        case isContentsTab(content):
            return <ContentsTab />
        case isSearchResultTab(content):
            let searchResult = content as SearchResultTabType;
            return <SearchResultTab queryString={searchResult.queryString} recipePtrs={searchResult.recipePtrs} />;
        case isRecipeBoxTab(content):
            let boxPtr = content as BoxPointer;
            return <RecipeBoxTab boxPtr={boxPtr} />
        case isRecipeTab(content):
            let rt = content as RecipeTabType
            return <RecipeTab recipeId={rt.recipeId} boxId={rt.boxId} recipe={rt.recipe} />
        default:
            alert("Unrecognized tab type.")
            return null
    }
}