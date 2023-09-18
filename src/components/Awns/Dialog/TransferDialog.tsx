import { useState } from 'react'

import { useNameDetails } from '@app/hooks/useNameDetails'

import LabelInput from '../LabelInput'
import Dialog from './index'

const TransferDialog = ({
  open,
  handleOpen,
  nameDetails,
}: {
  open: boolean
  handleOpen: (open: boolean) => void
  nameDetails: ReturnType<typeof useNameDetails>
}) => {
  const [address, setAddress] = useState('')
  return (
    <Dialog
      open={open}
      handleOpen={handleOpen}
      title="Transfer AWNS"
      okBtnTitle="Transfer"
      okFn={() => {}}
      nameDetails={nameDetails}
    >
      <LabelInput
        value={address}
        label="To address / domain"
        onChange={(e: string) => setAddress(e)}
      />
    </Dialog>
  )
}
export default TransferDialog
