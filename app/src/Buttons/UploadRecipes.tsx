import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { PickBoxModal, SelectBoxContext } from "./PickBoxModal";
import { uploadRecipes } from "../utils";

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
            <Button disabled={disabled} onClick={uploadFlow}><UploadOutlined /></Button>
            <PickBoxModal handleOk={upload} />
        </ SelectBoxContext.Provider >
    </>)

}