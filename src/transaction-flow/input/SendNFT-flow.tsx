import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Dialog, Input, Select, mq } from '@ensdomains/thorin'

import { BackButton, NextButton } from '@app/components/Awns/Dialog'

import { TransactionDialogPassthrough } from '../types'

export type SendAddressProps = {
  address: string | undefined
}
export type Props = {
  data: SendAddressProps
} & TransactionDialogPassthrough
const Label = styled.p`
  color: #3f5170;
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
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;

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

const SendNFT = ({ data: { address }, onDismiss }: Props) => {
  console.log('address=>', address)
  const [receiveAddress, setReceiveAddress] = useState<string>('')
  const [senToken, setSenToken] = useState<string>('')
  const SendNFTCallback = () => {
    console.log(1)
    onDismiss()
  }

  return (
    <>
      <Dialog.Heading title="Send Assets" />
      <Container>
        <Label>Receive Address</Label>
        <CodeInput
          hideLabel
          label
          placeholder="to Address"
          value={receiveAddress}
          onChange={(e) => setReceiveAddress(e.target.value)}
        />
        <Select
          label="NFT"
          autocomplete
          value={senToken}
          options={[
            { value: '1', label: 'One' },
            { value: '2', label: 'Two' },
            { value: '3', label: 'Three' },
          ]}
          placeholder="Select NFT"
          onChange={(e) => {
            setSenToken(e.target.value)
            console.log('NFT=>', e.target.value)
          }}
        />

        <Row>
          <BackButton onClick={onDismiss}>Close</BackButton>
          <NextButton onClick={() => SendNFTCallback()}>Send</NextButton>
        </Row>
      </Container>
    </>
  )
}
export default SendNFT
