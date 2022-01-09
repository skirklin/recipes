import _ from 'lodash';
import { ForkOutlined } from '@ant-design/icons';
import { useContext, useState } from 'react';

import { PickBoxModal } from '../Modals/PickBoxModal';
import { Context } from '../context';
import { useNavigate } from 'react-router-dom';
import { addRecipe, getRecipeFromState } from '../utils';
import { ActionButton } from '../StyledComponents';
import { RecipeCardProps } from '../RecipeCard/RecipeCard';

interface ForkProps extends RecipeCardProps {
  targetBoxId?: string
}

export default function ForkButton(props: ForkProps) {
  const { boxId, recipeId, targetBoxId } = props;
  const { state, dispatch } = useContext(Context)
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) return null

  const addNewRecipe = async (boxId: string) => {
    const recipeRef = await addRecipe(boxId, _.cloneDeep(recipe), dispatch)
    navigate(`/boxes/${boxId}/recipes/${recipeRef.id}`)
  }

  async function newRecipe(boxId: string) {
    if (boxId === undefined) {
      return // leave the modal visible until something is selected
    }
    setIsModalVisible(false)
    addNewRecipe(boxId)
  }

  function newRecipeFlow() {
    if (targetBoxId === undefined) {
      setIsModalVisible(true)
    } else {
      addNewRecipe(boxId)
    }
  }

  return (<>
      <ActionButton title="Create new recipe" disabled={!recipe} onClick={newRecipeFlow} icon={<ForkOutlined />} />
      <PickBoxModal handleOk={newRecipe} isVisible={isModalVisible} setIsVisible={setIsModalVisible}/>
  </>)

}