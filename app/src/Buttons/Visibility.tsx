import { BookOutlined, GlobalOutlined, LinkOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../backend";
import { ActionButton } from "../StyledComponents";
import { BoxType, RecipeType, Visibility } from "../types";


interface VisibilityProps {
    recipeId?: string
    boxId?: string
    recipe?: RecipeType
    box?: BoxType
}

export default function VisibilityControl(props: VisibilityProps) {
    const { recipeId, boxId, recipe, box } = props;

    function handleMenuClick(e: any) {
        if (boxId === undefined) {
            return
        }
        let newPrivacy = e.key
        // dispatch({ type: "SET_VISIBILITY", payload: newPrivacy, recipeId, boxId })
        if (recipeId === undefined) {
            updateDoc(doc(db, "boxes", boxId), { visibility: newPrivacy })
        } else {
            updateDoc(doc(db, "boxes", boxId, "recipes", recipeId), { visibility: newPrivacy })
        }
    }

    let visibility: Visibility
    if (recipe !== undefined) {
        visibility = recipe.visibility;
    } else if (box !== undefined) {
        visibility = box.visibility;
    } else {
        visibility = Visibility.private
    }

    let icon;
    switch (visibility) {
        case Visibility.public:
            icon = <GlobalOutlined />;
            break;
        case Visibility.linkable:
            icon = <LinkOutlined />;
            break;
        default:
            icon = <BookOutlined />;
            break;
    }

    const menu = (
        <Menu style={{display: "inline", float: "right"}} onClick={handleMenuClick}>
            <Menu.Item key={Visibility.private} icon={<BookOutlined />}>
                Private
            </Menu.Item>
            <Menu.Item key={Visibility.linkable} icon={<LinkOutlined />}>
                Anyone with a link can read
            </Menu.Item>
            <Menu.Item key={Visibility.public} icon={<GlobalOutlined />}>
                Public
            </Menu.Item>
        </Menu>
    );


    return (
        <Dropdown overlay={menu}>
            <ActionButton title="Change sharing level" style={{ float: "right" }} icon={icon}/>
        </Dropdown>
    )
}