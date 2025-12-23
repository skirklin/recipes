import { BookOutlined, GlobalOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { ActionButton } from "../StyledComponents";
import { Visibility } from "../types";
import { useState, useContext } from "react";
import { Context } from "../context";
import { AddOwnerModal } from "../Modals/AddOwnerModal";
import { MenuProps } from "antd";

interface VisibilityProps {
    element: "menu" | "button"
    disabled?: boolean
    value: Visibility
    handleChange: (e: { key: string }) => void
    handleAddOwner: (newOwnerEmail: string) => void
}

export default function VisibilityControl(props: VisibilityProps) {
    const { element, value, handleChange, disabled, handleAddOwner } = props;
    const { state } = useContext(Context);
    const [isAddOwnerVisible, setIsAddOwnerVisible] = useState(false);

    let icon;
    switch (value) {
        case Visibility.public:
            icon = <GlobalOutlined />;
            break;
        default:
            icon = <BookOutlined />;
            break;
    }

    const menuItems: MenuProps['items'] = [
        value === Visibility.public
            ? {
                key: Visibility.private,
                icon: <BookOutlined />,
                label: 'Make private',
                onClick: () => handleChange({ key: Visibility.private }),
            }
            : {
                key: Visibility.public,
                icon: <GlobalOutlined />,
                label: 'Make visible',
                onClick: () => handleChange({ key: Visibility.public }),
            },
    ];

    // Only add the "Add owner" option if writeable
    if (state.writeable) {
        menuItems.push({
            key: 'addOwner',
            icon: <ShareAltOutlined />,
            label: 'Add owner',
            onClick: () => setIsAddOwnerVisible(true),
        });
    }

    let elt;
    switch (element) {
        case "button":
            elt = <ActionButton disabled={disabled} title="Change sharing level" icon={icon}>Sharing</ActionButton>
            break;

        case "menu":
            elt = <span title="Change sharing level">{icon} Sharing</span>
            break;
    }

    return (
        <>
            <Dropdown disabled={disabled} menu={{ items: menuItems }}>
                {elt}
            </Dropdown>
            <AddOwnerModal
                isVisible={isAddOwnerVisible}
                setIsVisible={setIsAddOwnerVisible}
                handleOk={handleAddOwner}
            />
        </>
    )
}
