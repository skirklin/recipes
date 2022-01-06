import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context";
import { PickBoxModal } from "../Modals/PickBoxModal";
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
    const { boxId, disabled } = props;
    const { dispatch } = useContext(Context)
    const navigate = useNavigate()
    const [isModalVisible, setIsModalVisible] = useState(false)


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

    function newRecipe(boxId: string) {
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
            <StyledButton title="Create new recipe" disabled={disabled} onClick={newRecipeFlow} icon={<PlusOutlined />} />
            <PickBoxModal handleOk={newRecipe} isVisible={isModalVisible} setIsVisible={setIsModalVisible}/>
    </>)

}