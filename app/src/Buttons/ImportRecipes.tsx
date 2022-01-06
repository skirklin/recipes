import { Button } from "antd";
import { useState } from "react";
import { PickBoxModal } from "../Modals/PickBoxModal";
import ImportModal from "../Modals/ImportModal";
import styled from "styled-components";
import { ImportOutlined } from "@ant-design/icons";


const StyledButton = styled(Button)`
  display: inline;
  float: right;
`

interface ImportProps {
    boxId?: string
    disabled: boolean
}

export default function ImportButton(props: ImportProps) {
    const { boxId: inputBoxId, disabled } = props;
    const [boxId, setBoxId] = useState(inputBoxId)
    const [isImportVisible, setIsImportVisible] = useState(false)
    const [isPickBoxVisible, setIsPickBoxVisible] = useState(false)

    function handlePickBox(boxId: string) {
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

    return (<>
        <PickBoxModal setIsVisible={setIsPickBoxVisible} isVisible={isPickBoxVisible} handleOk={handlePickBox} />
        <ImportModal boxId={boxId} setIsVisible={setIsImportVisible} isVisible={isImportVisible} />
        <StyledButton onClick={importFlow} disabled={disabled} icon={<ImportOutlined />}/>
    </>
    )
}