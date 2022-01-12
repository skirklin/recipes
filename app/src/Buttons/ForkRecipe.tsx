import _ from 'lodash';
import { ForkOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';

import { PickBoxModal } from '../Modals/PickBoxModal';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom';
import { addRecipe, getRecipeFromState } from '../utils';
import { ActionButton } from '../StyledComponents';
import { RecipeCardProps } from '../RecipeCard/RecipeCard';
import { BoxId } from '../types';
import { Menu } from 'antd';

interface ForkProps extends RecipeCardProps {
  targetBoxId?: string
  element: "menu" | "button"
}

export default function ForkButton(props: ForkProps) {
  const { boxId, recipeId, targetBoxId, element } = props;
  const { state, dispatch } = useContext(Context)
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) return null

  const addNewRecipe = async (boxId: BoxId) => {
    const recipeRef = await addRecipe(boxId, _.cloneDeep(recipe), dispatch)
    navigate(`/boxes/${boxId}/recipes/${recipeRef.id}`)
  }

  async function newRecipe(boxId: BoxId) {
    if (boxId === undefined) {
      return // leave the modal visible until something is selected
    }
    setIsModalVisible(false)
    addNewRecipe(boxId)
  }

  function forkRecipeFlow() {
    if (targetBoxId === undefined) {
      setIsModalVisible(true)
    } else {
      addNewRecipe(boxId)
    }
  }

  let elt;
  switch (element) {
    case "button":
      elt = <ActionButton title="Copy recipe into new box." disabled={!recipe} onClick={forkRecipeFlow} icon={<ForkOutlined />} >Copy</ActionButton>
      break;

    case "menu":
      elt = <Menu.Item key="copy" title="Copy recipe into new box." disabled={!recipe} onClick={forkRecipeFlow} icon={<ForkOutlined />} >Copy</Menu.Item>
      break;
  }

  return (<>
    {elt}
    <PickBoxModal handleOk={newRecipe} isVisible={isModalVisible} setIsVisible={setIsModalVisible} disableBoxes={[boxId]} />
  </>)

}