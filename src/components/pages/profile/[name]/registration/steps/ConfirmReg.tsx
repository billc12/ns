import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Typography, mq } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { InterText } from '@app/components/Awns_Header'
import { Card } from '@app/components/Card'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useRegistrationParams from '@app/hooks/useRegistrationParams'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeTransactionItem } from '@app/transaction-flow/transaction'

import FullInvoice from '../FullInvoice'
import LineProgress from '../LineProgress'
import PremiumTitle from '../PremiumTitle'
import { RegistrationReducerDataItem } from '../types'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 840px;
    margin: 0 auto;
    flex-direction: column;
    gap: 10px;
    /* padding: ${theme.space['4']}; */

    ${mq.sm.min(css`
      /* padding: ${theme.space['6']} ${theme.space['18']}; */
      gap: 40px;
    `)}
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    gap: ${theme.space['2']};
  `,
)
const ButtonBox = styled(MobileFullWidth)(
  ({ theme }) => css`
    & > div,
    & {
      width: 260px;
      /* max-width: ${theme.space.full}; */
      ${mq.sm.min(css`
        min-width: 260px;
        /* width: fit-content; */
        /* max-width: max-content; */
      `)}
    }
  `,
)
const ProfileButton = styled.button(
  () => css`
    cursor: pointer;
  `,
)
const FullInvoiceBox = styled.div`
  width: 500px;
  border-radius: 10px;
  background: #f7fafc;
  padding: 30px;
`

type Props = {
  registrationData: RegistrationReducerDataItem
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (data: { back: boolean }) => void
  onProfileClick: () => void
}
const FailedButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <ButtonBox>
    <Button color="red" onClick={onClick}>
      {label}
    </Button>
  </ButtonBox>
)
const ProgressButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <ButtonBox>
    <Button colorStyle="accentSecondary" onClick={onClick}>
      {label}
    </Button>
  </ButtonBox>
)
const ConfirmReg = ({ registrationData, nameDetails, callback, onProfileClick }: Props) => {
  const { createTransactionFlow, getLatestTransaction, resumeTransactionFlow } =
    useTransactionFlow()
  const { t } = useTranslation('register')
  const { normalisedName, priceData } = nameDetails
  const { address } = useAccount()
  const keySuffix = `${nameDetails.normalisedName}-${address}`
  const registerKey = `register-${keySuffix}`
  const registerTx = getLatestTransaction(registerKey)

  const estimate = useEstimateFullRegistration({
    name: normalisedName,
    registrationData,
    price: priceData,
  })
  const show = false
  const registrationParams = useRegistrationParams({
    name: nameDetails.normalisedName,
    owner: address!,
    registrationData,
  })

  const makeRegisterNameFlow = () => {
    createTransactionFlow(registerKey, {
      transactions: [makeTransactionItem('registerName', registrationParams)],
      requiresManualCleanup: true,
      autoClose: true,
      resumeLink: `/register/${nameDetails.normalisedName}`,
    })
  }
  const showRegisterTransaction = () => {
    resumeTransactionFlow(registerKey)
  }
  useEffect(() => {
    // Transaction successful
    if (registerTx?.stage === 'complete') {
      callback({ back: false })
    }
  }, [callback, registerTx?.stage])
  const auctionBtn = useMemo(() => {
    if (registerTx?.stage === 'failed') {
      return (
        <FailedButton
          label={t('steps.transactions.transactionFailed')}
          onClick={showRegisterTransaction}
        />
      )
    }
    if (registerTx?.stage === 'sent') {
      return (
        <ProgressButton
          label={t('steps.transactions.transactionProgress')}
          onClick={showRegisterTransaction}
        />
      )
    }
    return (
      <ButtonBox>
        <Button data-testid="next-button" onClick={makeRegisterNameFlow}>
          Register
        </Button>
      </ButtonBox>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerTx?.stage])
  return (
    <StyledCard>
      <PremiumTitle nameDetails={nameDetails} />
      <LineProgress curSelect={3} />
      <InterText $textColor="#000" $w={500}>
        Complete a second transaction to secure your name
      </InterText>
      <FullInvoiceBox>
        <FullInvoice {...estimate} />
      </FullInvoiceBox>

      {show && !registrationData.queue.includes('profile') && (
        <ProfileButton data-testid="setup-profile-button" onClick={onProfileClick}>
          <Typography weight="bold" color="accent">
            {t('steps.info.setupProfile')}
          </Typography>
        </ProfileButton>
      )}
      <ButtonContainer>
        <ButtonBox>
          <Button colorStyle="accentSecondary" onClick={() => callback({ back: true })}>
            {t('action.back', { ns: 'common' })}
          </Button>
        </ButtonBox>
        {auctionBtn}
      </ButtonContainer>
    </StyledCard>
  )
}

export default ConfirmReg
