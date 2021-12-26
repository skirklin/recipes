import { Recipe } from 'schema-dts';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addDoc, collection } from 'firebase/firestore'

import { db } from '../App';
import { useContext, useState } from 'react';
import { RecipeBoxContext } from '../context';


function AddRecipes() {
  const {state} = useContext(RecipeBoxContext)
  
  const interceptUpload = async (options: any) => {
    if (options.file.type === "application/json") {
      let text = await options.file.text()
      let jsonobj = JSON.parse(text) as Recipe
      addDoc(collection(db, "boxes", activeBox!, "recipes"), jsonobj).then(e => console.log("uploaded", jsonobj))
    }
  };
  let boxNames = [];
  for ( let k of state.boxes.keys()) {
    boxNames.push(k)
  } 
  const [activeBox, setActiveBox] = useState(boxNames[0])
  let boxOptions = boxNames.map(bn => <option key={bn} value={bn}>{state.boxes.get(bn)!.name}</option>)
  return (
    <div>
      <select value={activeBox} onChange={e => setActiveBox(e.target.value)}>{boxOptions}</select>
      <Upload multiple showUploadList={false} customRequest={interceptUpload} disabled={activeBox === undefined}>
        <Button icon={<UploadOutlined />}>Upload recipes</Button>
      </Upload>
    </div>
  );
}

export default AddRecipes;
