import { Button, Input, Modal } from "antd"
import { useState } from "react"
import { PlusOutlined } from "@ant-design/icons";
import { addBox } from '../utils';
import { getAuth } from "firebase/auth";

function NewBoxModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [newBoxName, setNewBoxName] = useState<string>();

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
    </div>
  )
}

export default NewBoxModal