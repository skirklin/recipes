import { Modal, Select } from 'antd';
import { DocumentReference } from 'firebase/firestore';

import { useContext, useEffect, useState } from 'react';
import NewButton from '../Buttons/NewBox';
import { Context } from '../context';
import { BoxEntry } from '../storage';
import { BoxId } from '../types';

type OptionsType = { value: string, label: string }

interface SelectBoxProps {
  setBoxId: (value: string) => void
  boxId: BoxId
  disableBoxes?: BoxId[]
}

function SelectBox(props: SelectBoxProps) {
  const { setBoxId, boxId, disableBoxes } = props;
  const { state } = useContext(Context)

  const boxOptions: OptionsType[] = [];
  for (const [key, box] of state.boxes.entries()) {
    if (disableBoxes && disableBoxes.includes(key)) {
      continue
    } else {
      boxOptions.push(
        { label: box.data.name, value: key }
      )
    }
  }

  const defaultBoxId = boxOptions.length > 0 ? boxOptions[0].value : ""
  useEffect(() => {
    setBoxId(defaultBoxId)
  }, [state, defaultBoxId, setBoxId]
  )
  if (boxOptions.length === 0) {
    return <div>No boxes found, please create a new box.</div>
  }
  return (
    <Select
      style={{ width: "300px" }}
      autoFocus
      value={boxId}
      onChange={setBoxId}
      disabled={boxOptions.length === 0}
      options={boxOptions}
    />
  )
}

interface PickBoxModalProps {
  handleOk: (boxId: BoxId) => void
  isVisible: boolean
  setIsVisible: (visible: boolean) => void
  disableBoxes?: BoxId[]
}

export function PickBoxModal(props: PickBoxModalProps) {
  const { handleOk, isVisible, setIsVisible, disableBoxes } = props;
  const [boxId, setBoxId] = useState("")

  const afterNewBox = (boxRef: DocumentReference<BoxEntry>) => {
    setBoxId(boxRef.id)
  }

  return (
    <Modal destroyOnClose={true} visible={isVisible} onOk={() => { handleOk(boxId) }} onCancel={() => setIsVisible(false)}>
      <SelectBox setBoxId={setBoxId} boxId={boxId} disableBoxes={disableBoxes} />
      <NewButton disabled={false} afterNewBox={afterNewBox} />
    </Modal >
  );
}