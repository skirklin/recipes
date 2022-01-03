import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from 'react-router-dom';
import './BoxTable.css';

export type RowType = {
  name: string
  owners: string[]
  numRecipes: number
  boxId: string
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
  boxes: RowType[]
}

export function BoxTable(props: BoxTableProps) {
  const { boxes } = props;
  let navigate = useNavigate();

  const onRow = (record: RowType, rowIndex: number | undefined) => {
    return {
      onClick: () => navigate(`/boxes/${record.boxId}`),
    }
  }

  return (
    <Table<RowType>
      dataSource={boxes}
      columns={columns}
      onRow={onRow}
      rowClassName={() => "box-row"}
    />
  )
}