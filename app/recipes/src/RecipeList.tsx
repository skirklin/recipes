import _ from 'lodash';
import { useContext, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { Recipe } from 'schema-dts';

import RecipeSummary from './RecipeSummary';
import RecipeCard from './RecipeCard';
import { RecipeBoxContext } from './constants';



function RecipeList() {
    const { recipes, activeRecipes, setActiveRecipes } = useContext(RecipeBoxContext);
    console.debug("Rendering recipes")

    function activeRecipeAdder(r: Recipe) {
        let newActiveRecipes = _.uniq([r, ...activeRecipes])
        return () => {
            setActiveRecipes(newActiveRecipes);
            setTabIndex(1);
        }
    }
    console.log("activeRecipes", activeRecipes)

    const [tabIndex, setTabIndex] = useState(0);
    return (
        <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
            <TabList>
                <Tab>Contents</Tab>
                {activeRecipes.map((r) => (<Tab>{r.name}</Tab>))}
            </TabList>
            <TabPanel>
                <ul>
                    {(recipes || []).map((r: Recipe, id) => {
                        return (
                            <li key={id} onClick={activeRecipeAdder(r)}><RecipeSummary recipe={r} /></li>
                        )
                    })}
                </ul>
            </TabPanel>
            {activeRecipes.map((r) => (<TabPanel><RecipeCard recipe={r} /></TabPanel>))}
        </Tabs>
    );
}

export default RecipeList;
