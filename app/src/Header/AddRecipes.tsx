import { Recipe } from 'schema-dts';
import { Button, Modal, Upload, Select } from 'antd';
import { FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { addDoc, collection } from 'firebase/firestore'

import { db } from '../App';
import { useContext, useState } from 'react';
import { Context } from '../context';
import styled from 'styled-components';

const ModalButton = styled(Button)`
  display: inline-block;
`

const CreateButton = styled(Button)`
  display: inline-block;
  margin: 4px;
  background-color: var(--russian-green);
  font-weight: bold;
  `

const UploadButton = styled(Button)`
  display: inline-block;
  margin: 4px;
  font-weight: bold;
`

const createNewRecipe = () => ({
  "@type": "Recipe",
  "name": "New recipe",
  "recipeInstructions": [{ "@type": "HowToStep", text: "Add instructions" }],
  "recipeIngredient": ["Add ingredients"],
  "description": "Add description",
})

function AddRecipesModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeBox, setActiveBox] = useState("")
  const { state, dispatch } = useContext(Context)

  const interceptUpload = async (options: any) => {
    if (options.file.type === "application/json") {
      let text = await options.file.text()
      let jsonobj = JSON.parse(text) as Recipe
      let recipesRef = collection(db, "boxes", activeBox!, "recipes");
      await addDoc(recipesRef, jsonobj)
      setIsVisible(false);
    }
  };

  const handleCreateNew = () => {
    let newRecipe = createNewRecipe();
    dispatch({ type: "APPEND_TAB", payload: { boxId: activeBox, recipe: newRecipe } });
    setIsVisible(false);
  }

  let boxNames = [];
  for (let k of state.boxes.keys()) {
    boxNames.push(k)
  }
  let boxOptions;
  if (boxNames.length > 0) {
    boxOptions = boxNames.map(bn => ({ label: state.boxes.get(bn)!.name, value: bn }))
    if (activeBox === "") {
      setActiveBox(boxOptions[0].value)
    }
  } else {
    boxOptions = [{ label: "", value: "" }]
  }
  return (
    <>
      <Modal footer={null} visible={isVisible} onCancel={() => setIsVisible(false)} onOk={() => setIsVisible(false)}>
        <div style={{ margin: "5px" }}>
          <label>Add recipes to: </label>
          <Select value={activeBox} onChange={e => { console.log(e); setActiveBox(e) }} options={boxOptions} />
        </div>
        <div>
          <Upload multiple showUploadList={false} customRequest={interceptUpload} disabled={activeBox === ""}>
            <UploadButton icon={<UploadOutlined />}>Upload recipes</UploadButton>
          </Upload>
          <CreateButton onClick={handleCreateNew} icon={<FileAddOutlined />}>Create new</CreateButton>
        </div>
      </Modal >
      <ModalButton onClick={() => setIsVisible(true)} icon={<FileAddOutlined />}>Add recipes</ModalButton>
    </>
  )
}


export default AddRecipesModal;
