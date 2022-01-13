import styled from 'styled-components';

import SaveButton from './SaveRecipe';
import ClearButton from './ClearChanges';
import InstructionList from './InstructionList';
import IngredientList from './IngredientList';
import RecipeName from './RecipeName';
import RecipeDescription from './RecipeDescription';
import Notes from './Notes'
import DeleteButton from '../Buttons/DeleteRecipe'
import DownloadButton from '../Buttons/DownloadRecipe';
import VisibilityControl from '../Buttons/Visibility';
import ForkButton from '../Buttons/ForkRecipe';
import { BoxId, RecipeId, Visibility } from '../types';
import { IndexCardBottomLine, IndexCardTopLine, RecipeActionGroup } from '../StyledComponents';
import ByLine from './Byline';
import Tags from './Tags';
import { useMediaQuery } from 'react-responsive';
import { Dropdown, Menu } from 'antd';
import { BarsOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { Context } from '../context';
import { getRecipeFromState, setRecipeVisiblity } from '../utils';
import { addRecipeOwner } from '../backend';


const RecipeBody = styled.div`
  margin: 5px
`

export interface RecipeCardProps {
  recipeId: RecipeId
  boxId: BoxId
}

function ActionBar(props: RecipeCardProps) {
  const { recipeId, boxId } = props;
  const { state } = useContext(Context);
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) {
    return null
  }

  function handleAddOwner(newOwnerEmail: string) {
    addRecipeOwner({ boxId, recipeId, newOwnerEmail }).then(
      (result) => {
        console.log(result)
      }
    )
  }

  function handleVisiblityChange(e: { key: string }) {
    setRecipeVisiblity(boxId, recipeId, e.key as Visibility)
  }
  return (
    <RecipeActionGroup>
      <DeleteButton {...props} element="button" />
      <DownloadButton {...props} element="button" />
      <ForkButton {...props} element="button" />
      <VisibilityControl {...props}
        handleAddOwner={handleAddOwner}
        handleChange={handleVisiblityChange} value={recipe.visibility} element="button" />
    </RecipeActionGroup>
  )
}

function ActionMenu(props: RecipeCardProps) {
  const { recipeId, boxId } = props;
  const { state } = useContext(Context);
  const recipe = getRecipeFromState(state, boxId, recipeId)
  if (recipe === undefined) {
    return null
  }

  function handleVisiblityChange(e: { key: string | undefined }) {
    setRecipeVisiblity(boxId, recipeId, e.key as Visibility)
  }

  function handleAddOwner(newOwner: string) {
    addRecipeOwner({ boxId, recipeId, newOwner })
  }

  const menu = (
    <Menu>
      <DeleteButton {...props} element="menu" />
      <DownloadButton {...props} element="menu" />
      <ForkButton {...props} element="menu" />
      <VisibilityControl
        {...props}
        handleAddOwner={handleAddOwner}
        handleChange={handleVisiblityChange}
        value={recipe.visibility} element="menu" />
    </Menu>
  )
  return <Dropdown overlay={menu} ><BarsOutlined style={{ marginLeft: "auto", fontSize: "2em", padding: "5px" }} /></Dropdown>
}

function RecipeActions(props: RecipeCardProps) {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  if (isTabletOrMobile) {
    return <ActionMenu {...props} />
  } else {
    return <ActionBar {...props} />
  }
}

function RecipeCard(props: RecipeCardProps) {
  return (
    <div>
      <div style={{ display: "flex" }}>
        <RecipeName {...props} />
        <RecipeActions {...props} />
      </div>
      <div style={{ display: "flex" }}>
        <ByLine {...props} />
        <Tags {...props} />
      </div>
      <IndexCardTopLine />
      <div style={{ width: "100%", paddingLeft: "5px" }}>
        <SaveButton {...props} />
        <ClearButton {...props} />
      </div>
      <RecipeDescription {...props} />
      <RecipeBody>
        <IngredientList {...props} />
        <InstructionList {...props} />
      </RecipeBody>
      <IndexCardBottomLine />
      <Notes {...props} />
    </div>
  );
}

export default RecipeCard;