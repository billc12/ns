import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Dialog, Input, Skeleton, mq } from '@ensdomains/thorin'

import { BackButton, NextButton } from '@app/components/Awns/Dialog'
import { useBasicName } from '@app/hooks/useBasicName'

import { TransactionDialogPassthrough } from '../types'

export type TInvitationName = {
  setNameCallback: (v: string) => void
  name: string
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
  ${mq.sm.max(css`
    width: 100%;
  `)}
`
const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-top: 50px;
  ${mq.sm.max(css`
    margin-top: 30px;
  `)}
`
const Title = styled.p`
  color: #3f5170;

  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 152.523%; /* 21.353px */
`
const ErrTip = styled.p`
  color: #f00;

  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150.5%; /* 24.08px */
`
const InvitationName = ({ data: { setNameCallback, name }, onDismiss }: Props) => {
  const [nameInp, setNameInp] = useState(name)
  const { registrationStatus, isLoading } = useBasicName(nameInp)
  const isUse = registrationStatus === 'registered'
  const saveName = () => {
    setNameCallback(nameInp)
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
        <Skeleton loading={isLoading} style={{ minWidth: 120, height: 20 }}>
          {!isUse && registrationStatus && <ErrTip>The AWNS name is invalid</ErrTip>}{' '}
        </Skeleton>
        <Title>
          Signing up for AWNS with an invitation code entitles the inviter and invitee to a 10%
          commission bonus on ETH, respectively.
        </Title>
        <Row>
          <BackButton onClick={onDismiss}>Close</BackButton>
          <NextButton
            onClick={saveName}
            disabled={!nameInp || !isUse || !registrationStatus || isLoading}
          >
            Save
          </NextButton>
        </Row>
      </Container>
    </>
  )
}
export default InvitationName
