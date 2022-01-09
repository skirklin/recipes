import styled from 'styled-components';

import SaveButton from './SaveRecipe';
import ClearButton from './ClearChanges';
import InstructionList from './InstructionList';
import IngredientList from './IngredientList';
import RecipeName from './RecipeName';
import RecipeDescription from './RecipeDescription';
import Image from './Image';

const RecipeBody = styled.div`
  margin: 5px
`

const IndexCardLine = styled.hr`
  background-color: var(--cinnabar);
  border-width: 0px;
  height: 1px;
`

export interface RecipeCardProps {
  recipeId: string
  boxId: string
}

function RecipeCard(props: RecipeCardProps) {
  return (
    <div>
      <RecipeName {...props} />
      <IndexCardLine />
      <div >
        <SaveButton {...props} />
        <ClearButton {...props} />
      </div>
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