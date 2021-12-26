import _ from 'lodash';
import { RecipePointer, SearchResultType } from '../../types';
import RecipeSummary from '../RecipeSummary';
import { TabType } from '../types';


interface SearchResultProps {
    recipePtrs: RecipePointer[]
    queryString: string
}

export function getSearchResultKey(content: SearchResultType) {
    return content.queryString
}

export function SearchResultTabName(props: SearchResultProps) {
    return <div>
        {`${props.queryString}: ${props.recipePtrs.length} matches`}
    </div>
}

export function isSearchResultTab(content: TabType) {
    return _.isEqual(new Set(_.keys(content)), new Set(["queryString", "recipePtrs"]))
}

export function SearchResultTab(props: SearchResultProps) {
    const { queryString, recipePtrs } = props;
    let summaries = recipePtrs.map((ptr) => <RecipeSummary recipePointer={ptr} />)
    return (
        <div>
            <p>Search results for: {queryString}</p>
            <ol>
                {summaries}
            </ol>
        </div>
    )
}