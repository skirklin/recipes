import _ from 'lodash';
import { useContext, useState } from 'react';
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { Context } from '../../context';
import { AllType } from '../../types';
import { Recipe } from 'schema-dts';
import './Contents.css'
import { Key } from 'antd/lib/table/interface';
import { TableRowSelection } from 'antd/es/table/interface';
import { getRecipeTabKey } from './RecipeTab';
import { DeleteOutlined, ForkOutlined } from '@ant-design/icons';
import { deleteDoc, doc } from 'firebase/firestore';
import { getKey } from './Tab';
import { db } from '../../App';

export function isContentsTab(content: AllType) {
  return _.isEqual(content, {})
}

export function getContentsTabKey(content: AllType) {
  return "Contents"
}

export function ContentsTabName() {
  return <div>Contents</div>
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
  key: string
}


export function ContentsTab() {
  /// https://ant.design/components/table/#components-table-demo-row-selection-and-operation
  const { state, dispatch } = useContext(Context)
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [selectedRows, setSelectedRows] = useState<RowType[]>([])
  let data: RowType[] = []
  for (let [boxId, box] of state.boxes.entries()) {
    for (let [recipeId, recipe] of box.recipes.entries()) {
      data.push({ boxName: box.name, recipeId, boxId, recipe, key: getRecipeTabKey({ recipeId, boxId, recipe }) })
    }
  }

  const onSelectChange = (selectedRowKeys: Key[], selectedRows: RowType[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection: TableRowSelection<RowType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const goToRecipe = (record: RowType, rowIndex: number | undefined) => {
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

  const hasSelected = selectedRowKeys.length > 0;

  async function del() {
    selectedRows.forEach(
      (value: RowType) => {
        dispatch({ type: "REMOVE_TAB", payload: getKey({ recipeId: value.recipeId, boxId: value.boxId }) })
        deleteDoc(doc(db, "boxes", value.boxId, "recipes", value.recipeId))
      }
    )
  }

  return (
    <>
      <div style={{float: 'right', display: 'inline-flex', padding: '5px'}}>
        <Button onClick={() => del()} disabled={!hasSelected}><DeleteOutlined /></Button>
        <Button onClick={() => { console.log("fork", selectedRowKeys) }} disabled={!hasSelected}><ForkOutlined /></Button>
      </div>
      <Table<RowType> rowSelection={rowSelection} columns={columns} dataSource={data} onRow={onRow} rowClassName={() => "recipe-row"} />
    </>
  )
}
