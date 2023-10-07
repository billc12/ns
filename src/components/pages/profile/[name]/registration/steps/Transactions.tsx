import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import {
  AlertSVG,
  Button,
  CountdownCircle,
  Dialog, // Heading,
  Spinner,
  Typography,
  mq,
} from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { InterText } from '@app/components/Awns_Header'
import { Card } from '@app/components/Card'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useRegistrationParams from '@app/hooks/useRegistrationParams'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeTransactionItem } from '@app/transaction-flow/transaction'

import LineProgress from '../LineProgress'
import PremiumTitle from '../PremiumTitle'
import { RegistrationReducerDataItem } from '../types'

const StyledCard = styled(Card)(
  () => css`
    max-width: 840px;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    /* width: 260px; */
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    margin-top: 75px;
    margin-bottom: 35px;
  `,
)

const StyledCountdown = styled(CountdownCircle)(
  ({ theme, disabled }) => css`
    width: ${theme.space['52']};
    height: ${theme.space['52']};
    & > div {
      font-size: ${theme.fontSizes.headingOne};
      font-weight: ${theme.fontWeights.bold};
      width: ${theme.space['52']};
      height: ${theme.space['52']};
      color: ${theme.colors.accent};
      ${disabled &&
      css`
        color: ${theme.colors.grey};
      `}
    }
    svg {
      stroke-width: ${theme.space['0.5']};
      ${disabled &&
      css`
        stroke: ${theme.colors.grey};
      `}
    }
  `,
)

const DialogTitle = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    font-weight: bold;
    text-align: center;
  `,
)

const DialogHeading = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['1']};

    div:first-of-type {
      padding: ${theme.space['2']};
      background-color: ${theme.colors.yellow};
      color: ${theme.colors.background};
      border-radius: ${theme.radii.full};

      svg {
        display: block;
        overflow: visible;
      }
    }
  `,
)

const DialogContent = styled(Typography)(
  () => css`
    text-align: center;
  `,
)
const ButtonBox = styled(MobileFullWidth)(
  () => css`
    & > div,
    & {
      width: 260px;
      ${mq.sm.min(css`
        min-width: 260px;
      `)}
    }
  `,
)
const FailedButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <MobileFullWidth>
    <Button color="red" onClick={onClick}>
      {label}
    </Button>
  </MobileFullWidth>
)

const ProgressButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <MobileFullWidth>
    <Button colorStyle="accentSecondary" onClick={onClick}>
      {label}
    </Button>
  </MobileFullWidth>
)

type Props = {
  registrationData: RegistrationReducerDataItem
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (data: { back: boolean; resetSecret?: boolean }) => void
  onStart: () => void
}

