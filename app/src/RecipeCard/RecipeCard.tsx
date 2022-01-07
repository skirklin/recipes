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

function RecipeCard() {
  return (
    <div>
      <RecipeName />
      <IndexCardLine />
      <div >
        <SaveButton />
        <ClearButton />
      </div>
      <Image />
      <RecipeDescription />
      <RecipeBody>
        <IngredientList />
        <InstructionList />
      </RecipeBody>
    </div>
  );
}

export default RecipeCard;