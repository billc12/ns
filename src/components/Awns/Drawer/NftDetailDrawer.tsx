import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useChainId } from 'wagmi'

import Img1 from '@app/assets/nameDetail/img1.png'
import AttributeLabel from '@app/components/AttributeLabel'
import TransferNFT from '@app/components/pages/profile/nameDetail/children/transferNFT'
import {
  AuctionBtn,
  AuctionTitle,
} from '@app/components/pages/profile/nameDetail/components/nameInfo'
import { ShowErrImg } from '@app/components/showErrImg'
import { ChainId } from '@app/hooks/useChainId'
// import { erc721ContractAddress } from '@app/utils/constants'
import { useSBTIsDeployList } from '@app/hooks/useCheckAccountDeployment'
import { useCreateAccount } from '@app/hooks/useCreateAccount'
import { useGetNftOwner } from '@app/hooks/useGetNftOwner'
import { getEtherscanLink } from '@app/utils'

import DrawerModel from '.'

type Props = {
  open: boolean
  onClose: () => void
  item: any
  accountAddress: string
  nameOwner: boolean
}
const ImgRound = styled.div`
  width: max-content;
  height: max-content;
  margin: 0 auto;
  padding: 18px;
  border-radius: 10px;
  background: #f8fbff;
  & > img {
    width: 346px;
    height: 346px;
    border-radius: 8px;
  }
`
const Title = styled.p`
  color: #3f5170;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`
const BtnContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 14px;
  & > button {
    flex: 1;
    &:hover {
      background: #f7fafc;
    }
  }
  & > .deploy {
    flex: 2;
    border-radius: 8px;
    & p {
      color: #fff;
    }

    &,
    &:hover {
      background: linear-gradient(91deg, #7996fd 14.65%, #65cefc 97.7%);
    }
  }
`
const switchErcType = (v: string) => {
  switch (v) {
    case 'erc6551':
      return 'ERC-6551'
    case 'erc1155':
      return 'ERC-1155'
    default:
      return 'ERC-721'
  }
}

const NftDetailDrawer = ({ open, onClose, item, accountAddress, nameOwner }: Props) => {
  const [showInput, setShowInput] = useState(false)
  const chainId = useChainId()
  const { owner } = useGetNftOwner(item.token_id, item.contract_address)
  const isOwner = useMemo(() => {
    return (
      (owner?.toLowerCase() || item.owner?.toLowerCase()) === accountAddress.toLowerCase() &&
      nameOwner
    )
  }, [accountAddress, item.owner, nameOwner, owner])
  const isDeploy = useSBTIsDeployList(
    item.contract_address ? [item.contract_address] : undefined,
    item.token_id ? [item.token_id] : undefined,
  )?.[0]

  console.log('isDeploy', owner)
  const { callback: createAccountCallback, loading } = useCreateAccount(
    item.contract_address,
    item.token_id,
  )
  const handleShowInput = () => {
    setShowInput(true)
  }
  const handleCloseInput = () => {
    setShowInput(false)
  }
  const closeDrawer = () => {
    onClose()
    handleCloseInput()
  }

  const isMainNet = useMemo(() => {
    if (chainId && chainId === ChainId.MAINNET) return true
    return false
  }, [chainId])

  const actionBtns = useMemo(() => {
    const btnList = []
    if (isOwner) {
      btnList.push(
        <AuctionBtn onClick={handleShowInput}>
          <AuctionTitle>Transfer</AuctionTitle>
        </AuctionBtn>,
      )
    }
    if (!isDeploy && isOwner) {
      btnList.push(
        <AuctionBtn
          disabled={loading}
          loading={loading}
          className="deploy"
          onClick={() => createAccountCallback?.()}
        >
          <AuctionTitle>Deploy NFT-Wrapped Wallet</AuctionTitle>
        </AuctionBtn>,
      )
    }
    if (isDeploy) {
      btnList.push(
        <>
          <AuctionBtn
            onClick={() => {
              window.open(getEtherscanLink(chainId, item.mint_transaction_hash, 'transaction'))
            }}
          >
            <AuctionTitle>View on Explore</AuctionTitle>
          </AuctionBtn>
          {isMainNet && (
            <AuctionBtn
              onClick={() => {
                window.open(
                  `https://opensea.io/assets/ethereum/${item.contract_address}/${item.token_id}`,
                )
              }}
            >
              <AuctionTitle>View on Opensea</AuctionTitle>
            </AuctionBtn>
          )}
        </>,
      )
    }
    return btnList
  }, [
    chainId,
    createAccountCallback,
    isDeploy,
    isMainNet,
    isOwner,
    item.contract_address,
    item.mint_transaction_hash,
    item.token_id,
    loading,
  ])

  return (
    <DrawerModel onClose={closeDrawer} open={open} title="Assets Details">
      <ImgRound>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <ShowErrImg url={item.image_uri} defaultUrl={Img1.src} alt="nft img" />
      </ImgRound>
      <Title style={{ marginTop: 30 }}>
        {item.name || item.contract_name} - #{item.token_id}
      </Title>
      <BtnContainer>{actionBtns}</BtnContainer>
      {showInput && (
        <TransferNFT onClose={handleCloseInput} accountAddress={accountAddress} item={item} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 15 }}>
        <AttributeLabel
          key="Contract address"
          title="Contract address"
          content={item.contract_address}
          isCopy
        />
        <AttributeLabel key="Token ID" title="Token ID" content={item.token_id} isCopy />
        <AttributeLabel key="Chain" title="Chain" content="Ethereum" />
        <AttributeLabel
          key="Token Standard"
          title="Token Standard"
          content={switchErcType(item.erc_type)}
          isCopy
        />
      </div>
    </DrawerModel>
  )
}
export default NftDetailDrawer
