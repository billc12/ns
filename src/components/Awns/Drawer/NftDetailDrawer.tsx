import { useMemo, useState } from 'react'
import styled from 'styled-components'

import Img1 from '@app/assets/nameDetail/img1.png'
import AttributeLabel from '@app/components/AttributeLabel'
import TransferNFT from '@app/components/pages/profile/nameDetail/children/transferNFT'
import {
  AuctionBtn,
  AuctionTitle,
} from '@app/components/pages/profile/nameDetail/components/nameInfo'
import { ShowErrImg } from '@app/components/showErrImg'
import { useSBTIsDeployList } from '@app/hooks/useCheckAccountDeployment'
import { useGetNftOwner } from '@app/hooks/useGetNftOwner'

import DrawerModel from '.'

type Props = {
  open: boolean
  onClose: () => void
  item: any
  accountAddress: string
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

const NftDetailDrawer = ({ open, onClose, item, accountAddress }: Props) => {
  const [showInput, setShowInput] = useState(false)
  const { owner } = useGetNftOwner(item.owner ? '' : item.token_id || '')
  const isOwner = useMemo(() => {
    return (item.owner || owner) === accountAddress
  }, [accountAddress, item.owner, owner])
  console.log('isOwner', isOwner)
  const isDeploy = useSBTIsDeployList(
    item.contract_address ? [item.contract_address] : undefined,
    item.token_id ? [item.token_id] : undefined,
  )?.[0]
  console.log('isDeploy', isDeploy)
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
  const actionBtns = useMemo(() => {
    const btnList = []
    // if (isOwner) {
    btnList.push(
      <AuctionBtn onClick={handleShowInput}>
        <AuctionTitle>Transfer</AuctionTitle>
      </AuctionBtn>,
    )
    // }
    // if (!isDeploy && isOwner) {
    // btnList.push(
    //   <AuctionBtn>
    //     <AuctionTitle>Deploy NFT-Wrapped Wallet</AuctionTitle>
    //   </AuctionBtn>,
    // )
    // }
    // if (isDeploy) {
    btnList.push(
      <>
        <AuctionBtn>
          <AuctionTitle>View on Explore</AuctionTitle>
        </AuctionBtn>
        <AuctionBtn>
          <AuctionTitle>View on Opensea</AuctionTitle>
        </AuctionBtn>
      </>,
    )
    // }
    return btnList
  }, [])
  console.log('actionBtns', actionBtns)

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
      {showInput && <TransferNFT onClose={handleCloseInput} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 15 }}>
        <AttributeLabel title="Contract address" content={item.contract_address} isCopy />
        <AttributeLabel title="Token ID" content={item.token_id} isCopy />
        <AttributeLabel title="Chain" content="Ethereum" />
        <AttributeLabel title="Token Standard" content={switchErcType(item.erc_type)} isCopy />
      </div>
    </DrawerModel>
  )
}
export default NftDetailDrawer
