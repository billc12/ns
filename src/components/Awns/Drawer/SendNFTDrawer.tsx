import { isAddress } from '@ethersproject/address'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Input, Select, mq } from '@ensdomains/thorin'

import placeholder from '@app/assets/placeholder.png'
import { NextButton } from '@app/components/Awns/Dialog'
import { useGetUserAllNFT } from '@app/hooks/requst/useGetUserNFT'
import { useTransferNFT } from '@app/hooks/transfer/useTransferNFT'
import { useChainId } from '@app/hooks/useChainId'

import DrawerModel from '.'

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

const Page = ({
  address,
  open,
  onClose,
}: {
  address: string
  open: boolean
  onClose: () => void
}) => {
  // const { nftId, contractAddress } = useNameErc721Assets(address)

  const chainId = useChainId()
  const { data: list } = useGetUserAllNFT({ account: address, chainId })
  const [receiveAddress, setReceiveAddress] = useState<any>('')
  const [senNFT, SetSenNFT] = useState<any>('')
  // const { data } = useGetUserNFT({
  //   name: name || '',
  // })
  const { callback, loading } = useTransferNFT({
    account: address as `0x${string}`,
    tokenType: 'ERC721',
    tokenContract: senNFT.contract_address as `0x${string}`,
    tokenId: senNFT.token_id,
    recipientAddress: receiveAddress as `0x${string}`,
  })
  console.log('data=>', list)

  return (
    <DrawerModel open={open} onClose={onClose} title="Send Assets">
      <Container />
      <Label>To Account</Label>
      <CodeInput
        hideLabel
        label
        placeholder="Ethereum address(0x) or ENS"
        value={receiveAddress}
        onChange={(e) => setReceiveAddress(e.target.value)}
      />

      <Label>Assets</Label>

      <SelectStyle
        label=""
        autocomplete
        value={senNFT}
        options={
          list?.length
            ? list?.map((item) => {
                return {
                  value: item,
                  label: ` ${item.name || item.contract_name} - # ${item.token_id}`,
                  prefix: (
                    <div
                      key={item.toString()}
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
          SetSenNFT(e.target.value)
          console.log('checkToken=>', e.target.value)
        }}
      />

      <Row>
        <NextButton
          disabled={!senNFT || !receiveAddress || !isAddress(receiveAddress) || loading}
          loading={loading}
          onClick={() => callback()}
        >
          Send
        </NextButton>
      </Row>
    </DrawerModel>
  )
}
export default Page
