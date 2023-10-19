import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import { CopyButton } from '@app/components/Copy'
import { Table } from '@app/components/table'
import { AssetsHistoryCallback } from '@app/hooks/requst/useProfileCallback'
import useGetNftAddress from '@app/hooks/useGetNftAddress'
import { shortenAddress } from '@app/utils/utils'

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

export function HistoryTab({ name }: { name: string }) {
  const { accountAddress: account } = useGetNftAddress(name)
  const { data: HistoryList, loading } = AssetsHistoryCallback('eth', account || '')
  console.log('HistoryList=>', HistoryList?.history_list)

  const HistoryTableList = useMemo(() => {
    if (!HistoryList?.history_list.length) return []
    return HistoryList?.history_list.map((item, index) => [
      <TableContentStyle key={+index.toString()}>{item.cate_id || 'unknown'}</TableContentStyle>,
      <TableContentStyle style={{ justifyContent: 'center' }}>
        {((item.sends?.length && HistoryList.token_dict[item.sends[0].token_id].logo_url) ||
          (!!item.receives?.length &&
            HistoryList.token_dict[item.receives[0].token_id].logo_url)) && (
          <TokenImg
            src={
              (item.sends?.length && HistoryList.token_dict[item.sends[0].token_id].logo_url) ||
              (item.receives?.length &&
                HistoryList.token_dict[item.receives[0].token_id].logo_url) ||
              ''
            }
          />
        )}

        {(item.sends?.length && HistoryList.token_dict[item.sends[0].token_id].name) ||
          (item.receives?.length && HistoryList.token_dict[item.receives[0].token_id].name) ||
          'unknown'}
      </TableContentStyle>,
      <TableContentStyle style={{ justifyContent: 'center' }}>
        {item.tx?.value ||
          (item.sends && item.sends[0]?.amount) ||
          (item.receives && item.receives[0]?.amount) ||
          0}
      </TableContentStyle>,
      <TableContentStyle style={{ justifyContent: 'end' }}>
        {shortenAddress(item.id)}
        <CopyButton value={item.id} />
      </TableContentStyle>,
    ])
  }, [HistoryList?.history_list, HistoryList?.token_dict])

  return (
    <>
      <AssetsTokens>
        <Table
          labels={['Type', 'Token', 'Amount', 'TxID']}
          rows={HistoryTableList}
          noneBorder
          isLoading={loading}
        />
      </AssetsTokens>
    </>
  )
}
