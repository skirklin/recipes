import { Input, Modal } from "antd"
import { useContext, useState } from "react"
import { addBox } from '../utils';
import { getAuth } from "firebase/auth";
import { Context } from "../context";

interface NewBoxModalProps {
  isVisible: boolean
  setIsVisible: (visible: boolean) => void
}

function NewBoxModal(props: NewBoxModalProps) {
  const {isVisible, setIsVisible} = props;
  const { dispatch } = useContext(Context)
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
    <Modal visible={isVisible} onOk={handleOk} onCancel={() => setIsVisible(false)}>
      <Input
        autoFocus
        title="Name"
        value={newBoxName} onChange={e => setNewBoxName(e.target.value)}
        onKeyUp={(e) => { if (e.code === "Enter") { handleOk() } }}
      />
    </Modal >
  )
}

export default NewBoxModal