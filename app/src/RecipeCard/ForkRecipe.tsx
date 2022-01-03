import { ForkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useContext, useState } from 'react';
import styled from 'styled-components';

import { SelectBoxContext, PickBoxModal } from '../Buttons/PickBoxModal';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom';
import { addRecipe } from '../utils';
import { RecipeType } from '../types';

const StyledButton = styled(Button)`
  display: inline-block;
  float: right;
`

interface ForkProps {
  recipe: RecipeType
}

function ForkRecipe(props: ForkProps) {
  const { recipe } = props;
  const {state} = useContext(Context)
  const { writeable } = state;
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [tgtBox, setTgtBox] = useState<string | undefined>(undefined)

  async function fork() {
    if (tgtBox === undefined) {
      return // leave the modal visible until something is selected
    }
    setIsModalVisible(false)
    let recipeRef = await addRecipe(tgtBox, recipe)
    navigate(`/boxes/${tgtBox}/recipes/${recipeRef.id}`)
  }

  let contextValue = {
    setIsVisible: setIsModalVisible,
    isVisible: isModalVisible,
    setBoxName: setTgtBox,
    boxName: tgtBox!,
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