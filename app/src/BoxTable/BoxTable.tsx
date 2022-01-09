import { Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Key, TableRowSelection } from "antd/es/table/interface";
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ActionButton, RecipeActionGroup } from "../StyledComponents";
import NewBoxButton from '../Buttons/NewBox';

import './BoxTable.css';
import { Context } from "../context";
import { deleteBox } from "../utils";
import { DeleteOutlined } from "@ant-design/icons";
import { BoxId } from "../types";

export type RowType = {
  name: string
  owners: string[]
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
    // render: value => {return <span>{value.join(', ')}</span>},
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
  const { state } = useContext(Context)
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
        deleteBox(state, value.boxId)
      }
    )
  }
  const hasSelected = (selectedRows.length > 0)
  return (
    <div>

      <RecipeActionGroup>
        <NewBoxButton disabled={!writeable} />
        <Popconfirm
          title={`Are you sure to delete ${selectedRowKeys.length > 1 ? "these recipes" : "this recipe"}s`}
          onConfirm={del}
          okText="Yes"
          disabled={!writeable || !hasSelected}
          cancelText="No"
        >
          <ActionButton disabled={!writeable || !hasSelected} title="Delete recipes" icon={<DeleteOutlined />} />
        </Popconfirm>
      </RecipeActionGroup>

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