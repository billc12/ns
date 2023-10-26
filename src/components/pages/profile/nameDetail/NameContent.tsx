import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, Skeleton, Typography, mq } from '@ensdomains/thorin'

import AssetsIcon from '@app/assets/AssetsIcon.svg'
import ColumnBarIcon from '@app/assets/ColumnBarIcon.svg'
import DownShowicon from '@app/assets/DownShowicon.svg'
import ListWhiteIcon from '@app/assets/List-white.svg'
import OmitIcon from '@app/assets/OmitIcon.svg'
import SwordIcon from '@app/assets/SwordIcon.svg'
import TestImg from '@app/assets/TestImage.png'
import UpDisplayicon from '@app/assets/UpDisplayicon.svg'
import Icon1 from '@app/assets/nameDetail/icon1.svg'
import Icon2 from '@app/assets/nameDetail/icon2.svg'
import Icon3 from '@app/assets/nameDetail/icon3.svg'
import { CopyButton } from '@app/components/Copy'
import { LoadingOverlay } from '@app/components/LoadingOverlay'
// import { useAccountSafely } from '@app/hooks/useAccountSafely'
import useGetNftAddress from '@app/hooks/useGetNftAddress'
import { useNameErc721Assets } from '@app/hooks/useNameDetails'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { shortenAddress } from '@app/utils/utils'

import { useEthInvoice } from '../[name]/registration/steps/Awns_Complete'
// import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Assets } from './children/Assets'
import { Tokens } from './children/Tokens'
import { Traits, Traits2 } from './children/Traits'

const ContentStyle = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  gap: 20px;
  ${mq.sm.max(css`
    display: grid;
    width: 100%;
  `)}
