/* eslint-disable default-case */

/* eslint-disable no-param-reassign */
import { Dispatch, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import usePrevious from 'react-use/lib/usePrevious'
import styled from 'styled-components'
import { WagmiConfig, useAccount } from 'wagmi'

import { Dialog } from '@ensdomains/thorin'

// import { DialogStyle } from '@app/components/Awns/Dialog'
import { useChainId } from '@app/hooks/useChainId'
import { transactions } from '@app/transaction-flow/transaction'
import { wagmiClientWithRefetch } from '@app/utils/query'

import { DataInputComponents } from '../../../transaction-flow/input'
import { InternalTransactionFlow, TransactionFlowAction } from '../../../transaction-flow/types'
// import InputComponentWrapper from './InputComponentWrapper'
import { IntroStageModal } from './stage/Intro'
import { TransactionStageModal } from './stage/TransactionStageModal'

export const DialogStyle = styled(Dialog)`
  & > div > div:nth-child(1) {
    background: #f0f0f0;
    display: none;
  }
  & > div > div:nth-child(2) {
    align-items: start;
    width: 100%;
    > div {
      color: var(--word-color, #3f5170);
      font-family: Poppins;
      font-size: 14px;
      font-weight: 500;
      line-height: 24px;
    }
  }
  & > div > button {
    top: 13px;
    right: 13px;
    width: 24px;
    height: 24px;
  }
`

export const useResetSelectedKey = (dispatch: any) => {
  const { address } = useAccount()
  const chainId = useChainId()

  const prevAddress = usePrevious(address)
  const prevChainId = usePrevious(chainId)

  useEffect(() => {
    if (prevChainId && prevChainId !== chainId) {
      dispatch({
        name: 'stopFlow',
      })
    }
  }, [prevChainId, chainId, dispatch])

  useEffect(() => {
    if (prevAddress && prevAddress !== address) {
      dispatch({
        name: 'stopFlow',
      })
    }
  }, [prevAddress, address, dispatch])
}

export const TransactionDialogManager = ({
  state,
  dispatch,
  selectedKey,
}: {
  state: InternalTransactionFlow
  dispatch: Dispatch<TransactionFlowAction>
  selectedKey: string | null
}) => {
  const { t } = useTranslation()
  const selectedItem = useMemo(
    () => (selectedKey ? state.items[selectedKey] : null),
    [selectedKey, state.items],
  )

  useResetSelectedKey(dispatch)

  const onDismiss = useCallback(() => {
    dispatch({ name: 'stopFlow' })
  }, [dispatch])

  const InnerComponent = useMemo(() => {
    if (selectedKey && selectedItem) {
      if (selectedItem.input && selectedItem.currentFlowStage === 'input') {
        const Component = DataInputComponents[selectedItem.input.name]
        return (
          <WagmiConfig client={wagmiClientWithRefetch}>
            <Component
              {...{
                data: selectedItem.input.data,
                transactions: selectedItem.transactions,
                dispatch,
                onDismiss,
              }}
            />
            {/* <InputComponentWrapper>
            </InputComponentWrapper> */}
          </WagmiConfig>
        )
      }
      if (selectedItem.intro && selectedItem.currentFlowStage === 'intro') {
        const currentTx = selectedItem.transactions[selectedItem.currentTransaction]
        const currentStep =
          currentTx.stage === 'complete'
            ? selectedItem.currentTransaction + 1
            : selectedItem.currentTransaction

        const stepStatus =
          currentTx.stage === 'sent' || currentTx.stage === 'failed' ? 'inProgress' : 'notStarted'

        return (
          <IntroStageModal
            stepStatus={stepStatus}
            currentStep={currentStep}
            onSuccess={() => dispatch({ name: 'setFlowStage', payload: 'transaction' })}
            {...{
              ...selectedItem.intro,
              onDismiss,
              transactions: selectedItem.transactions,
            }}
          />
        )
      }

      const transactionItem = selectedItem.transactions[selectedItem.currentTransaction]
      const transaction = transactions[transactionItem.name]

      return (
        <TransactionStageModal
          actionName={transactionItem.name}
          displayItems={transaction.displayItems(transactionItem.data, t)}
          helper={transaction.helper?.(transactionItem.data, t)}
          // currentStep={selectedItem.currentTransaction}
          // stepCount={selectedItem.transactions.length}
          currentStep={0}
          stepCount={0}
          transaction={transactionItem}
          txKey={selectedKey}
          backToInput={transaction.backToInput ?? false}
          {...{ dispatch, onDismiss }}
        />
      )
    }
    return null
  }, [selectedKey, selectedItem, onDismiss, dispatch, t])

  const onDismissDialog = useCallback(() => {
    if (selectedItem?.disableBackgroundClick && selectedItem?.currentFlowStage === 'input') return
    dispatch({
      name: 'stopFlow',
    })
  }, [dispatch, selectedItem?.disableBackgroundClick, selectedItem?.currentFlowStage])
  return (
    <DialogStyle variant="closable" open={!!state.selectedKey} onDismiss={onDismissDialog}>
      {InnerComponent}
    </DialogStyle>
  )
}
