import _ from 'lodash';
import { useContext } from 'react';
import { RecipeBoxContext } from '../../context';
import { BoxPointer } from '../../types';
import RecipeSummary from '../RecipeSummary';
import { TabType } from '../types';

interface RecipeBoxTabProps {
    boxPtr: BoxPointer
}

export function isRecipeBoxTab(content: TabType) {
    return false
}

export function getRecipeBoxTabKey(content: BoxPointer) {
    return `RecipeBoxTab: ${content.boxId}`
}

export function RecipeBoxTabName(props: RecipeBoxTabProps) {
    const { state } = useContext(RecipeBoxContext);
    return <div>{state.boxes.get(props.boxPtr.boxId)!.name}</div>
}

export function RecipeBoxTab(props: RecipeBoxTabProps) {
    const { state } = useContext(RecipeBoxContext);
    const { boxPtr } = props;
    let recipeSummaries = _.map(
        state.boxes.get(boxPtr.boxId)?.recipes,
        (value, key) => <RecipeSummary recipePointer={{ ...boxPtr, recipeId: key }} />
    )
    return (
        <ol>
            {recipeSummaries}
        </ol>
    )
}