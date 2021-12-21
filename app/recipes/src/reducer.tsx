import _ from 'lodash'
import { StateType, ActionType } from './types'

export function recipeBoxReducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case 'ADD_RECIPE': {
            return { ...state, recipes: _.uniq([...state['recipes'], action.recipe!]) }
        }
        case 'REMOVE_RECIPE':
            return { ...state, recipes: _.filter(state['recipes'], x => !Object.is(x, action.recipe)) }
        case 'ADD_ACTIVE_RECIPE':
            let activeRecipes = _.uniq([...state['activeRecipes'], action.recipe!])
            let activeTab = _.indexOf(activeRecipes, action.recipe) + 1 // offset due to contents tab
            return { ...state, activeRecipes, activeTab }
        case 'REMOVE_ACTIVE_RECIPE': {
            let { activeTab } = state;
            let recipeTab = _.indexOf(state['activeRecipes'], action.recipe) + 1 // offset due to contents tab
            if (recipeTab <= activeTab) {
                activeTab -= 1;
            }
            return {
                ...state,
                activeTab,
                activeRecipes: _.filter(state['activeRecipes'], x => !Object.is(x, action.recipe)),
            }
        }
        case 'SET_SEARCH_RESULT':
            return { ...state, searchResult: action.searchResult }
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.activeTab! }
    }
    return { ...state }
}