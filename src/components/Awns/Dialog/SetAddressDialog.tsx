import { useState } from 'react'
import styled from 'styled-components'

import Dialog from '.'
import LabelInput from '../LabelInput'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const SetAddressDialog = () => {
  const [address, setAddress] = useState('')
  return (
    <Dialog title="Set AWNS Address" okBtnTitle="Save" okFn={() => {}}>
      <Column>
        <LabelInput
          value="0x6621086b3beea1e7c780de6ad249b41fa32ae908"
          label="Connected Address"
          readOnly
          isActive
          isShowIcon
        />
        <LabelInput
          value="0x6621086b3beea1e7c780de6ad249b41fa32ae908"
          label="Connected Address"
          readOnly
        />
        <LabelInput
          value={address}
          label="Connected Address"
          onChange={(e: string) => setAddress(e)}
        />
      </Column>
    </Dialog>
  )
}
export default SetAddressDialog
