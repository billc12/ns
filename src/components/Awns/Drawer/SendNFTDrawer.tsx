import { isAddress } from '@ethersproject/address'
import { TokenboundClient } from '@tokenbound/sdk'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useChainId, useSigner } from 'wagmi'

import { Input, Select, mq } from '@ensdomains/thorin'

import placeholder from '@app/assets/placeholder.png'
import { NextButton } from '@app/components/Awns/Dialog'
import useGetUserNFT from '@app/hooks/requst/useGetUserNFT'
import { useNameErc721Assets } from '@app/hooks/useNameDetails'

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
  name,
}: {
  address: string
  open: boolean
  onClose: () => void
  name: string
}) => {
  const { nftId, contractAddress } = useNameErc721Assets(address)
  const signer = useSigner()
  const chainId = useChainId()

  const [receiveAddress, setReceiveAddress] = useState<string>('')
  const [senNFTId, SetSenNFTId] = useState<string>('')
  const { data } = useGetUserNFT({
    name: name || '',
  })

  const tokenboundClient = useMemo(
    () =>
      new TokenboundClient({
        signer: signer.data,
        chainId,
        implementationAddress: '0x2d25602551487c3f3354dd80d76d54383a243358',
        registryAddress: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
      }),
    [chainId, signer.data],
  )

  console.log('data=>', nftId, data)
  const SendTokenCallback = async () => {
    await tokenboundClient?.transferNFT({
      account: address as `0x${string}`,
      tokenType: 'ERC721',
      tokenContract: contractAddress as `0x${string}`,
      tokenId: senNFTId,
      recipientAddress: receiveAddress as `0x${string}`,
    })
  }
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
        value={senNFTId}
        options={
          nftId?.length
            ? nftId?.map((item) => {
                return {
                  value: item.toString(),
                  label: `${'NftName' || '-'} #${item} `,
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
          SetSenNFTId(e.target.value)
          console.log('checkToken=>', e.target.value)
        }}
      />

      <Row>
        <NextButton
          disabled={!senNFTId || !receiveAddress || !isAddress(receiveAddress)}
          onClick={() => SendTokenCallback()}
        >
          Send
        </NextButton>
      </Row>
    </DrawerModel>
  )
}
export default Page
