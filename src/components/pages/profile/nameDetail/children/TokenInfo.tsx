import { useState } from 'react'
import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import ColumnBarIcon from '@app/assets/ColumnBarIcon.svg'
import { CopyButton } from '@app/components/Copy'
import { shortenAddress } from '@app/utils/utils'

import { Tokens } from './Tokens'

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
const Round = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
  width: 100%;
  height: 80px;
  border-radius: 10px;
  background: #f8fbff;
  padding: 15px 20px;
`
const AuctionTitle = styled.p`
  color: #3f5170;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const StateTitle = styled.p`
  color: #97b7ef;
  text-align: right;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const AddressTitle = styled.p`
  color: #80829f;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const PriceTitle = styled.p`
  color: #3f5170;
  text-align: right;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const ToeknTransaction = ({ accountAddress }: { accountAddress: string }) => {
  const transactionList = [1, 2, 3, 4, 5, 6]
  return (
    <>
      {transactionList.map((i) => (
        <Round key={i}>
          <AuctionTitle>Send</AuctionTitle>
          <StateTitle>Confirming...</StateTitle>
          <div style={{ display: 'flex', gap: 10 }}>
            <AddressTitle>{shortenAddress(accountAddress)}</AddressTitle>
            <CopyButton value={accountAddress} />
          </div>
          <PriceTitle>+100,000,000 USDT</PriceTitle>
        </Round>
      ))}
    </>
  )
}
enum Tab {
  'Token' = 'Token',
  'Trancaction' = 'Trancaction',
}
const Page = ({ accountAddress }: { accountAddress: string }) => {
  const [curTab, setCurTab] = useState(Tab.Token)
  return (
    <>
      <TabTitleBoxStyle>
        <Typography
          onClick={() => setCurTab(Tab.Token)}
          className={curTab === Tab.Token ? 'check' : 'tab-title'}
        >
          {Tab.Token}
        </Typography>
        <ColumnBarIcon />
        <Typography
          onClick={() => setCurTab(Tab.Trancaction)}
          className={curTab === Tab.Trancaction ? 'check' : 'tab-title'}
        >
          {Tab.Trancaction}
        </Typography>
      </TabTitleBoxStyle>
      <TokensStyle>
        {curTab === Tab.Token && <Tokens accountAddress={accountAddress} />}
        {curTab === Tab.Trancaction && <ToeknTransaction accountAddress={accountAddress} />}
      </TokensStyle>
    </>
  )
}

export default Page
