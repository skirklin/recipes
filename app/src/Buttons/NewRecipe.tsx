import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context";
import { PickBoxModal, SelectBoxContext } from "./PickBoxModal";
import { createNewRecipe, getUniqueId } from "../utils";
import styled from "styled-components";
import { getAuth } from "firebase/auth";

const StyledButton = styled(Button)`
  display: inline;
  float: right;
`

interface NewProps {
    boxId?: string
    disabled: boolean
}

export default function NewButton(props: NewProps) {
    const { boxId: inputBoxId, disabled } = props;
    const { dispatch } = useContext(Context)
    const navigate = useNavigate()
    const [boxId, setBoxId] = useState(inputBoxId)
    const [isModalVisible, setIsModalVisible] = useState(false)

    let contextValue = {
        setIsVisible: setIsModalVisible,
        isVisible: isModalVisible,
        setBoxName: setBoxId,
        boxName: boxId!,
    }

    const addNewRecipe = (boxId: string) => {
        let user = getAuth().currentUser
        if (user === null) {
            return
        }
        let recipe = createNewRecipe(user);
        let recipeId = `uniqueId=${getUniqueId(recipe.data)}`
        dispatch({ type: "ADD_RECIPE", payload: recipe, boxId, recipeId })
        navigate(`/boxes/${boxId}/recipes/${recipeId}`)
    }

    async function newRecipe() {
        if (boxId === undefined) {
            return // leave the modal visible until something is selected
        }
        setIsModalVisible(false)
        addNewRecipe(boxId)
    }

    function newRecipeFlow() {
        if (boxId === undefined) {
            setIsModalVisible(true)
        } else {
            addNewRecipe(boxId)
        }
    }

    return (<>
        <SelectBoxContext.Provider value={contextValue}>
            <StyledButton title="Create new recipe" disabled={disabled} onClick={newRecipeFlow}><PlusOutlined /></StyledButton>
            <PickBoxModal handleOk={newRecipe} />
        </ SelectBoxContext.Provider >
    </>)

}