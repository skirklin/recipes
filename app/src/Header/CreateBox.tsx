import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useState } from 'react';
import styled from 'styled-components';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../App';
import { getAuth } from 'firebase/auth';

const StyledButton = styled(Button)`
display: inline-block;
`


function CreateBoxModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [newBoxName, setNewBoxName] = useState("")
  const handleOk = async () => {
    if (newBoxName === "") {
      return
    }
    let user = getAuth().currentUser
    if (user === null) {
      throw new Error('No user signed in')
    }
    let newBoxRef = await addDoc(collection(db, "boxes"), { name: newBoxName, owners: [user.uid] })
    await updateDoc(doc(db, "users", user.uid), { boxes: arrayUnion(newBoxRef) })
    setIsVisible(false);
  }

  return (
    <>
      <Modal visible={isVisible} onOk={handleOk} onCancel={() => setIsVisible(false)}>
        <div>
          <label>
            Name:
          </label> <input type="text" value={newBoxName} onChange={(e: any) => setNewBoxName(e.target.value)}></input>
        </div>
      </Modal >
      <StyledButton onClick={() => setIsVisible(true)} icon={<PlusOutlined />}>Create box</StyledButton>
    </>
  );
}

export default CreateBoxModal;