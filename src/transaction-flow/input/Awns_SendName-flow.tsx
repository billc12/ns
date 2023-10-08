import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Dialog, mq } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { DogFood } from '@app/components/@molecules/DogFood'
import {
  BackButton,
  ContainerStyle,
  ContentStyle,
  NameInfo,
  NextButton,
} from '@app/components/Awns/Dialog'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useBasicName } from '@app/hooks/useBasicName'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { makeTransactionItem } from '../transaction'

type Data = {
  name: string
  type?: 'manager' | 'owner'
}

type FormData = {
  dogfoodRaw: string
  address: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

type BasicNameData = ReturnType<typeof useBasicName>

const Form = styled.form(
  () => css`
    width: 100%;
  `,
)

export const handleSubmitForm = ({
  basicNameData,
  dispatch,
  newOwner,
  managerChoice,
  ownerChoice,
  canSendOwner,
  canSendManager,
  name,
  address,
  sendNameFunctionCallDetails,
}: {
  basicNameData: BasicNameData
  dispatch: TransactionDialogPassthrough['dispatch']
  newOwner: string
  managerChoice: string
  ownerChoice: string
  canSendOwner: boolean
  canSendManager: boolean
  name: string
  address: string
  sendNameFunctionCallDetails: NonNullable<
    ReturnType<typeof useAbilities>['data']
  >['sendNameFunctionCallDetails']
}) => {
  const { ownerData } = basicNameData
  const isOwnerOrManager = ownerData?.owner === address || ownerData?.registrant === address
  const transactions = []
  if (canSendManager && managerChoice === 'manager' && sendNameFunctionCallDetails?.sendManager) {
    transactions.push(
      makeTransactionItem(isOwnerOrManager ? 'transferName' : 'transferSubname', {
        name,
        newOwner,
        contract: sendNameFunctionCallDetails.sendManager.contract,
        sendType: 'sendManager',
        reclaim: sendNameFunctionCallDetails.sendManager.method === 'reclaim',
      }),
    )
  }

  if (canSendOwner && ownerChoice === 'owner' && sendNameFunctionCallDetails?.sendOwner) {
    transactions.push(
      makeTransactionItem(isOwnerOrManager ? 'transferName' : 'transferSubname', {
        name,
        newOwner,
        contract: sendNameFunctionCallDetails.sendOwner!.contract,
        sendType: 'sendOwner',
      }),
    )
  }

  if (transactions.length === 0) return true

  dispatch({
    name: 'setTransactions',
    payload: transactions,
  })
  dispatch({ name: 'setFlowStage', payload: 'transaction' })
}

const InnerContainer = styled.div(({ theme }) => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: calc(80vw - 2 * ${theme.space['6']});
    max-width: 510px;
  `),
])

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const SendName = ({ data, dispatch, onDismiss }: Props) => {
  const { name } = data
  const nameDetails = useNameDetails(name)
  const { t } = useTranslation('profile')
  const basicNameData = useBasicName(name as string, { skipGraph: false })
  const { address = '' } = useAccount()

  const {
    register,
    watch,
    getFieldState,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState,
    trigger,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      dogfoodRaw: '',
      address: '',
    },
  })

  const addressWatch = watch('address')
  const abilities = useAbilities(name)
  const { canSendManager, canSendOwner, sendNameFunctionCallDetails } = abilities.data || {}

  const [managerChoice, ownerChoice] = useMemo(
    () => [canSendManager ? 'manager' : '', canSendOwner ? 'owner' : ''],
    [canSendManager, canSendOwner],
  )
  const loadingAbilities = abilities.isLoading
  const hasChoice =
    !loadingAbilities &&
    addressWatch &&
    ((canSendManager && managerChoice) || (canSendOwner && ownerChoice))

  const hasErrors = Object.keys(formState.errors || {}).length > 0

  const onSubmit = (formData: any) => {
    handleSubmitForm({
      basicNameData,
      dispatch,
      newOwner: formData.address,
      managerChoice,
      ownerChoice,
      canSendOwner: !!canSendOwner,
      canSendManager: !!canSendManager,
      name,
      address,
      sendNameFunctionCallDetails,
    })
  }

  return (
    <>
      {/* <Typography fontVariant="headingFour">{t('details.sendName.title')}11</Typography>
      <Typography style={{ textAlign: 'center' }}>{t('details.sendName.description')}</Typography>
      <Outlink href={getSupportLink('managersAndOwners')}>
        {t('details.sendName.learnMore')}
      </Outlink> */}
      {/* {canSendOwner && (
        <SwitchBox>
          <TextContainer>
            <Typography weight="bold">{t('details.sendName.makeOwner')}</Typography>
            <Typography fontVariant="small">
              {t('details.sendName.makeOwnerDescription')}
            </Typography>
          </TextContainer>
          <Toggle
            size="large"
            value="owner"
            data-testid="owner-checkbox"
            {...register('ownerChoice', { shouldUnregister: true })}
          />
        </SwitchBox>
      )} */}
      {/* {canSendManager && (
        <SwitchBox>
          <TextContainer>
            <Typography weight="bold">{t('details.sendName.makeManager')}</Typography>
            <Typography fontVariant="small">
              {t('details.sendName.makeManagerDescription')}
            </Typography>
          </TextContainer>
          <Toggle
            size="large"
            value="manager"
            data-testid="manager-checkbox"
            {...register('managerChoice', { shouldUnregister: true })}
          />
        </SwitchBox>
      )} */}
      <ContainerStyle>
        <Dialog.Heading title="Transfer AWNS" />
        <NameInfo name={name} expiryDate={nameDetails.expiryDate} />
        <ContentStyle>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <InnerContainer>
              <DogFood
                {...{
                  register,
                  getFieldState,
                  watch,
                  setValue,
                  getValues,
                  setError,
                  label: 'To address / domain',
                  formState,
                  trigger,
                }}
              />
            </InnerContainer>

            <Spacer $height="3" />
            <FooterContainer>
              <Dialog.Footer
                leading={
                  <BackButton onClick={onDismiss}>
                    {t('action.cancel', { ns: 'common' })}
                  </BackButton>
                }
                trailing={
                  <NextButton type="submit" disabled={!hasChoice || hasErrors}>
                    {t('action.next', { ns: 'common' })}
                  </NextButton>
                }
              />
            </FooterContainer>
          </Form>
        </ContentStyle>
      </ContainerStyle>
    </>
  )
}

export default SendName
