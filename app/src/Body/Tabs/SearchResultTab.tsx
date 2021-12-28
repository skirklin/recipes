import _ from 'lodash';
import { RecipePointer, SearchResultTabType, TabType  } from '../../types';
import RecipeSummary from '../RecipeSummary';

interface SearchResultProps {
    recipePtrs: RecipePointer[]
    queryString: string
}

export function getSearchResultKey(content: SearchResultTabType) {
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
    let summaries = recipePtrs.map((ptr) => <RecipeSummary {...ptr} />)
    return (
        <div>
            <p>Search results for: {queryString}</p>
            <ol>
                {summaries}
            </ol>
        </div>
    )
}