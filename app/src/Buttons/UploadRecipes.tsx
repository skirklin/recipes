import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { PickBoxModal } from "../Modals/PickBoxModal";
import { uploadRecipes } from "../utils";
import { ActionButton } from "../StyledComponents";
import { BoxId } from "../types";


interface UploadProps {
    boxId?: string
    disabled: boolean
}

export default function UploadButton(props: UploadProps) {
    const { boxId, disabled } = props;
    const [isModalVisible, setIsModalVisible] = useState(false)

    async function upload(boxId: BoxId | undefined) {
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
            upload(boxId)
        }
    }

    return (<>
        <ActionButton title="Upload recipes from computer." disabled={disabled} onClick={uploadFlow} icon={<UploadOutlined />} />
        <PickBoxModal handleOk={upload} isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
    </>)

}