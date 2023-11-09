import { useState } from 'react'
import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import ColumnBarIcon from '@app/assets/ColumnBarIcon.svg'
import { CopyButton } from '@app/components/Copy'
import { AssetsHistoryCallback } from '@app/hooks/requst/useProfileCallback'
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
  &.confirmed {
    color: #80829f;
  }
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

  const { data } = AssetsHistoryCallback('eth', '0x5aEFAA34EaDaC483ea542077D30505eF2472cfe3')
  console.log('data1234657', data)

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
    /* <>
      {data &&
        !!data.history_list.length &&
        data.history_list.map((t, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Round key={`${t.cate_id} - ${i}`}>
            <AuctionTitle style={{ textTransform: 'capitalize' }}>
              {t.cate_id || 'Unknown'}
            </AuctionTitle>
            <StateTitle className={t.tx?.status === 1 ? 'confirmed' : ''}>
              {t.tx?.status === 1 ? 'Confirmed' : 'Confirmed'}
            </StateTitle>
            <div style={{ display: 'flex', gap: 10 }}>
              <AddressTitle>{shortenAddress(accountAddress)}</AddressTitle>
              <CopyButton value={accountAddress} />
            </div>
            <PriceTitle>
              {' '}
              {t.sends?.length
                ? `-${t.sends[0].amount} ${
                    data.token_dict[t.cate_id] ? data.token_dict[t.cate_id].symbol : 'Unknown'
                  }`
                : t.receives?.length
                ? `+${t.receives[0].amount} ${
                    data.token_dict[t.cate_id] ? data.token_dict[t.cate_id].symbol : 'Unknown'
                  }`
                : ''}
            </PriceTitle>
          </Round>
        ))}
    </> */
  )
}

export default Page
