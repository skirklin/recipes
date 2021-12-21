import { useContext, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { Recipe } from 'schema-dts';

import RecipeSummary from './RecipeSummary';
import RecipeCard from './RecipeCard';
import { RecipeBoxContext } from './constants';
import styled from 'styled-components';

const RecipeItem = styled.li`
  list-style-type: none;
  cursor: pointer; 
`

function RecipeList() {
    const { state, dispatch } = useContext(RecipeBoxContext);
    const { activeRecipes, recipes } = state;

    const [tabIndex, setTabIndex] = useState(0);
    console.debug("Rendering recipes")

    function activeRecipeAdder(r: Recipe) {
        return () => {
            dispatch({ type: 'ADD_ACTIVE_RECIPE', recipe: r })
        }
    }
    console.log("activeRecipes", activeRecipes)

    function tabRemover(r: Recipe) {
        return () => {
            dispatch({ type: 'REMOVE_ACTIVE_RECIPE', recipe: r })

        }
    }

    function handleSelect(index: number, lastIndex: number, event: Event) {
        /* @ts-expect-error */
        if (event.target.id !== "tabRemover") {
            setTabIndex(index)
        }
        return false
    }
    return (
        <Tabs selectedIndex={tabIndex} onSelect={handleSelect}>
            <TabList>
                <Tab>Contents</Tab>
                {activeRecipes.map((r) => (<Tab>{r.name} <button id="tabRemover" onClick={tabRemover(r)}>x</button> </Tab>))}
            </TabList>
            <TabPanel>
                <ul>
                    {(recipes || []).map((r: Recipe, id) => {
                        return (
                            <RecipeItem key={id} onClick={activeRecipeAdder(r)}><RecipeSummary recipe={r} /></RecipeItem>
                        )
                    })}
                </ul>
            </TabPanel>
            {activeRecipes.map((r) => (<TabPanel><RecipeCard recipe={r} /></TabPanel>))}
        </Tabs>
    );
}

export default RecipeList;
