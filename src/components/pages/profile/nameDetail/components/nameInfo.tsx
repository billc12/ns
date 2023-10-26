import router from 'next/router'
import styled, { css } from 'styled-components'

import { Button, LeftArrowSVG, Typography, mq } from '@ensdomains/thorin'

import AssetsIcon from '@app/assets/AssetsIcon.svg'
import ColumnBarIcon from '@app/assets/ColumnBarIcon.svg'
import ListWhiteIcon from '@app/assets/List-white.svg'
// import OmitIcon from '@app/assets/OmitIcon.svg'
import SwordIcon from '@app/assets/SwordIcon.svg'
import TestImg from '@app/assets/TestImage.png'
import Icon1 from '@app/assets/nameDetail/icon1.svg'
// import Icon4 from '@app/assets/nameDetail/icon4.svg'
import { CopyButton } from '@app/components/Copy'
import { shortenAddress } from '@app/utils/utils'

import { useEthInvoice } from '../../[name]/registration/steps/Awns_Complete'
import ReceiveBtn from '../children/Receive'
import SendNFTBtn from '../children/SendNFT'
import SendTokenBtn from '../children/SendToken'
import { Tokens } from '../children/Tokens'

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
const AddressBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`
export const AuctionTitle = styled.p`
  color: #3f5170;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 125% */
`
export const AuctionBtn = styled(Button)`
  width: 123px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #d4d7e2;
  background: #fff;
  padding: 0;
`
const Page = ({ accountAddress, _name }: { accountAddress: string; _name: string }) => {
  const { avatarSrc } = useEthInvoice(_name, false)

  return (
    <CenterLeftStyle>
      <HeaderStyle>
        <OmitButtonStyle onClick={() => router.back()}>
          {/* <OmitIcon /> */}
          <LeftArrowSVG />
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
          <ReceiveBtn accountAddress={accountAddress} />
          <SendTokenBtn accountAddress={accountAddress} _name={_name} />
          <SendNFTBtn accountAddress={accountAddress} _name={_name} />
          {/* <AuctionBtn prefix={<Icon4 />}>
            <AuctionTitle>Connect</AuctionTitle>
          </AuctionBtn> */}
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
  )
}
export default Page
