// import { useState } from 'react'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Dialog, mq } from '@ensdomains/thorin'

import { BackButton, NameInfo, NextButton, Row } from '@app/components/Awns/Dialog'
import LabelInput from '@app/components/Awns/LabelInput'
import { useGetPrimaryNameTransactionFlowItem } from '@app/hooks/primary/useGetPrimaryNameTransactionFlowItem'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { shortenAddress } from '@app/utils/utils'

type Data = {
  address: string
  name: string
}
export type Props = {
  data: Data
} & TransactionDialogPassthrough

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
  ${mq.sm.max(css`
    padding: 0;
  `)}
`
const SetPrimaryName = ({ data: { address, name }, dispatch, onDismiss }: Props) => {
  const breakpoints = useBreakpoint()
  const isSmDown = useMemo(() => {
    if (breakpoints.sm) {
      return false
    }
    return true
  }, [breakpoints.sm])
  const { normalisedName, expiryDate, isWrapped, profile } = useNameDetails(name)
  const resolverStatus = useResolverStatus(name, {
    enabled: !!name,
    migratedRecordsMatch: { key: '60', type: 'addr', addr: address },
  })
  const getPrimarynameTransactionFlowItem = useGetPrimaryNameTransactionFlowItem({
    address,
    isWrapped,
    profileAddress: profile?.address,
    resolverAddress: profile?.resolverAddress,
    resolverStatus: resolverStatus.data,
  })
  const dispatchTransactions = () => {
    const transactionFlowItem = getPrimarynameTransactionFlowItem.callBack?.(name)
    if (!transactionFlowItem) return
    const transactionCount = transactionFlowItem.transactions.length
    console.log('transactionCount', transactionCount)
    if (transactionCount === 1) {
      dispatch({
        name: 'setTransactions',
        payload: transactionFlowItem.transactions,
      })
      dispatch({
        name: 'setFlowStage',
        payload: 'transaction',
      })
      return
    }
    dispatch({
      name: 'startFlow',
      key: 'ChangePrimaryName',
      payload: transactionFlowItem,
    })
  }
  return (
    <>
      <Dialog.Heading title="Set AWNS Address" />
      <NameInfo name={normalisedName} expiryDate={expiryDate} />
      <Column>
        <LabelInput
          value={address ? (isSmDown ? shortenAddress(address) : address) : '--'}
          label="Connected Address"
          readOnly
          isActive
          isShowIcon
        />
      </Column>
      <Row style={{ marginTop: 20, width: '100%' }}>
        <BackButton onClick={onDismiss}>Cancel</BackButton>
        <NextButton onClick={dispatchTransactions}>Save</NextButton>
      </Row>
    </>
  )
}
export default SetPrimaryName
