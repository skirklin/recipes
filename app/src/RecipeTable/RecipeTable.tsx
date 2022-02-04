import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { Popconfirm, Table, TablePaginationConfig, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { FilterValue, Key, TableRowSelection } from 'antd/es/table/interface';
import { DeleteOutlined, ForkOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Filterbox from './Filterbox';
import NewButton from '../Buttons/NewRecipe';
import UploadButton from '../Buttons/UploadRecipes';
import ImportButton from '../Buttons/ImportRecipes';
import { addRecipe, categoriesToTags, deleteRecipe, setRecipeVisiblity } from '../utils';
import { Context } from '../context';
import { PickBoxModal } from '../Modals/PickBoxModal';
import { ActionButton } from '../StyledComponents';
import './RecipeTable.css'
import { BoxEntry, RecipeEntry } from '../storage';
import { BoxId, Visibility } from '../types';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive'
import VisibilityControl from '../Buttons/Visibility';
import { addRecipeOwner } from '../backend';


const PointerTag = styled(Tag)`
  &:hover {
    cursor: pointer;
  }
`

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
  box: BoxEntry,
  recipe: RecipeEntry
  key: string
}

interface RecipeTableProps {
  recipes: RowType[]
  writeable: boolean
  boxId?: string
}


export function RecipeTable(props: RecipeTableProps) {
  /// https://ant.design/components/table/#components-table-demo-row-selection-and-operation
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<RowType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const { writeable, recipes, boxId } = props;
  const { state, dispatch } = useContext(Context)
  const [filteredRows, setFilteredRows] = useState<RowType[]>([])
  const [tagFilter, setTagFilter] = useState<string[]>()

  useEffect(() => setFilteredRows(recipes), [recipes])

  const onSelectChange = (selectedRowKeys: Key[], selectedRows: RowType[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection: TableRowSelection<RowType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onNameCell = (record: RowType, rowIndex: number | undefined) => {
    return {
      onClick: () => navigate(`/boxes/${record.box.id}/recipes/${record.recipe.id}`),
    }
  }
  const onBoxCell = (record: RowType, rowIndex: number | undefined) => {
    return {
      onClick: () => navigate(`/boxes/${record.box.id}`),
    }
  }

  const hasSelected = selectedRowKeys.length > 0;

  async function del() {
    selectedRows.forEach(
      (value: RowType) => {
        deleteRecipe(state, value.box.id, value.recipe.id, dispatch)
      }
    )
    setSelectedRowKeys([])
    setSelectedRows([])
  }

  async function fork(boxId: BoxId) {
    selectedRows.forEach(
      (value: RowType) => {
        addRecipe(boxId, _.cloneDeep(value.recipe), dispatch)
      }
    )
    navigate(`/boxes/${boxId}`)
  }

  function handleVisiblityChange(e: { key: string }) {
    selectedRows.forEach(
      (value: RowType) => {
        setRecipeVisiblity(value.box.id, value.recipe.id, e.key as Visibility)
      }
    )
  }

  function handleAddOwner(newOwnerEmail: string) {
    selectedRows.forEach(
      (value: RowType) => {
        addRecipeOwner({ boxId: value.box.id, recipeId: value.recipe.id, newOwnerEmail })
      }
    )
  }

  const allTags = new Set<string>()
  filteredRows.forEach(
    (row) => {
      categoriesToTags(row.recipe.data.recipeCategory).forEach(
        t => allTags.add(t)
      )
    }
  )

  function handleChange(pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: unknown) {
    setTagFilter(filters.tags as string[] || [])
  }


  function addTagToFilter(t: string) {
    setTagFilter([...(tagFilter || []), t])
  }

  const columns: ColumnsType<RowType> = [
    {
      key: 'name',
      title: 'Name',
      render: (value, record) => <div>{record.recipe.getName()}</div>,
      sorter: (a: RowType, b: RowType) => sortfunc(a.recipe.getName() || "", b.recipe.getName() || ""),
      onCell: onNameCell,
      className: "recipe-table-clickable-column",
    }
  ]

  if (boxId === undefined) {
    columns.push(
      {
        key: 'box',
        title: 'Box',
        onCell: onBoxCell,
        render: (value, record) => <div>{record.box.getName()}</div>,
        className: "recipe-table-clickable-column",
      }
    )
  }

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  columns.push(
    {
      key: 'tags',
      title: 'Tags',
      dataIndex: ['recipe', 'data', 'recipeCategory'],
      render: (tags) => {
        return Array.prototype.map.call(categoriesToTags(tags), t => <PointerTag onClick={() => addTagToFilter(t)}>{t}</PointerTag>)
      },
      filters: [...allTags].map(t => ({ text: t, value: t })),
      filterSearch: allTags.size > 10,
      onFilter: (value, row) => categoriesToTags(row.recipe.data.recipeCategory).includes(value),
      filteredValue: tagFilter,
    }
  )

  if (!isTabletOrMobile) {
    columns.push(
      {
        key: 'description',
        title: 'Description',
        render: (value, record) => <div>{record.recipe.getDescription()}</div>,
      }
    )
  }

  return (
    <div style={{ padding: "5px" }}>
      <div style={{ display: "flex" }}>
        <Filterbox data={recipes} setFilteredRows={setFilteredRows} />
        <div style={{ marginLeft: 'auto' }}>
          <NewButton boxId={boxId} disabled={!writeable} element="button" />
          <UploadButton boxId={boxId} disabled={!writeable} element="button" />
          <ImportButton boxId={boxId} disabled={!writeable} element="button" />
          <VisibilityControl
            disabled={!writeable || !hasSelected}
            handleChange={handleVisiblityChange}
            handleAddOwner={handleAddOwner}
            value={Visibility.public}
            element="button"
          />
          <Popconfirm
            title={`Are you sure to delete ${selectedRowKeys.length > 1 ? "these recipes" : "this recipe"}s`}
            onConfirm={del}
            okText="Yes"
            cancelText="No">
            <ActionButton
              disabled={!writeable || !hasSelected}
              title="Delete recipes"
              icon={<DeleteOutlined />}
            >Delete</ActionButton>
          </Popconfirm>
          <ActionButton
            title="Copy recipes into different box"
            onClick={() => setIsModalVisible(true)}
            disabled={!hasSelected}
            icon={<ForkOutlined />} >Copy</ActionButton>
          <PickBoxModal handleOk={fork} isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
        </div>
      </div>
      <Table<RowType>
        pagination={false}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredRows}
        onChange={handleChange}
      />
    </div>
  )
}