const Transactions = ({ registrationData, nameDetails, callback, onStart }: Props) => {
  const { t } = useTranslation('register')

  const { address } = useAccount()
  const keySuffix = `${nameDetails.normalisedName}-${address}`
  const commitKey = `commit-${keySuffix}`
  const registerKey = `register-${keySuffix}`
  const { getLatestTransaction, createTransactionFlow, resumeTransactionFlow, cleanupFlow } =
    useTransactionFlow()
  const commitTx = getLatestTransaction(commitKey)
  const registerTx = getLatestTransaction(registerKey)
  const [resetOpen, setResetOpen] = useState(false)

  const commitTimestamp = commitTx?.stage === 'complete' ? commitTx?.finaliseTime : undefined
  const [commitComplete, setCommitComplete] = useState(
    commitTimestamp && commitTimestamp + 60000 < Date.now(),
  )

  const registrationParams = useRegistrationParams({
    name: nameDetails.normalisedName,
    owner: address!,
    registrationData,
  })
  // Start countdown
  const makeCommitNameFlow = useCallback(() => {
    onStart()
    createTransactionFlow(commitKey, {
      transactions: [makeTransactionItem('commitName', registrationParams)],
      requiresManualCleanup: true,
      autoClose: true,
      resumeLink: `/register/${nameDetails.normalisedName}`,
    })
  }, [commitKey, createTransactionFlow, nameDetails.normalisedName, onStart, registrationParams])

  const makeRegisterNameFlow = () => {
    callback({ back: false })
    // createTransactionFlow(registerKey, {
    //   transactions: [makeTransactionItem('registerName', registrationParams)],
    //   requiresManualCleanup: true,
    //   autoClose: true,
    //   resumeLink: `/register/${nameDetails.normalisedName}`,
    // })
  }

  const showCommitTransaction = () => {
    resumeTransactionFlow(commitKey)
  }

  const showRegisterTransaction = () => {
    // resumeTransactionFlow(registerKey)
    callback({ back: false })
  }

  const resetTransactions = () => {
    cleanupFlow(commitKey)
    cleanupFlow(registerKey)
    callback({ back: true, resetSecret: true })
    setResetOpen(false)
  }

  useEffect(() => {
    if (!commitTx) {
      makeCommitNameFlow()
    }
  }, [commitTx, makeCommitNameFlow])

  // useEffect(() => {
  //   if (registerTx?.stage === 'complete') {
  //     callback({ back: false })
  //   }
  // }, [callback, registerTx])

  const NormalBackButton = useMemo(
    () => (
      <ButtonBox>
        <Button onClick={() => callback({ back: true })} colorStyle="accentSecondary">
          {t('action.back', { ns: 'common' })}
        </Button>
      </ButtonBox>
    ),
    [t, callback],
  )

  const ResetBackButton = useMemo(
    () => (
      <ButtonBox>
        <Button colorStyle="redSecondary" onClick={() => setResetOpen(true)}>
          {t('action.back', { ns: 'common' })}
        </Button>
      </ButtonBox>
    ),
    [t],
  )

  let BackButton: ReactNode = (
    <ButtonBox>
      <Button onClick={() => callback({ back: true })} colorStyle="accentSecondary">
        {t('action.back', { ns: 'common' })}
      </Button>
    </ButtonBox>
  )

  let ActionButton: ReactNode = (
    <ButtonBox>
      <Button data-testid="start-timer-button" onClick={makeCommitNameFlow}>
        {t('steps.transactions.startTimer')}
      </Button>
    </ButtonBox>
  )
  if (commitComplete) {
    if (registerTx?.stage === 'failed') {
      BackButton = ResetBackButton
      ActionButton = (
        <FailedButton
          label={t('steps.transactions.transactionFailed')}
          onClick={showRegisterTransaction}
        />
      )
    } else if (registerTx?.stage === 'sent') {
      BackButton = null
      ActionButton = (
        <ProgressButton
          label={t('steps.transactions.transactionProgress')}
          onClick={showRegisterTransaction}
        />
      )
    } else {
      BackButton = ResetBackButton
      ActionButton = (
        <ButtonBox>
          <Button
            data-testid="finish-button"
            onClick={!registerTx ? makeRegisterNameFlow : showRegisterTransaction}
          >
            {t('action.finish', { ns: 'common' })}
          </Button>
        </ButtonBox>
      )
    }
  } else if (commitTx?.stage) {
    if (commitTx?.stage === 'failed') {
      BackButton = NormalBackButton
      ActionButton = (
        <FailedButton
          label={t('steps.transactions.transactionFailed')}
          onClick={showCommitTransaction}
        />
      )
    } else if (commitTx?.stage === 'sent') {
      BackButton = null
      ActionButton = (
        <ProgressButton
          label={t('steps.transactions.transactionProgress')}
          onClick={showCommitTransaction}
        />
      )
    } else if (commitTx?.stage === 'complete') {
      BackButton = ResetBackButton
      ActionButton = (
        <ButtonBox>
          <Button data-testid="wait-button" disabled suffix={<Spinner color="greyPrimary" />}>
            {t('steps.transactions.wait')}
          </Button>
        </ButtonBox>
      )
    }
  }
  return (
    <StyledCard>
      <Dialog variant="blank" open={resetOpen} onDismiss={() => setResetOpen(false)}>
        <Dialog.CloseButton onClick={() => setResetOpen(false)} />
        <InnerDialog>
          <DialogHeading>
            <div>
              <AlertSVG />
            </div>
            <DialogTitle>{t('steps.cancelRegistration.heading')}</DialogTitle>
          </DialogHeading>
          <DialogContent>{t('steps.cancelRegistration.contentOne')}</DialogContent>
          <DialogContent>{t('steps.cancelRegistration.contentTwo')}</DialogContent>
          <Dialog.Footer
            trailing={
              <Button onClick={resetTransactions} colorStyle="redSecondary">
                {t('steps.cancelRegistration.footer')}
              </Button>
            }
          />
        </InnerDialog>
      </Dialog>
      <PremiumTitle nameDetails={nameDetails} />
      <div style={{ marginTop: 70, marginBottom: 33 }}>
        <LineProgress curSelect={2} />
      </div>
      <InterText $textColor="#000" $w={500}>
        Wait 60 seconds for the timer to complete, almost there
      </InterText>
      <StyledCountdown
        countdownSeconds={60}
        disabled={!commitTimestamp}
        startTimestamp={commitTimestamp}
        size="large"
        callback={() => setCommitComplete(true)}
      />
      <InterText style={{ maxWidth: 500, textAlign: 'center' }} $textColor="#000" $w={500}>
        {t('steps.transactions.subheading')}
      </InterText>
      <ButtonContainer>
        {BackButton}
        {ActionButton}
      </ButtonContainer>
    </StyledCard>
  )
  // return (
  //   <StyledCard>
  //     <Dialog variant="blank" open={resetOpen} onDismiss={() => setResetOpen(false)}>
  //       <Dialog.CloseButton onClick={() => setResetOpen(false)} />
  //       <InnerDialog>
  //         <DialogHeading>
  //           <div>
  //             <AlertSVG />
  //           </div>
  //           <DialogTitle>{t('steps.cancelRegistration.heading')}</DialogTitle>
  //         </DialogHeading>
  //         <DialogContent>{t('steps.cancelRegistration.contentOne')}</DialogContent>
  //         <DialogContent>{t('steps.cancelRegistration.contentTwo')}</DialogContent>
  //         <Dialog.Footer
  //           trailing={
  //             <Button onClick={resetTransactions} colorStyle="redSecondary">
  //               {t('steps.cancelRegistration.footer')}
  //             </Button>
  //           }
  //         />
  //       </InnerDialog>
  //     </Dialog>
  //     <Heading>{t('steps.transactions.heading')}</Heading>
  //     <StyledCountdown
  //       countdownSeconds={60}
  //       disabled={!commitTimestamp}
  //       startTimestamp={commitTimestamp}
  //       size="large"
  //       callback={() => setCommitComplete(true)}
  //     />
  //     <Typography>{t('steps.transactions.subheading')}</Typography>
  //     <ButtonContainer>
  //       {BackButton}
  //       {ActionButton}
  //     </ButtonContainer>
  //   </StyledCard>
  // )
}

export default Transactions
