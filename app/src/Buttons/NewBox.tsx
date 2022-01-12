import { PlusOutlined } from "@ant-design/icons";
import { ActionButton } from "../StyledComponents";
import NewBoxModal from "../Modals/NewBoxModal";
import { useState } from "react";
import { BoxEntry } from "../storage";
import { DocumentReference } from "firebase/firestore";


interface NewProps {
    disabled: boolean
    afterNewBox?: (box: DocumentReference<BoxEntry>) => void
}

export default function NewButton(props: NewProps) {
    const { disabled, afterNewBox } = props;
    const [isModalVisible, setIsModalVisible] = useState(false)

    return (<>
        <ActionButton title="Create new box." disabled={disabled} onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />} />
        <NewBoxModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} afterNewBox={afterNewBox} />
    </>)

}