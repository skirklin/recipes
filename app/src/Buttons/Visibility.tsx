import { BookOutlined, GlobalOutlined, ProfileOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { db } from "../backend";
import { Context } from "../context";
import { BoxEntry, RecipeEntry } from "../storage";
import { ActionButton } from "../StyledComponents";
import { BoxId, RecipeId, Visibility } from "../types";
import { getBoxFromState, getRecipeFromState } from "../utils";


interface VisibilityProps {
    recipeId?: RecipeId
    boxId: BoxId
    element: "menu" | "button"
}

export default function VisibilityControl(props: VisibilityProps) {
    const { state } = useContext(Context)
    const { recipeId, boxId, element } = props;
    let target: RecipeEntry | BoxEntry | undefined
    if (recipeId === undefined) {
        target = getBoxFromState(state, boxId)
    } else {
        target = getRecipeFromState(state, boxId, recipeId)
    }
    if (target === undefined) return null

    function handleMenuClick(e: { key: string; }) {
        if (boxId === undefined) {
            return
        }
        const newPrivacy = e.key
        if (recipeId === undefined) {
            updateDoc(doc(db, "boxes", boxId), { visibility: newPrivacy })
        } else {
            updateDoc(doc(db, "boxes", boxId, "recipes", recipeId), { visibility: newPrivacy })
        }
    }

    let visibility: Visibility
    if (target !== undefined) {
        visibility = target.visibility;
    } else {
        visibility = Visibility.private
    }

    let icon;
    switch (visibility) {
        case Visibility.public:
            icon = <GlobalOutlined />;
            break;
        default:
            icon = <BookOutlined />;
            break;
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key={Visibility.private} icon={<BookOutlined />}>
                Private
            </Menu.Item>
            <Menu.Item key={Visibility.public} icon={<GlobalOutlined />}>
                Public
            </Menu.Item>
            <Menu.Item key="add_owner" icon={<ProfileOutlined />}>
                Add owner
            </Menu.Item>
        </Menu>
    );

    let elt;
    switch (element) {
        case "button":
            elt = <ActionButton title="Change sharing level" icon={icon}>Sharing</ActionButton>
            break;
            
            case "menu":
            elt = <Menu.Item key="subscription" title="Change sharing level" icon={icon}>Sharing</Menu.Item>
            break;
    }

    return (
        <Dropdown overlay={menu}>
            {elt}
        </Dropdown>
    )
}