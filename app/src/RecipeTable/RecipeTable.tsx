import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { Popconfirm, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { Key, TableRowSelection } from 'antd/es/table/interface';
import { DeleteOutlined, ForkOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Filterbox from './Filterbox';
import NewButton from '../Buttons/NewRecipe';
import UploadButton from '../Buttons/UploadRecipes';
import ImportButton from '../Buttons/ImportRecipes';
import { addRecipe, deleteRecipe } from '../utils';
import { Context } from '../context';
import { PickBoxModal } from '../Modals/PickBoxModal';
import { RecipeType } from '../types';
import { ActionButton } from '../StyledComponents';
import './RecipeTable.css'
import { Recipe } from 'schema-dts';

function sortfunc(a: string, b: string) {
  const A = a.toUpperCase(); // ignore upper and lowercase
  const B = b.toUpperCase(); // ignore upper and lowercase
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
  recipe: RecipeType
  boxId: string
  recipeId: string
  key: string
}

interface RecipeTableProps {
  recipes: RowType[]
  writeable: boolean
  boxId?: string
}

const getName = (name: Recipe["name"]) => name === undefined ? "" : name.toString()

const columns: ColumnsType<RowType> = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: ['recipe', 'data', 'name'],
    sorter: (a: RowType, b: RowType) => sortfunc(getName(a.recipe.data.name), getName(b.recipe.data.name)),
  },
  {
    key: 'description',
    title: 'Description',
    dataIndex: ['recipe', 'data', 'description'],
  },
  {
    key: 'box',
    title: 'Box',
    dataIndex: ['boxName'],
  },
];



export function RecipeTable(props: RecipeTableProps) {
  /// https://ant.design/components/table/#components-table-demo-row-selection-and-operation
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<RowType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const { writeable, recipes, boxId } = props;
  const { state, dispatch } = useContext(Context)
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

  const hasSelected = selectedRowKeys.length > 0;

  async function del() {
    selectedRows.forEach(
      (value: RowType) => {
        deleteRecipe(state, value.boxId, value.recipeId)
      }
    )
  }

  async function fork(boxId: string) {
    selectedRows.forEach(
      (value: RowType) => {
        addRecipe(boxId, _.cloneDeep(value.recipe), dispatch)
      }
    )
  }

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ display: "inline-flex" }}>
        <Filterbox data={recipes} setFilteredRows={setFilteredRows} />
      </div>
      <div style={{ float: 'right', display: 'inline-flex', padding: '5px' }}>
        <NewButton boxId={boxId} disabled={!writeable} />
        <UploadButton boxId={boxId} disabled={!writeable} />
        <ImportButton boxId={boxId} disabled={!writeable} />
        <Popconfirm
          title={`Are you sure to delete ${selectedRowKeys.length > 1 ? "these recipes" : "this recipe"}s`}
          onConfirm={del}
          okText="Yes"
          disabled={!writeable || !hasSelected}
          cancelText="No">
          <ActionButton
            disabled={!writeable || !hasSelected}
            title="Delete recipes"
            icon={<DeleteOutlined />} />
        </Popconfirm>
        <ActionButton
          title="Copy recipes into different box"
          onClick={() => setIsModalVisible(true)}
          disabled={!hasSelected}
          icon={<ForkOutlined />} />
        <PickBoxModal handleOk={fork} isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
      </div>
      <Table<RowType>
        pagination={false}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredRows}
        onRow={onRow}
        rowClassName={() => "recipe-row"}/>
    </div>
  )
}