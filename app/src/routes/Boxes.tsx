import { Button, Input, Modal } from "antd"
import { useContext, useState } from "react"
import { Context } from "../context"
import { PlusOutlined } from "@ant-design/icons";
import { addBox } from '../utils';
import { getAuth } from "firebase/auth";
import { RowType, BoxTable } from '../BoxTable/BoxTable'


function Boxes() {
  const { state } = useContext(Context)
  const [isVisible, setIsVisible] = useState(false);
  const [newBoxName, setNewBoxName] = useState<string>();

  const boxes: RowType[] = Array.from(state.boxes).map(([key, value]) => ({
    name: value.data.name,
    owners: value.owners,
    numRecipes: value.data.recipes.size,
    boxId: key,
    key: key,
  } as RowType))


  const handleOk = () => {
    setIsVisible(false)
    if(newBoxName === undefined) {
      return
    }
    addBox(getAuth().currentUser, newBoxName)
    setNewBoxName(undefined)
  }

  return (
    <div>
      <Modal visible={isVisible} onOk={handleOk} onCancel={() => setIsVisible(false)}>
        <Input title="Name" value={newBoxName} onChange={e => setNewBoxName(e.target.value)}/>
      </Modal >
      <Button onClick={() => setIsVisible(true)}><PlusOutlined />Create new box</Button>
      <BoxTable boxes={boxes} />
    </div>
  )
}

export default Boxes