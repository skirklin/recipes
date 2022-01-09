import { useState } from "react";
import { PickBoxModal } from "../Modals/PickBoxModal";
import ImportModal from "../Modals/ImportModal";
import { ImportOutlined } from "@ant-design/icons";
import { ActionButton } from "../StyledComponents";
import { BoxId } from "../types";

interface ImportProps {
    boxId?: string
    disabled: boolean
}

export default function ImportButton(props: ImportProps) {
    const { boxId: inputBoxId, disabled } = props;
    const [boxId, setBoxId] = useState(inputBoxId)
    const [isImportVisible, setIsImportVisible] = useState(false)
    const [isPickBoxVisible, setIsPickBoxVisible] = useState(false)

    function handlePickBox(boxId: BoxId) {
        setBoxId(boxId);
        setIsPickBoxVisible(false);
        importFlow()
    }

    function importFlow() {
        if (boxId === undefined) {
            setIsPickBoxVisible(true)
        } else {
            setIsImportVisible(true)
        }
    }
    if (boxId === undefined) {
        return (<>
            <ActionButton title="Import recipes by URL" onClick={importFlow} disabled={disabled} icon={<ImportOutlined />} />
            <PickBoxModal setIsVisible={setIsPickBoxVisible} isVisible={isPickBoxVisible} handleOk={handlePickBox} />
        </>)
    } else {
        return (<>
            <ImportModal boxId={boxId} setIsVisible={setIsImportVisible} isVisible={isImportVisible} />
            <ActionButton title="Import recipes by URL" onClick={importFlow} disabled={disabled} icon={<ImportOutlined />} />
        </>)
    }
}