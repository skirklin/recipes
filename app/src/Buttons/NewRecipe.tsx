import { PlusOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context";
import { PickBoxModal } from "../Modals/PickBoxModal";
import { createNewRecipe, getUniqueId } from "../utils";
import { getAuth } from "firebase/auth";
import { ActionButton } from "../StyledComponents";
import { BoxId } from "../types";
import { RecipeEntry } from "../storage";
import { Menu } from "antd";


interface NewProps {
    boxId?: string
    element: "menu" | "button"
    disabled: boolean
}

export default function NewButton(props: NewProps) {
    const { boxId, disabled, element } = props;
    const { state, dispatch } = useContext(Context)
    const navigate = useNavigate()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const { user } = state


    const addNewRecipe = (boxId: BoxId) => {
        if (user === null) {
            return
        }
        // since user can't be null here, the returned value can't either.
        const recipe = createNewRecipe(user) as RecipeEntry;
        const recipeId = `uniqueId=${getUniqueId(recipe)}`
        dispatch({ type: "ADD_RECIPE", payload: recipe, boxId, recipeId })
        navigate(`/boxes/${boxId}/recipes/${recipeId}`)
    }

    function newRecipe(boxId: BoxId) {
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
    let elt;
    switch (element) {
        case "button":
            elt = <ActionButton title="Create new recipe" disabled={disabled} onClick={newRecipeFlow} icon={<PlusOutlined />}>
                New
            </ActionButton>
            break;
        case "menu":
            elt = <Menu.Item title="Create new recipe" disabled={disabled} onClick={newRecipeFlow} icon={<PlusOutlined />} >
                New
            </Menu.Item>
            break;
    }


    return (<>
        {elt}
        <PickBoxModal handleOk={newRecipe} isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
    </>)

}