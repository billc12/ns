// import { useState } from 'react'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import { useNameDetails } from '@app/hooks/useNameDetails'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { shortenAddress } from '@app/utils/utils'

import LabelInput from '../LabelInput'
import Dialog from './index'

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
  ${mq.sm.max(css`
    padding: 0;
  `)}
`
const SetAddressDialog = ({
  open,
  handleOpen,
  nameDetails,
  address,
  submit,
}: {
  open: boolean
  handleOpen: (open: boolean) => void
  nameDetails: ReturnType<typeof useNameDetails>
  address?: `0x${string}`
  submit?: () => void
}) => {
  const breakpoints = useBreakpoint()
  const isSmDown = useMemo(() => {
    if (breakpoints.sm) {
      return false
    }
    return true
  }, [breakpoints.sm])
  // const [address, setAddress] = useState('')
  return (
    <Dialog
      open={open}
      handleOpen={handleOpen}
      title="Set AWNS Address"
      nameDetails={nameDetails}
      okBtnTitle="Save"
      okFn={() => {
        if (submit) {
          handleOpen(false)
          submit()
        }
      }}
    >
      <Column>
        <LabelInput
          value={isSmDown ? shortenAddress(address) : address || '--'}
          label="Connected Address"
          readOnly
          isActive
          isShowIcon
        />
        {/* <LabelInput
          value="0x6621086b3beea1e7c780de6ad249b41fa32ae908"
          label="Connected Address"
          readOnly
        />
        <LabelInput
          value={address}
          label="Connected Address"
          onChange={(e: string) => setAddress(e)}
        /> */}
      </Column>
    </Dialog>
  )
}
export default SetAddressDialog
