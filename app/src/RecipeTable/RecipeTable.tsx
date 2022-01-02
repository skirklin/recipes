import { useEffect, useState } from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { Recipe } from 'schema-dts';
import { Key } from 'antd/lib/table/interface';
import { TableRowSelection } from 'antd/es/table/interface';
import { DeleteOutlined, ForkOutlined } from '@ant-design/icons';
import { deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../backend';
import Filterbox from './Filterbox';
import './RecipeTable.css'

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

export interface RowType {
  boxName: string
  recipe: Recipe
  boxId: string
  recipeId: string
  key: string
}

interface RecipeTableProps {
  recipes: RowType[]
  writeable: boolean
}

export function RecipeTable(props: RecipeTableProps) {
  /// https://ant.design/components/table/#components-table-demo-row-selection-and-operation
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [selectedRows, setSelectedRows] = useState<RowType[]>([])
  let navigate = useNavigate();

  const { writeable, recipes } = props;
  const [filteredRows, setFilteredRows] = useState<RowType[]>([])

  useEffect(() => setFilteredRows(recipes), [recipes])

  const onSelectChange = (selectedRowKeys: Key[], selectedRows: RowType[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection: TableRowSelection<RowType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onRow = (record: RowType, rowIndex: number | undefined) => {
    return {
      onClick: () => navigate(`/boxes/${record.boxId}/recipes/${record.recipeId}`),
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
        deleteDoc(doc(db, "boxes", value.boxId, "recipes", value.recipeId))
      }
    )
  }

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ display: "inline-flex" }}>
        <Filterbox data={recipes} setFilteredRows={setFilteredRows} />
      </div>
      <div style={{ float: 'right', display: 'inline-flex', padding: '5px' }}>
        <Popconfirm
          title={`Are you sure to delete ${selectedRowKeys.length > 1 ? "these recipes" : "this recipe"}s`}
          onConfirm={del}
          okText="Yes"
          cancelText="No"
        >
          <Button disabled={!writeable || !hasSelected}><DeleteOutlined /></Button>
        </Popconfirm>
        <Button onClick={() => { console.log("fork", selectedRowKeys) }} disabled={!hasSelected}><ForkOutlined /></Button>
      </div>
      <Table<RowType>
        pagination={false}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredRows}
        onRow={onRow}
        rowClassName={() => "recipe-row"}
      />
    </div>
  )
}