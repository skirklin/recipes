import { Modal, Select } from 'antd';
import { DocumentReference } from 'firebase/firestore';

import { useContext, useEffect, useState } from 'react';
import NewButton from '../Buttons/NewBox';
import { Context } from '../context';
import { BoxEntry } from '../storage';

type OptionsType = { value: string, label: string }

interface SelectBoxProps {
  setBoxId: (value: string) => void
  boxId: string
}

function SelectBox(props: SelectBoxProps) {
  const { setBoxId, boxId } = props;
  const { state } = useContext(Context)

  const boxOptions: OptionsType[] = [];
  for (const [key, value] of state.boxes.entries()) {
    boxOptions.push(
      { label: value.data.name, value: key }
    )
  }

  const defaultBoxId = boxOptions[0].value
  useEffect(() => {
    setBoxId(defaultBoxId)
  }, [state, defaultBoxId, setBoxId]
  )
  if (boxOptions.length === 0) {
    return <div>No boxes found, please create a new box.</div>
  }
  return <Select style={{ width: "300px" }} autoFocus value={boxId} onChange={setBoxId} options={boxOptions} />
}

interface PickBoxModalProps {
  handleOk: (boxId: string) => void
  isVisible: boolean
  setIsVisible: (visible: boolean) => void
}

export function PickBoxModal(props: PickBoxModalProps) {
  const { handleOk, isVisible, setIsVisible } = props;
  const [boxId, setBoxId] = useState("")

  const afterNewBox = (boxRef: DocumentReference<BoxEntry>) => {
    setBoxId(boxRef.id)
  }

  return (
    <Modal destroyOnClose={true} visible={isVisible} onOk={() => { handleOk(boxId) }} onCancel={() => setIsVisible(false)}>
      <SelectBox setBoxId={setBoxId} boxId={boxId} />
      <NewButton disabled={false} afterNewBox={afterNewBox} />
    </Modal >
  );
}