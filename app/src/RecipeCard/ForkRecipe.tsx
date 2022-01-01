import { ForkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useContext, useState } from 'react';
import styled from 'styled-components';

import { SelectBoxContext, PickBoxModal } from './PickBoxModal';
import { Context } from '../context';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../App';
import { RecipeContext } from './context';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled(Button)`
  display: inline-block;
  float: right;
`

function ForkRecipe() {
  const rbCtx = useContext(Context)
  const navigate = useNavigate()
  const { writeable } = rbCtx.state;
  const { state } = useContext(RecipeContext)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [tgtBox, setTgtBox] = useState<string | undefined>(undefined)


  async function fork() {
    if (tgtBox === undefined) {
      return // leave the modal visible until something is selected
    }
    setIsModalVisible(false)
    console.log("forking into", tgtBox)
    let colRef = collection(db, "boxes", tgtBox, "recipes")
    let recipeRef = await addDoc(colRef, state.recipe)
    navigate(`/boxes/${tgtBox}/recipes/${recipeRef.id}`)
  }

  let contextValue = {
    setIsVisible: setIsModalVisible,
    isVisible: isModalVisible,
    setBox: setTgtBox,
    box: tgtBox!,
  }

  if (writeable) {
    return (
      <SelectBoxContext.Provider value={contextValue}>
        <StyledButton icon={<ForkOutlined />} onClick={() => setIsModalVisible(true)} />
        <PickBoxModal
          handleOk={fork} />
      </ SelectBoxContext.Provider >
    )
  } else {
    return null
  }
}

export default ForkRecipe;