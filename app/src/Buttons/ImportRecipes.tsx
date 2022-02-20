import { useState } from "react";
import { PickBoxModal } from "../Modals/PickBoxModal";
import ImportModal from "../Modals/ImportModal";
import { ImportOutlined } from "@ant-design/icons";
import { ActionButton } from "../StyledComponents";
import { BoxId } from "../types";
import { Menu } from "antd";

interface ImportProps {
    boxId?: string
    disabled: boolean
    element: "menu" | "button"
}

export default function ImportButton(props: ImportProps) {
    const { boxId: inputBoxId, disabled, element } = props;
    const [boxId, setBoxId] = useState(inputBoxId)
    const [isImportVisible, setIsImportVisible] = useState(false)
    const [isPickBoxVisible, setIsPickBoxVisible] = useState(false)

    function handlePickBox(boxId: BoxId) {
        setBoxId(boxId);
        setIsPickBoxVisible(false);
        setIsImportVisible(true);
    }

    let elt;
    switch (element) {
        case "button":
            elt = <ActionButton onClick={importFlow} title="Import recipe by URL" icon={<ImportOutlined />} disabled={disabled} >
                Import
            </ActionButton>
            break;
        case "menu":
            elt = <Menu.Item key="import" onClick={importFlow} title="Import recipe by URL" icon={<ImportOutlined />} disabled={disabled} >
                Import
            </Menu.Item>
            break;
    }



    function importFlow() {
        if (boxId === undefined) {
            setIsPickBoxVisible(true)
        } else {
            setIsImportVisible(true)
        }
    }
    return (<>
        {elt}
        <PickBoxModal setIsVisible={setIsPickBoxVisible} isVisible={isPickBoxVisible} handleOk={handlePickBox} />
        <ImportModal boxId={boxId} setIsVisible={setIsImportVisible} isVisible={isImportVisible} />
    </>)
}