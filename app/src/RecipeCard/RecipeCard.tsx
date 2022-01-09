import styled from 'styled-components';

import SaveButton from './SaveRecipe';
import ClearButton from './ClearChanges';
import InstructionList from './InstructionList';
import IngredientList from './IngredientList';
import RecipeName from './RecipeName';
import RecipeDescription from './RecipeDescription';
import Image from './Image';
import { BoxId, RecipeId } from '../types';
import { IndexCardLine, RecipeActionGroup } from '../StyledComponents';
import ByLine from './Byline';
import Tags from './Tags';

const RecipeBody = styled.div`
  margin: 5px
`

export interface RecipeCardProps {
  recipeId: RecipeId
  boxId: BoxId
}

function RecipeCard(props: RecipeCardProps) {
  return (
    <div>
      <RecipeName {...props} />
      <div style={{ width: "100%" }}>
        <ByLine {...props} />
        <Tags {...props} />
      </div>
      <IndexCardLine />
      <RecipeActionGroup>
        <SaveButton {...props} />
        <ClearButton {...props} />
      </RecipeActionGroup>
      <Image {...props} />
      <RecipeDescription {...props} />
      <RecipeBody>
        <IngredientList {...props} />
        <InstructionList {...props} />
      </RecipeBody>
    </div>
  );
}

export default RecipeCard;