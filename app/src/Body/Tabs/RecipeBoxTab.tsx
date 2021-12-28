import _ from 'lodash';
import { useContext } from 'react';
import { Context } from '../../context';
import { BoxPointer, TabType } from '../../types';
import RecipeSummary from '../RecipeSummary';

interface RecipeBoxTabProps {
    boxPtr: BoxPointer
}

export function isRecipeBoxTab(content: TabType) {
  return _.isEqual(new Set(_.keys(content)), new Set(["boxId"]))
}

export function getRecipeBoxTabKey(content: BoxPointer) {
    return `RecipeBoxTab: ${content.boxId}`
}

export function RecipeBoxTabName(props: RecipeBoxTabProps) {
    const { state } = useContext(Context);
    return <div>{state.boxes.get(props.boxPtr.boxId)!.name}</div>
}

export function RecipeBoxTab(props: RecipeBoxTabProps) {
    const { state } = useContext(Context);
    const { boxPtr } = props;
    let box = state.boxes.get(boxPtr.boxId);
    if (box === undefined) {
        return <div>Unknown recipe box ID: {boxPtr.boxId}</div>
    }

    let summaries: JSX.Element[] = [];
    console.log(summaries)
    box.recipes.forEach(
        (value, key) => summaries.push(<RecipeSummary { ...boxPtr} recipeId={key} />)
    )
    return (
        <ol>
            {summaries}
        </ol>
    )
}