import { Modal, Select } from 'antd';

import { useContext, useEffect, useState } from 'react';
import { Context } from '../context';
import NewBoxModal from './NewBoxModal';

interface SelectBoxProps {
  setBoxId: (value: string) => void
}

function SelectBox(props: SelectBoxProps) {
  const { setBoxId } = props;
  const { state } = useContext(Context)

  let boxIds: string[] = [];
  for (let k of state.boxes.keys()) {
    boxIds.push(k)
  }

  let boxOptions;
  if (boxIds.length > 0) {
    boxOptions = boxIds.map(bi => ({ label: state.boxes.get(bi)!.data.name, value: bi }))
  } else {
    boxOptions = [{ label: "", value: "" }]
  }
  let defaultBoxId = boxOptions[0].value
  useEffect(() => {
    setBoxId(defaultBoxId)
  }, [state, defaultBoxId, setBoxId]
  )
  if (boxIds.length === 0) {
    return <div>No boxes found, please create a new box.</div>
  }
  return <Select style={{ width: "300px" }} autoFocus defaultValue={defaultBoxId} onChange={setBoxId} options={boxOptions} />
}

interface PickBoxModalProps {
  handleOk: (boxId: string) => void
  isVisible: boolean
  setIsVisible: (visible: boolean) => void
}

export function PickBoxModal(props: PickBoxModalProps) {
  const { handleOk, isVisible, setIsVisible } = props;
  const [boxId, setBoxId] = useState("")
  const [isNewBoxModalVisible, setIsNewBoxModalVisible] = useState(false)

  return (
    <Modal destroyOnClose={true} visible={isVisible} onOk={() => { handleOk(boxId) }} onCancel={() => setIsVisible(false)}>
      <SelectBox setBoxId={setBoxId} />
      <NewBoxModal isVisible={isNewBoxModalVisible} setIsVisible={setIsNewBoxModalVisible} />
    </Modal >
  );
}