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
import { BoxId, RecipeId } from '../types';
import { IndexCardBottomLine, IndexCardTopLine, RecipeActionGroup } from '../StyledComponents';
import ByLine from './Byline';
import Tags from './Tags';
import { useMediaQuery } from 'react-responsive';
import { Dropdown, Menu } from 'antd';
import { BarsOutlined } from '@ant-design/icons';


const RecipeBody = styled.div`
  margin: 5px
`

export interface RecipeCardProps {
  recipeId: RecipeId
  boxId: BoxId
}

function ActionBar(props: RecipeCardProps) {
  return (
    <RecipeActionGroup>
      <DeleteButton {...props} element="button" />
      <DownloadButton {...props} element="button" />
      <ForkButton {...props} />
      <VisibilityControl {...props} />
    </RecipeActionGroup>
  )
}

function ActionMenu(props: RecipeCardProps) {
  const menu = (
    <Menu>
      <DeleteButton {...props} element="menu" />
      <DownloadButton {...props} element="menu" />
      <Menu.Item><ForkButton {...props} /></Menu.Item>
      <Menu.Item><VisibilityControl {...props} /></Menu.Item>
    </Menu>
  )
  return <Dropdown overlay={menu} ><BarsOutlined style={{ marginLeft: "auto", fontSize: "2em", padding: "5px" }} /></Dropdown>
}

function RecipeActions(props: RecipeCardProps) {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  if (isTabletOrMobile) {
    return null
  }
  return <ActionMenu {...props} />
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
      <RecipeActionGroup >
        <SaveButton {...props} />
        <ClearButton {...props} />
      </RecipeActionGroup>
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