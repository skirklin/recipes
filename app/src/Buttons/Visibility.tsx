import { BookOutlined, GlobalOutlined, ProfileOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { ActionButton } from "../StyledComponents";
import { Visibility } from "../types";


interface VisibilityProps {
    element: "menu" | "button"
    disabled?: boolean
    value: Visibility
    handleChange: (e: {key: string}) => void
}

export default function VisibilityControl(props: VisibilityProps) {
    const { element, value, handleChange, disabled } = props;
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
        <Menu onClick={handleChange}>
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