import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useChainId } from 'wagmi'

import { mq } from '@ensdomains/thorin'

import { Table } from '@app/components/table'
import useGetTokenList from '@app/hooks/requst/useGetTokenList'

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

const AssetsTokens = styled.div(
  () => css`
    /* padding-bottom: 150px; */
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    ${mq.sm.max(css`
      padding: 0 20px;
      display: grid;
      align-items: unset;
      justify-content: unset;
      gap: 10px;
    `)}
  `,
)

const TokenImg = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 18px;
  border: 1px solid #d4d7e2;
`

export function AssetsTab({ name }: { name: string }) {
  console.log('🚀', name)
  const { address } = useAccount()
  const chainId = useChainId()
  const { data: tokenList, loading } = useGetTokenList({
    account: address as `0x${string}`,
    chain: chainId,
  })
  const AssetsTableList = useMemo(() => {
    if (!tokenList || !tokenList.length) return []
    return tokenList.map((item) => [
      <TableContentStyle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <TokenImg src={item.logoUrl} alt="token img" />
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

  return (
    <>
      <AssetsTokens>
        <Table
          labels={['Token', 'Balance', 'USD Value']}
          rows={AssetsTableList}
          noneBorder
          isLoading={loading}
        />
      </AssetsTokens>
    </>
  )
}
