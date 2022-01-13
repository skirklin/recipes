import { BookOutlined, GlobalOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { ActionButton } from "../StyledComponents";
import AddOwnerButton from '../Buttons/AddOwner'
import { Visibility } from "../types";


interface VisibilityProps {
    element: "menu" | "button"
    disabled?: boolean
    value: Visibility
    handleChange: (e: { key: string }) => void
    handleAddOwner: (newOwnerEmail: string) => void
}

export default function VisibilityControl(props: VisibilityProps) {
    const { element, value, handleChange, disabled, handleAddOwner } = props;
    let icon;
    switch (value) {
        case Visibility.public:
            icon = <GlobalOutlined />;
            break;
        default:
            icon = <BookOutlined />;
            break;
    }

    const menu = (
        <Menu>
            <Menu.Item onClick={e => handleChange(e)} key={Visibility.private} icon={<BookOutlined />}>
                Private
            </Menu.Item>
            <Menu.Item onClick={e => handleChange(e)} key={Visibility.public} icon={<GlobalOutlined />}>
                Public
            </Menu.Item>
            <AddOwnerButton element="menu" handleOk={handleAddOwner} />
        </Menu>
    );

    let elt;
    switch (element) {
        case "button":
            elt = <ActionButton disabled={disabled} title="Change sharing level" icon={icon}>Sharing</ActionButton>
            break;

        case "menu":
            elt = <Menu.Item disabled={disabled} key="subscription" title="Change sharing level" icon={icon}>Sharing</Menu.Item>
            break;
    }

    return (
        <Dropdown disabled={disabled} overlay={menu}>
            {elt}
        </Dropdown>
    )
}