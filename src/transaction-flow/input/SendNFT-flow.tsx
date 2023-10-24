import { isAddress } from '@ethersproject/address'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Dialog, Input, Select, mq } from '@ensdomains/thorin'

import placeholder from '@app/assets/placeholder.png'
import { BackButton, NextButton } from '@app/components/Awns/Dialog'
import useGetUserNFT from '@app/hooks/requst/useGetUserNFT'
import { useNameErc721Assets } from '@app/hooks/useNameDetails'

import { TransactionDialogPassthrough } from '../types'

export type SendAddressProps = {
  address: string | undefined
  name: string | undefined
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
const StyledImg = styled.img(
  () => css`
    width: 30px;
    height: 30px;
    border-radius: 50%;
  `,
)

const SelectStyle = styled(Select)`
  button {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 480px;
  }
`

const SendNFT = ({ data: { address, name }, onDismiss }: Props) => {
  console.log('address=>', address)
  const { nftId } = useNameErc721Assets(address)

  const [receiveAddress, setReceiveAddress] = useState<string>('')
  const [senNFTId, SetSenNFTId] = useState<string>('')
  const { data } = useGetUserNFT({
    name: name || '',
  })

  console.log('data=>', name, data)
  const SendTokenCallback = () => {
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

        <Label>Select NFT</Label>

        <SelectStyle
          label=""
          autocomplete
          value={senNFTId}
          options={
            nftId
              ? nftId?.map((item) => {
                  return {
                    value: item,
                    label: `${'NftName' || '-'} #${item} `,
                    prefix: (
                      <div
                        key={item}
                        style={{ height: '100%', display: 'flex', alignItems: 'center' }}
                      >
                        <StyledImg src={placeholder.src} />
                      </div>
                    ),
                  }
                })
              : []
          }
          placeholder="Select Token"
          onChange={(e) => {
            SetSenNFTId(e.target.value)
            console.log('checkToken=>', e.target.value)
          }}
        />
        {/* <SelectStyle
          label=""
          autocomplete
          value={senNFTHash}
          options={
            data
              ? data.content.map((item) => {
                  return {
                    value: item.mint_transaction_hash,
                    label: `${item?.name || item?.contract_name || '-'} #${item?.token_id} `,
                    prefix: (
                      <div
                        key={item.id}
                        style={{ height: '100%', display: 'flex', alignItems: 'center' }}
                      >
                        <StyledImg src={item.image_uri || placeholder.src} />
                      </div>
                    ),
                  }
                })
              : []
          }
          placeholder="Select Token"
          onChange={(e) => {
            SetSenNFTHash(e.target.value)
            console.log('checkToken=>', e.target.value)
          }}
        /> */}

        <Row>
          <BackButton onClick={onDismiss}>Close</BackButton>
          <NextButton
            disabled={!senNFTId || !receiveAddress || !isAddress(receiveAddress)}
            onClick={() => SendTokenCallback()}
          >
            Send
          </NextButton>
        </Row>
      </Container>
    </>
  )
}
export default SendNFT
