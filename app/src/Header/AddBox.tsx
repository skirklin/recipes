import { Button, Modal, Select } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'

import { db } from '../App';
import { useContext, useEffect, useState } from 'react';
import { BoxType } from '../types'
import styled from 'styled-components';
import { getAuth } from 'firebase/auth';
import { OptionsType } from 'rc-select/lib/interface';
import { Context } from '../context';

const StyledButton = styled(Button)`
display: inline-block;
`


function AddBoxModal() {
  const { writeable } = useContext(Context).state
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

  if (!writeable) { 
    return null
  }


  const handleOk = async () => {
    let user = getAuth().currentUser
    if (user === null) {
      throw new Error('No user signed in')
    }
    let boxRef = doc(db, "boxes", selectedBox!)
    let boxDoc = await getDoc(boxRef);
    if (!boxDoc.exists()) {
      throw new Error(`Somehow got a box that doesn\\'t exist: ${selectedBox}`)
    }
    updateDoc(doc(db, "users", user.uid), { boxes: arrayUnion(boxRef) })
    setIsVisible(false);
  }


  let boxOptions: OptionsType = [];
  boxes.forEach((value, key) => boxOptions.push({label: value.name, value: key}))
  return (
    <>
      <Modal visible={isVisible} onOk={handleOk} onCancel={() => setIsVisible(false)}>
        <div>
          <label>Add existing box to your collection:</label>
          <Select style={{width: "300px"}} value={selectedBox} onChange={setSelectedBox} options={boxOptions} />
        </div>
      </Modal >
      <StyledButton onClick={() => setIsVisible(true)} icon={<InboxOutlined />}>Add box</StyledButton>
    </>
  );
}

export default AddBoxModal;