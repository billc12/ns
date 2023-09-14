import { useState } from 'react'

import Dialog from '.'
import LabelInput from '../LabelInput'

const TransferDialog = () => {
  const [address, setAddress] = useState('')
  return (
    <Dialog title="Transfer AWNS" okBtnTitle="Transfer" okFn={() => {}}>
      <LabelInput
        value={address}
        label="To address / domain"
        onChange={(e: string) => setAddress(e)}
      />
    </Dialog>
  )
}
export default TransferDialog
