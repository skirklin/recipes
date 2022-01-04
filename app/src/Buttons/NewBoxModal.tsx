import { Button, Input, Modal } from "antd"
import { useContext, useState } from "react"
import { PlusOutlined } from "@ant-design/icons";
import { addBox } from '../utils';
import { getAuth } from "firebase/auth";
import { Context } from "../context";

function NewBoxModal() {
  const { dispatch } = useContext(Context)
  const [isVisible, setIsVisible] = useState(false);
  const [newBoxName, setNewBoxName] = useState<string>();

  const handleOk = () => {
    setIsVisible(false)
    if (newBoxName === undefined) {
      return
    }
    addBox(getAuth().currentUser, newBoxName, dispatch)
    setNewBoxName(undefined)
  }

  return (
    <div>
      <Modal visible={isVisible} onOk={handleOk} onCancel={() => setIsVisible(false)}>
        <Input
          autoFocus
          title="Name"
          value={newBoxName} onChange={e => setNewBoxName(e.target.value)}
          onKeyUp={(e) => { if (e.code === "Enter") { handleOk() } }}
        />
      </Modal >
      <Button onClick={() => setIsVisible(true)}><PlusOutlined />New box</Button>
    </div>
  )
}

export default NewBoxModal