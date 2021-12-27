import { Button, Modal } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'

import { db } from '../App';
import { useEffect, useState } from 'react';
import { BoxType } from '../types'
import styled from 'styled-components';
import { getAuth } from 'firebase/auth';

const StyledButton = styled(Button)`
display: inline-block;
`


function AddBoxModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [boxes, setBoxes] = useState(new Map<string, BoxType>())
  const [selectedBox, setSelectedBox] = useState<string>()

  useEffect(() => {
    let fetchBoxes = async () => {
      let bs = await getDocs(collection(db, "boxes"))
      let bm = new Map<string, BoxType>()
      bs.docs.forEach(
        snap => bm.set(snap.id, snap.data() as BoxType)
      )
      setBoxes(bm)
    }

    fetchBoxes()
  }, [])

  const handleOk = async () => {
    let user = getAuth().currentUser
    if (user === null) {
      throw new Error('No user signed in')
    }
    console.log("selectedBox:", selectedBox)
    let boxRef = doc(db, "boxes", selectedBox!)
    let boxDoc = await getDoc(boxRef);
    if (!boxDoc.exists()) {
      throw new Error(`Somehow got a box that doesn\\'t exist: ${selectedBox}`)
    }
    updateDoc(doc(db, "users", user.uid), { boxes: arrayUnion(boxRef) })
    setIsVisible(false);
  }


  let boxOptions: JSX.Element[] = []
  boxes.forEach((value, key) => boxOptions.push(<option key={key} value={value.name}>{value.name}</option>))
  return (
    <>
      <Modal visible={isVisible} onOk={handleOk} onCancel={() => setIsVisible(false)}>
        <div>
          <label>Add existing box to your collection:</label>
          <select value={selectedBox} onChange={e => {console.log(e); setSelectedBox(e.target.value)}}>{boxOptions}</select>
        </div>
      </Modal >
      <StyledButton onClick={() => setIsVisible(true)} icon={<InboxOutlined />}>Add box</StyledButton>
    </>
  );
}

export default AddBoxModal;