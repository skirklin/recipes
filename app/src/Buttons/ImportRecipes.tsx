import { Button, Input } from "antd";
import { useContext, useState } from "react";
import { PickBoxModal, SelectBoxContext } from "./PickBoxModal";
import styled from "styled-components";
import { getRecipes } from '../backend'
import { addRecipe } from "../utils";
import { Context } from "../context";
import { RecipeType, Visibility } from "../types";
import { Recipe } from "schema-dts";
import { getAuth } from "firebase/auth";

const StyledButton = styled(Button)`
  display: inline;
  float: right;
`


interface ImportProps {
    boxId?: string
    disabled: boolean
}

export default function ImportButton(props: ImportProps) {
    const { dispatch } = useContext(Context);
    const { boxId: inputBoxId, disabled } = props;
    const [boxId, setBoxId] = useState(inputBoxId)
    const [value, setValue] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(false)

    let contextValue = {
        setIsVisible: setIsModalVisible,
        isVisible: isModalVisible,
        setBoxName: setBoxId,
        boxName: boxId!,
    }

    async function import_() {
        if (boxId === undefined || value === "") {
            return // leave the modal visible until something is selected
        }
        setIsModalVisible(false)
        console.log({ value })
        let user = getAuth().currentUser
        if (user === null) {
            return
        }
        let response = (await getRecipes({ url: value }))
        console.log(response)
        let data = response.data as {recipe: string}
        let recipe = JSON.parse(data.recipe)
        console.log({ recipe })
        if (!recipe) {
            return
        }
        let fullRecipe: RecipeType = {
            data: recipe as unknown as Recipe,
            visibility: Visibility.private,
            owners: [user.uid]
        }
        addRecipe(boxId, fullRecipe, dispatch)
    }

    function importFlow() {
        if (boxId === undefined) {
            setIsModalVisible(true)
        } else {
            import_()
        }
    }

    return (<>
        <SelectBoxContext.Provider value={contextValue}>
            <Input type="text" value={value} onChange={e => setValue(e.target.value)} />
            <StyledButton disabled={disabled} onClick={() => importFlow()}>Okay</StyledButton>
            <PickBoxModal handleOk={import_} />
        </ SelectBoxContext.Provider >
    </>)

}