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


interface NewProps {
    boxId?: string
    disabled: boolean
}

export default function NewButton(props: NewProps) {
    const { boxId, disabled } = props;
    const { dispatch } = useContext(Context)
    const navigate = useNavigate()
    const [isModalVisible, setIsModalVisible] = useState(false)


    const addNewRecipe = (boxId: BoxId) => {
        const user = getAuth().currentUser
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

    return (<>
            <ActionButton title="Create new recipe" disabled={disabled} onClick={newRecipeFlow} icon={<PlusOutlined />} />
            <PickBoxModal handleOk={newRecipe} isVisible={isModalVisible} setIsVisible={setIsModalVisible}/>
    </>)

}