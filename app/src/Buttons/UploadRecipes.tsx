import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { PickBoxModal, SelectBoxContext } from "./PickBoxModal";
import { uploadRecipes } from "../utils";
import styled from "styled-components";

const StyledButton = styled(Button)`
  display: inline;
  float: right;
`


interface UploadProps {
    boxId?: string
    disabled: boolean
}

export default function UploadButton(props: UploadProps) {
    const { boxId: inputBoxId, disabled } = props;
    const [boxId, setBoxId] = useState(inputBoxId)
    const [isModalVisible, setIsModalVisible] = useState(false)

    let contextValue = {
        setIsVisible: setIsModalVisible,
        isVisible: isModalVisible,
        setBoxName: setBoxId,
        boxName: boxId!,
    }

    async function upload() {
        if (boxId === undefined) {
            return // leave the modal visible until something is selected
        }
        setIsModalVisible(false)
        uploadRecipes(boxId)
    }

    function uploadFlow() {
        if (boxId === undefined) {
            setIsModalVisible(true)
        } else {
            upload()
        }
    }

    return (<>
        <SelectBoxContext.Provider value={contextValue}>
            <StyledButton title="Upload recipes" disabled={disabled} onClick={uploadFlow}><UploadOutlined /></StyledButton>
            <PickBoxModal handleOk={upload} />
        </ SelectBoxContext.Provider >
    </>)

}