`

const CenterLeftStyle = styled.div`
  border-radius: 10px;
  border: 1px solid var(--line, #d4d7e2);
  background: #fff;
  box-shadow: 0 4px 14px 0 rgba(40, 79, 115, 0.1);
  width: 430px;
  height: 800px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 10px;
  ${mq.sm.max(css`
    width: 100%;
    height: auto;
  `)}
`

const HeaderStyle = styled.div`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
  height: 32px;
`

const OmitButtonStyle = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 6px;
  border: 1px solid #97b7ef;
  background: #f8fbff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
const NameStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 24px;
  font-weight: 700;
`
const TabIconStyle = styled.div`
  width: 58px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 6px;
  border: 1px solid var(--button-line, #97b7ef);
  background: var(--light-bg, #f8fbff);
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 0 4px;
  cursor: pointer;
`

const ListWhiteStyled = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 4px;
  background: var(--button-line, #97b7ef);
  display: flex;
  justify-content: center;
  align-items: center;
`

const ProFileStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`
const StyledImg = styled.img(
  () => css`
    width: 112px;
    height: 112px;
    border-radius: 8px;
  `,
)

const AddressStyle = styled.div`
  width: 180px;
  height: 32px;
  border-radius: 6px;
  background: #f8fbff;
  color: #3f5170;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`

const AssetsItemStyle = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 18px;
  font-weight: 700;
`

const TabTitleBoxStyle = styled.div`
  width: 100%;
  padding: 0 62px 0 85px;
  display: flex;
  align-items: center;
  gap: 62px;
  .tab-title {
    color: var(--tile-grey, #80829f);
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
  .check {
    color: var(--word-color, #3f5170);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }
`

const TokensStyle = styled.div`
  margin-top: 18px;
  max-height: 285px;
  width: 100%;
  display: grid;
  gap: 10px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`

const CenterRightStyle = styled.div`
  border-radius: 10px;
  border: 1px solid #d4d7e2;
  background: #fff;
  box-shadow: 0 4px 14px 0 rgba(40, 79, 115, 0.1);
  width: 750px;
  height: 800px;
  display: flex;
  padding: 24px;
  gap: 20px;
  flex-direction: column;
  justify-content: start;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  ${mq.sm.max(css`
    width: 100%;
    height: auto;
    min-height: 300px;
  `)}
`
const SubButtonStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
`

const SubTitleStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 14px;
  font-weight: 600;
`
const TabTitleStyle = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const AssetsStyle = styled.div`
  display: flex;
  gap: 10px;

  transition: all 1s;
`
const TraitsStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
  column-gap: 15px;
  transition: all 1s;
`

const AddressBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`
const AuctionTitle = styled.p`
  color: #3f5170;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 125% */
`
const AuctionBtn = styled(Button)`
  width: 123px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #d4d7e2;
  background: #fff;
  padding: 0;
`
const PaginationBtn = styled(Button)`
  display: flex;
  width: 206px;
  height: 36px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #0049c6;
`
export default function NameContent() {
  const router = useRouterWithHistory()
  const _name = router.query.name as string
  //   const breakpoints = useBreakpoint()
  const [isShowAll, setIsShowAll] = useState<boolean>(true)
  const [isPackUp, setIsPackUp] = useState<boolean>(false)
  const { avatarSrc } = useEthInvoice(_name, false)
  const { accountAddress } = useGetNftAddress(_name)
  // const { address } = useAccountSafely()
  const { nftId, loading: NftLoading } = useNameErc721Assets(accountAddress)
  const { prepareDataInput } = useTransactionFlow()

  const showSendTokenInput = prepareDataInput('SendToken')
  const showSendNFTInput = prepareDataInput('SendNFT')
  const showReceiveInput = prepareDataInput('ReceiveAssets')

  const handleSendToken = () => {
    showSendTokenInput(`send-token-${accountAddress}`, {
      address: accountAddress,
      name: _name,
    })
  }
  const handleReceive = () => {
    showReceiveInput(`receive-token`, {
      address: accountAddress,
    })
  }

  const handleSendNFT = () => {
    showSendNFTInput(`send-NFT-${accountAddress}`, {
      address: accountAddress,
      name: _name,
    })
  }
  console.log('handleSendNFT', handleSendNFT)

  return (
    <>
      {_name && accountAddress ? (
        <ContentStyle>
          <CenterLeftStyle>
            <HeaderStyle>
              <OmitButtonStyle>
                <OmitIcon />
              </OmitButtonStyle>
              <NameStyle>{_name || '--'}</NameStyle>

              <TabIconStyle>
                <ListWhiteStyled>
                  <ListWhiteIcon />
                </ListWhiteStyled>
                <SwordIcon />
              </TabIconStyle>
            </HeaderStyle>
            <ProFileStyle>
              <AddressBox>
                <StyledImg src={avatarSrc || TestImg.src} />
                <AddressStyle>
                  {shortenAddress(accountAddress)}
                  <CopyButton value={accountAddress} />
                </AddressStyle>
              </AddressBox>
              <div
                style={{
                  display: 'flex',
                  gap: 32,
                }}
              >
                <AssetsItemStyle>
                  <AssetsIcon />
                  $100.00
                </AssetsItemStyle>
                <AssetsItemStyle>
                  <Icon1 />
                  12
                </AssetsItemStyle>
                <AssetsItemStyle>
                  <SwordIcon />4
                </AssetsItemStyle>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                <AuctionBtn prefix={<Icon2 />} onClick={() => handleReceive()}>
                  <AuctionTitle>Receive</AuctionTitle>
                </AuctionBtn>
                <AuctionBtn prefix={<Icon3 />} onClick={() => handleSendToken()}>
                  <AuctionTitle>Send</AuctionTitle>
                </AuctionBtn>
                <AuctionBtn>
                  <AuctionTitle>Login dApp</AuctionTitle>
                </AuctionBtn>
              </div>

              <div>
                <TabTitleBoxStyle>
                  <Typography className="check">Token</Typography>
                  <ColumnBarIcon />
                  <Typography className="tab-title">Trancaction</Typography>
                </TabTitleBoxStyle>
                <TokensStyle>
                  <Tokens accountAddress={accountAddress} />
                </TokensStyle>
              </div>
            </ProFileStyle>
          </CenterLeftStyle>
          <CenterRightStyle>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottom: '1px solid #D4D7E2',
                paddingBottom: '24px',
              }}
            >
              <PaginationBtn>Knapsack</PaginationBtn>
              <PaginationBtn
                style={{
                  background: '#fff',
                  color: '#80829F',
                  border: '1px solid #D4D7E2',
                  borderLeft: 'none',
                }}
              >
                Actions
              </PaginationBtn>
            </div>
            <TabTitleStyle>
              <SubTitleStyle>Account (3)</SubTitleStyle>
              <SubButtonStyle
                onClick={() => {
                  setIsShowAll(!isShowAll)
                }}
              >
                Show All
                {isShowAll ? <DownShowicon /> : <UpDisplayicon />}
              </SubButtonStyle>
            </TabTitleStyle>
            <AssetsStyle
              style={{
                height: isShowAll ? 'auto' : 0,
                overflow: isShowAll ? 'unset' : 'hidden',
              }}
            >
              <>
                {nftId?.map((item) => (
                  <Skeleton loading={NftLoading} key={item}>
                    <Assets NftId={item} />
                  </Skeleton>
                ))}
                <Traits2 />
                <Traits2 />
              </>
            </AssetsStyle>
            <TabTitleStyle>
              <SubTitleStyle>Gaming (23)</SubTitleStyle>
              <SubButtonStyle
                onClick={() => {
                  setIsPackUp(!isPackUp)
                }}
              >
                Pack Up
                {isPackUp ? <DownShowicon /> : <UpDisplayicon />}
              </SubButtonStyle>
            </TabTitleStyle>
            <TraitsStyle
              style={{
                height: isPackUp ? 'auto' : 0,
                overflow: isPackUp ? 'unset' : 'hidden',
              }}
            >
              <Traits />
              <Traits />
            </TraitsStyle>
          </CenterRightStyle>
        </ContentStyle>
      ) : (
        <>
          <LoadingOverlay />
        </>
      )}
    </>
  )
}
