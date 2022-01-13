import { Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Key, TableRowSelection } from "antd/es/table/interface";
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ActionButton, RecipeActionGroup } from "../StyledComponents";
import NewBoxButton from '../Buttons/NewBox';

import './BoxTable.css';
import { Context } from "../context";
import { deleteBox, setBoxVisiblity } from "../utils";
import { DeleteOutlined } from "@ant-design/icons";
import { BoxId, Visibility } from "../types";
import { UserEntry } from "../storage";
import VisibilityControl from "../Buttons/Visibility";
import { addBoxOwner } from "../backend";

export type RowType = {
  name: string
  owners: UserEntry[]
  numRecipes: number
  boxId: BoxId
  key: string
}

const columns: ColumnsType<RowType> = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
  },
  {
    key: 'owners',
    title: 'Owners',
    dataIndex: ['owners'],
    render: (value: UserEntry[]) => <span>{value.map(u => u.name).join(', ')}</span>,
  },
  {
    key: 'numRecipes',
    title: 'Number of recipes',
    dataIndex: 'numRecipes',
  }
]

interface BoxTableProps {
  rows: RowType[]

}

export function BoxTable(props: BoxTableProps) {
  const { state, dispatch } = useContext(Context)
  const { writeable } = state;

  const { rows } = props;
  const navigate = useNavigate();

  const onRow = (record: RowType, rowIndex: number | undefined) => {
    return {
      onClick: () => navigate(`/boxes/${record.boxId}`),
    }
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<RowType[]>([]);

  const onSelectChange = (selectedRowKeys: Key[], selectedRows: RowType[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection: TableRowSelection<RowType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  async function del() {
    selectedRows.forEach(
      (value: RowType) => {
        deleteBox(state, value.boxId, dispatch)
      }
    )
  }
  const hasSelected = (selectedRows.length > 0)

  function handleVisiblityChange(e: { key: string }) {
    selectedRows.forEach(
      (value: RowType) => {
        setBoxVisiblity(value.boxId, e.key as Visibility)
      }
    )
  }

  function handleAddOwner(newOwnerEmail: string) {
    selectedRows.forEach(
      (value: RowType) => {
        addBoxOwner({ boxId: value.boxId, newOwnerEmail })
      }
    )
  }


  return (
    <div>
      <div style={{ display: "flex" }}>

        <RecipeActionGroup style={{ marginLeft: "auto" }}>
          <NewBoxButton disabled={!writeable} />
          <Popconfirm
            title={`Are you sure to delete ${selectedRowKeys.length > 1 ? "these recipes" : "this recipe"}s`}
            onConfirm={del}
            okText="Yes"
            disabled={!writeable || !hasSelected}
            cancelText="No"
          >
            <VisibilityControl
              disabled={!writeable || !hasSelected}
              handleChange={handleVisiblityChange}
              handleAddOwner={handleAddOwner}
              value={Visibility.public}
              element="button"
            />

            <ActionButton disabled={!writeable || !hasSelected} title="Delete recipes" icon={<DeleteOutlined />}>Delete</ActionButton>
          </Popconfirm>
        </RecipeActionGroup>
      </div>

      <Table<RowType>
        dataSource={rows}
        columns={columns}
        onRow={onRow}
        rowSelection={rowSelection}
        rowClassName={() => "box-row"}
      />
    </div>
  )
}