import { PlusOutlined } from "@ant-design/icons";
import { ActionButton } from "../StyledComponents";
import NewBoxModal from "../Modals/NewBoxModal";
import { useState } from "react";


interface NewProps {
    disabled: boolean
}

export default function NewButton(props: NewProps) {
    const { disabled } = props;
    const [isModalVisible, setIsModalVisible] = useState(false)

    return (<>
            <ActionButton title="Create new recipe" disabled={disabled} onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />} />
            <NewBoxModal isVisible={isModalVisible} setIsVisible={setIsModalVisible}/>
    </>)

}