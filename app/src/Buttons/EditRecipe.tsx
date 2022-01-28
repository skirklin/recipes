import { EditFilled } from '@ant-design/icons';
import { useContext } from 'react';

import { Context } from '../context';
import { getRecipeFromState } from '../utils';
import { ActionButton } from '../StyledComponents';
import { RecipeCardProps } from '../RecipeCard/RecipeCard';
import { Menu } from 'antd';

interface EditProps extends RecipeCardProps {
  element: "menu" | "button"
}

export default function EditButton(props: EditProps) {
  const { boxId, recipeId, element } = props;
  const { state, dispatch } = useContext(Context)
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined || recipe.editing) {
    return null
  }

  function setEditable() {
    dispatch({ type: "SET_EDITABLE", recipeId, boxId })
  }

  let elt;
  switch (element) {
    case "button":
      elt = <ActionButton
        title="Edit recipe."
        disabled={!recipe}
        onClick={setEditable}
        icon={<EditFilled />}
      >
        Edit
      </ActionButton>
      break;

    case "menu":
      elt = <Menu.Item
        key="edit"
        title="Edit recipe."
        disabled={!recipe}
        onClick={setEditable}
        icon={<EditFilled />} >
        Edit
      </Menu.Item>
      break;
  }

  return elt
}