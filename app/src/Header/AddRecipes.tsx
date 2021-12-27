import { Recipe } from 'schema-dts';
import { Button, Modal, Upload } from 'antd';
import { FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import { addDoc, collection } from 'firebase/firestore'

import { db } from '../App';
import { useContext, useState } from 'react';
import { RecipeBoxContext } from '../context';
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


function AddRecipesModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeBox, setActiveBox] = useState("")
  const { state } = useContext(RecipeBoxContext)

  const interceptUpload = async (options: any) => {
    if (options.file.type === "application/json") {
      let text = await options.file.text()
      let jsonobj = JSON.parse(text) as Recipe
      addDoc(collection(db, "boxes", activeBox!, "recipes"), jsonobj).then(e => console.log("uploaded", jsonobj))
    }
  };

  let boxNames = [];
  for (let k of state.boxes.keys()) {
    boxNames.push(k)
  }
  let boxOptions = boxNames.map(bn => <option key={bn} value={bn}>{state.boxes.get(bn)!.name}</option>)
  return (
    <>
      <Modal footer={null} visible={isVisible} onCancel={() => setIsVisible(false)} onOk={() => setIsVisible(false)}>
        <div style={{ margin: "5px" }}>
          <label>Add recipes to: </label>
          <select defaultValue={boxNames[0]} onChange={e => {console.log(e); setActiveBox(e.target.value)}}>
            {boxOptions}
          </select>
        </div>
        <div>
          <Upload multiple showUploadList={false} customRequest={interceptUpload} disabled={activeBox === undefined}>
            <UploadButton icon={<UploadOutlined />}>Upload recipes</UploadButton>
          </Upload>
          <CreateButton icon={<FileAddOutlined />}>Create new</CreateButton>
        </div>
      </Modal >
      <ModalButton onClick={() => setIsVisible(true)} icon={<FileAddOutlined />}>Add recipes</ModalButton>
    </>
  )
}


export default AddRecipesModal;
