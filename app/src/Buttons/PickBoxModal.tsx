import { Modal, Select } from 'antd';

import { createContext, useContext, useEffect } from 'react';
import { Context } from '../context';

const defaultValue = {
  isVisible: false,
  setIsVisible: (isVisible: boolean) => { },
  boxName: "",
  setBoxName: (boxName: string) => { }
} // should never be used, just for declaration

export const SelectBoxContext = createContext(defaultValue)

function SelectBox() {
  const { state } = useContext(Context)
  const { boxName, setBoxName } = useContext(SelectBoxContext)

  let boxNames: string[] = [];
  for (let k of state.boxes.keys()) {
    boxNames.push(k)
  }

  let boxOptions;
  if (boxNames.length > 0) {
    boxOptions = boxNames.map(bn => ({ label: state.boxes.get(bn)!.data.name, value: bn }))
  } else {
    boxOptions = [{ label: "", value: "" }]
  }
  useEffect(() => {
    if (boxNames.length > 0 && boxName === undefined) {
      setBoxName(boxNames[0])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Select value={boxName} onChange={setBoxName} options={boxOptions} />
}

interface PickBoxModalProps {
  handleOk: () => void
}


export function PickBoxModal(props: PickBoxModalProps) {
  const { handleOk } = props;
  const { isVisible, setIsVisible } = useContext(SelectBoxContext)

  return (
    <>
      <Modal visible={isVisible} onOk={handleOk} onCancel={() => setIsVisible(false)}>
        <SelectBox />
      </Modal >
    </>
  );
}