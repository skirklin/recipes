import { DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { getAuth } from 'firebase/auth';
import _ from 'lodash';

import { useContext, useState } from 'react';
import { Recipe } from 'schema-dts';
import { getRecipes } from '../backend';
import { Context } from '../context';
import { RecipeType, Visibility } from '../types';
import { addRecipe } from '../utils';

interface ImportProps {
  boxId: string | undefined
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}

interface PossibleRecipeProps {
  recipe: RecipeType
  remove: () => void
}

function PossibleRecipe(props: PossibleRecipeProps) {
  const { recipe, remove } = props;
  return (
    <div>
      <Button onClick={() => remove()} icon={<DeleteOutlined />} />{recipe.data.name}
    </div>
  )
}

function ImportModal(props: ImportProps) {
  const { isVisible, setIsVisible, boxId } = props;
  const [spinning, setSpinning] = useState(false)
  const [value, setValue] = useState<string>();
  const [discovered, setDiscovered] = useState<RecipeType[]>([])
  const { dispatch } = useContext(Context)

  async function import_() {
    setSpinning(true)
    if (boxId === undefined || value === "") {
      return
    }
    const user = getAuth().currentUser
    if (user === null) {
      return
    }
    const response = (await getRecipes({ url: value }))
    const data = response.data as any

    if (data.error) {
      alert(data.error)
    }
    const recipes = JSON.parse(data.recipes)
    const fullRecipes = recipes.map(
      (recipe: Recipe) => {
        return {
          data: recipe as unknown as Recipe,
          visibility: Visibility.private,
          owners: [user!.uid]
        }
      }
    )
    setDiscovered([...discovered, ...fullRecipes])
    setSpinning(false)
  }

  function makeRemover(i: number) {
    const remover = () => {
      setDiscovered(_.filter(discovered, (x, id) => id !== i))
    }
    return remover
  }

  function addRecipes() {
    discovered.forEach(recipe => addRecipe(boxId!, recipe, dispatch))
    setDiscovered([]);
    setValue("");
    setIsVisible(false);
  }

  const possibleRecipes = discovered.map((recipe, i) => { return <PossibleRecipe recipe={recipe} remove={makeRemover(i)} /> })
  return (
    <Modal visible={isVisible} onOk={() => import_()} onCancel={() => setIsVisible(false)} footer={[]}>
      <TextArea
        autoFocus
        title="URL"
        value={value} onChange={e => setValue(e.target.value)}
      />
      <Spin spinning={spinning}><Button onClick={() => import_()}>Read URL</Button></Spin>
      {possibleRecipes}
      <Button onClick={() => addRecipes()}>Add recipes</Button>
    </Modal >
  )
}

export default ImportModal