import _ from 'lodash';
import { useContext } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { Context } from '../../context';
import { AllType } from '../../types';
import { Recipe } from 'schema-dts';
import './AllRecipesTab.css'

export function isAllRecipesTab(content: AllType) {
    return _.isEqual(content, {})
}

export function getAllRecipesTabKey(content: AllType) {
    return "AllRecipes"
}

export function AllRecipesTabName() {
    return <div>All Recipes</div>
}

function sortfunc(a: string, b: string) {
    var A = a.toUpperCase(); // ignore upper and lowercase
    var B = b.toUpperCase(); // ignore upper and lowercase
    if (A < B) {
        return -1;
    }
    if (A > B) {
        return 1;
    }

    return 0;
}

interface RowType {
    boxName: string
    recipe: Recipe
    boxId: string
    recipeId: string
}


export function AllRecipesTab() {
    /// https://ant.design/components/table/#components-table-demo-row-selection-and-operation
    const { state, dispatch } = useContext(Context)
    let data: RowType[] = []
    for (let [boxId, box] of state.boxes.entries()) {
        for (let [recipeId, recipe] of box.recipes.entries()) {
            data.push({ boxName: box.name, recipeId, boxId, recipe })
        }
    }


    const goToRecipe = (record: RowType, rowIndex: number|undefined) => {
        dispatch({ type: "APPEND_TAB", payload: { boxId: record.boxId, recipeId: record.recipeId, recipe: record.recipe } })
    }

    const onRow = (record: RowType, rowIndex: number | undefined) => {
        return {
            onClick: (e: any) => goToRecipe(record, rowIndex),
        }
    }



    const columns: ColumnsType<RowType> = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: ['recipe', 'name'],
            sorter: (a: RowType, b: RowType) => sortfunc(a.recipe.name!.toString(), b.recipe.name!.toString()),
        },
        {
            key: 'description',
            title: 'Description',
            dataIndex: ['recipe', 'description'],
        },
        {
            key: 'box',
            title: 'Box',
            dataIndex: ['boxName'],
        },
    ];

    return <Table<RowType> columns={columns} dataSource={data} onRow={onRow} rowClassName={() => "all-recipes-row"}/>
}
