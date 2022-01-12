import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { PickBoxModal } from "../Modals/PickBoxModal";
import { uploadRecipes } from "../utils";
import { ActionButton } from "../StyledComponents";
import { BoxId } from "../types";
import { Menu } from "antd";


interface UploadProps {
    boxId?: string
    disabled: boolean
    element: "button" | "menu"
}

export default function UploadButton(props: UploadProps) {
    const { boxId, disabled, element } = props;
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

    let elt;
    switch (element) {
        case "button":
            elt = <ActionButton onClick={uploadFlow} title="Upload recipes from computer." icon={<UploadOutlined />} disabled={disabled} >
                Upload
            </ActionButton>
            break;
        case "menu":
            elt = <Menu.Item onClick={uploadFlow} title="Upload recipes from computer." icon={<UploadOutlined />} disabled={disabled} >
                Upload
            </Menu.Item>
            break;
    }


    return (<>
        {elt}
        <PickBoxModal handleOk={upload} isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
    </>)

}