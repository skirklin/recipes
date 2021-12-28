import _ from 'lodash';
import { RecipePointer, SearchResultTabType, TabType  } from '../../types';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

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

const columns = [

]

export function SearchResultTab(props: SearchResultProps) {
    const { queryString, recipePtrs } = props;
    let summaries = recipePtrs.map((ptr) => <RecipeSummary {...ptr} />)
    return (
        <Table columns={[]} dataSource={[]}/>
    )
}