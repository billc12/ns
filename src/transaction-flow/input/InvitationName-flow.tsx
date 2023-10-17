import { useState } from 'react'
import styled from 'styled-components'

import { Dialog, Input } from '@ensdomains/thorin'

import { BackButton, NextButton } from '@app/components/Awns/Dialog'
import { DisInfo } from '@app/components/pages/profile/[name]/registration/steps/Pricing/Pricing'

import { TransactionDialogPassthrough } from '../types'

export type TInvitationName = {
  setNameCallback: (v: DisInfo) => void

  info: DisInfo
}
export type Props = {
  data: TInvitationName
  // onDismiss?: () => void
} & TransactionDialogPassthrough
const Label = styled.p`
  color: #3f5170;
  /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150.5%;
  margin-bottom: 8px;
`

const CodeInput = styled(Input)`
  width: 100%;
  border-radius: 6px;
  background: #fff;
  color: #d4d7e2;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px; /* 135.714% */

  &:focus-within {
    border: 1px solid #97b7ef;
    color: #3f5170;
  }
`
const Container = styled.div`
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-top: 50px;
`
const Title = styled.p`
  color: #3f5170;

  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 152.523%; /* 21.353px */
`
const InvitationName = ({ data: { setNameCallback, info }, onDismiss }: Props) => {
  const [nameInp, setNameInp] = useState(info.invitationName)

  const saveName = () => {
    setNameCallback({ ...info, invitationName: nameInp, referral: nameInp })
    onDismiss()
  }
  return (
    <>
      <Dialog.Heading title="Invitation AWNS" />
      <Container>
        <Label>Please enter the invitation AWNS</Label>
        <CodeInput
          hideLabel
          label
          placeholder="AWNS"
          value={nameInp}
          onChange={(e) => setNameInp(e.target.value)}
        />

        <Title>
          Signing up for AWNS with an invitation code entitles the inviter and invitee to a 10%
          commission bonus on ETH, respectively.
        </Title>
        <Row>
          <BackButton onClick={onDismiss}>Close</BackButton>
          <NextButton onClick={saveName} disabled={!nameInp}>
            Save
          </NextButton>
        </Row>
      </Container>
    </>
  )
}
export default InvitationName
