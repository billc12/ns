import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import NftETHIcon from '@app/assets/ETH.svg'
import NftBreakIcon from '@app/assets/NftBreakIcon.svg'
import RefreshIcon from '@app/assets/RefreshIcon.svg'
import TestImg from '@app/assets/TestImage.png'
import { CopyButton } from '@app/components/Copy'
import { Table } from '@app/components/table'
import { Tokens } from '@app/components/tokens/tokens'
import useGetTokenList from '@app/hooks/requst/useGetTokenList'
import { useNameDetails } from '@app/hooks/useNameDetails'

const TabButtonContainer = styled.div(
  ({ theme }) => css`
    height: 40px;
    width: 468px;
    padding: 5px;
    display: flex;
    margin-top: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-gap: ${theme.space['6']};
    border-radius: 6px;
    background: #f2f6fc;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    ${mq.sm.max(css`
      width: auto;
    `)}
  `,
)

const TabButton = styled.button<{ $selected: boolean }>(
  ({ theme, $selected }) => css`
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    border-radius: 4px;
    background: ${$selected ? '#fff' : 'none'};
    font-weight: ${$selected ? 600 : 400};
    color: ${$selected ? '#0049C6' : '#97B7EF'};
    font-size: 14px;
    transition: all 0.15s ease-in-out;
    height: 32px;
    width: 150px;
    cursor: pointer;
    &:hover {
      color: ${$selected ? theme.colors.accentBright : '#0049C6'};
    }
    ${mq.sm.max(css`
      width: 80px;
    `)}
  `,
)

const TableContentStyle = styled.div(
  () => css`
    height: 58px;
    display: flex;
    align-items: center;
    gap: 8px;
    ${mq.sm.max(css`
      height: 36px;
    `)}
  `,
)

const tabs = ['assets', 'nft', 'history'] as const
type Tab = typeof tabs[number]

const HistoryTokenList = [
  {
    Type: 'Send',
    Token: <Tokens Symbol="ETH" />,
    Amount: 0.4,
    TxID: '0x3222...3214',
  },
  {
    Type: 'Receive',
    Token: <Tokens Symbol="WETH" />,
    Amount: 10000000000,
    TxID: '0x3222...3214',
  },
  {
    Type: 'Mint',
    Token: <Tokens Symbol="USDT" />,
    Amount: 10000000000,
    TxID: '0x3222...3214',
  },
  {
    Type: 'Approve',
    Token: <Tokens Symbol="USDC" />,
    Amount: 10000000000,
    TxID: '0x3222...3214',
  },
  {
    Type: 'Send',
    Token: <Tokens Symbol="STPT" />,
    Amount: 100000,
    TxID: '0x3222...3214',
  },
]

const AssetsTokens = styled.div(
  () => css`
    padding-bottom: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;

    ${mq.sm.max(css`
      padding: 0 20px 100px;
      display: grid;
      gap: 10px;
    `)}
  `,
)

const NFTsCard = styled.div(
  () => css`
    padding: 0 64px 100px;
    display: flex;
    justify-content: space-between;
    gap: 18px;
    flex-wrap: wrap;
    ${mq.sm.max(css`
      padding: 0;
      gap: 10px;
      justify-content: space-evenly;
    `)}
  `,
)

const NFTCardStyle = styled.div(
  () => css`
    width: 164px;
    height: 190px;
    border-radius: 8px;
    border: 1px solid var(--line, #d4d7e2);
    background: var(--light-bg, #f8fbff);
    position: relative;
    overflow: hidden;
    :hover {
      cursor: pointer;
      & svg {
        display: inline-block;
      }
      & .icons-style {
        display: flex;
      }
    }
    ${mq.sm.max(css`
      width: 40vw;
      height: 45vw;
    `)}
  `,
)

const IconsStyle = styled.div(
  () => css`
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    justify-content: space-between;
    padding: 8px;
  `,
)

const NftBgStyle = styled.img(
  () => css`
    height: 100%;
    width: 100%;
    position: absolute;
  `,
)

const Icons = styled.svg(
  () => css`
    width: 24px;
    height: 24px;
    display: none;
    :hover {
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.3);
    }
  `,
)

const BottomIconStyle = styled.svg(
  () => css`
    width: 16px;
    height: 16px;
    display: none;
  `,
)

const NftBottomStyle = styled.div(
  () => css`
    width: 100%;
    height: 27px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 99;
    background: #f8fbff;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)
const TokenImg = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 18px;
  border: 1px solid #d4d7e2;
`
function NftCardItem() {
  const testArr = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <>
      {testArr.map((item) => (
        <NFTCardStyle key={item}>
          <NftBgStyle src={TestImg.src} />
          <IconsStyle className="icons-style">
            <Icons as={RefreshIcon} />
            <Icons as={NftETHIcon} />
          </IconsStyle>
          <NftBottomStyle>
            <Typography ellipsis>adsaasdasdasdasdas</Typography>

            <div className="bottom-icons-style">
              <BottomIconStyle as={NftBreakIcon} />
            </div>
          </NftBottomStyle>
        </NFTCardStyle>
      ))}
    </>
  )
}
type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
}
export const AssetsTab = ({ nameDetails }: Props) => {
  const { t } = useTranslation('profile')
  const [tab, setTab] = useState<Tab>('assets')
  const account = nameDetails.profile?.address
  const { data: tokenList, isLoading } = useGetTokenList({
    account: account || '',
    name: nameDetails.beautifiedName,
  })
  const AssetsTableList = useMemo(() => {
    if (!tokenList || !tokenList.length) return []
    return tokenList.map((item) => [
      <TableContentStyle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <TokenImg src={item.logo_url} alt="token img" />
        {item.symbol.toUpperCase()}
      </TableContentStyle>,
      <TableContentStyle style={{ justifyContent: 'center' }}>
        {Math.floor(item.amount * 10000) / 10000}
      </TableContentStyle>,
      <TableContentStyle style={{ justifyContent: 'end' }}>
        {Math.floor(item.price * 10000) / 10000}
      </TableContentStyle>,
    ])
  }, [tokenList])

  const HistoryTableList = useMemo(() => {
    return HistoryTokenList.map(({ Type, Token, Amount, TxID }) => [
      <TableContentStyle>{Type}</TableContentStyle>,
      <TableContentStyle>{Token}</TableContentStyle>,
      <TableContentStyle style={{ justifyContent: 'center' }}>{Amount}</TableContentStyle>,
      <TableContentStyle style={{ justifyContent: 'end' }}>
        {TxID}
        <CopyButton value={TxID} />
      </TableContentStyle>,
    ])
  }, [])
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <TabButtonContainer>
          {tabs.map((tabItem) => (
            <TabButton
              key={tabItem}
              data-testid={`${tabItem}-tab`}
              $selected={tabItem === tab}
              onClick={() => setTab(tabItem)}
            >
              {t(`tabs.assets.${tabItem}.name`)}
            </TabButton>
          ))}
        </TabButtonContainer>
      </div>
      {tab === 'assets' && (
        <AssetsTokens>
          <Table
            labels={['Token', 'Balance', 'USD Value']}
            rows={AssetsTableList}
            noneBorder
            isLoading={isLoading}
          />
        </AssetsTokens>
      )}
      {tab === 'nft' && (
        <NFTsCard>
          <NftCardItem />
        </NFTsCard>
      )}
      {tab === 'history' && (
        <AssetsTokens>
          <Table labels={['Type', 'Token', 'Amount', 'TxID']} rows={HistoryTableList} noneBorder />
        </AssetsTokens>
      )}
    </>
  )
}
