import { useContext } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { Recipe } from 'schema-dts';

import RecipeSummary from './RecipeSummary';
import RecipeCard from './RecipeCard/RecipeCard';
import { RecipeBoxContext } from './context';
import styled from 'styled-components';

const RecipeItem = styled.li`
  list-style-type: none;
  cursor: pointer; 
`

function RecipeTable() {
    const { state, dispatch } = useContext(RecipeBoxContext);
    const { activeRecipes, recipes, activeTab, searchResult } = state;

    console.debug("Rendering recipes")

    function activeRecipeAdder(r: Recipe) {
        return () => {
            dispatch({ type: 'ADD_ACTIVE_RECIPE', recipe: r })
        }
    }

    function tabRemover(r: Recipe) {
        return () => {
            dispatch({ type: 'REMOVE_ACTIVE_RECIPE', recipe: r })

        }
    }

    function handleSelect(index: number, lastIndex: number, event: Event) {
        /* @ts-expect-error */
        if (event.target.id !== "tabRemover") {
            dispatch({ type: 'SET_ACTIVE_TAB', activeTab: index })
        }
        return false
    }
    return (
        <Tabs selectedIndex={activeTab} onSelect={handleSelect}>
            <TabList>
                <Tab>Contents</Tab>
                {activeRecipes.map((r, id) => (<Tab key={id}>{r.name} <button id="tabRemover" onClick={tabRemover(r)}>x</button> </Tab>))}
            </TabList>
            <TabPanel>
                <ul>
                    {(searchResult || recipes || []).map((r: Recipe, id) => {
                        return (
                            <RecipeItem key={id} onClick={activeRecipeAdder(r)}><RecipeSummary recipe={r} /></RecipeItem>
                        )
                    })}
                </ul>
            </TabPanel>
            {activeRecipes.map((r, id) => (<TabPanel key={id}><RecipeCard recipe={r} /></TabPanel>))}
        </Tabs>
    );
}

export default RecipeTable;
