import type { BigNumber } from 'ethers'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import usePrevious from 'react-use/lib/usePrevious'
import styled, { css } from 'styled-components'
import { useBalance } from 'wagmi'

import {
  Button,
  Input as EInput,
  Field, // Heading,
  Helper,
  RadioButton,
  RadioButtonGroup,
  Toggle,
  Tooltip,
  Typography,
  mq,
} from '@ensdomains/thorin'

import MoonpayLogo from '@app/assets/MoonpayLogo.svg'
import UserAvatar from '@app/assets/default-avatar.png'
import ToolTipSvg from '@app/assets/tooltip.svg'
// import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/Awns_PlusMinusControl'
// import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { Spacer } from '@app/components/@atoms/Spacer'
import { Card } from '@app/components/Card'
import { ConnectButton } from '@app/components/ConnectButton'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import FullInvoice from '../../FullInvoice'
import PremiumTitle from '../../PremiumTitle'
import {
  MoonpayTransactionStatus,
  PaymentMethod,
  RegistrationReducerDataItem,
  RegistrationStepData,
} from '../../types'
import { useMoonpayRegistration } from '../../useMoonpayRegistration'

// import TemporaryPremium from './TemporaryPremium'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 840px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    /* padding: ${theme.space['4']}; */
    padding-bottom: 32px;
    ${mq.sm.min(css`
      /* padding: ${theme.space['6']} ${theme.space['18']}; */
      gap: ${theme.space['6']};
    `)}
  `,
)

const OutlinedContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: grid;
    align-items: center;
    grid-template-areas: 'title checkbox' 'description description';
    gap: ${theme.space['2']};

    padding: ${theme.space['4']};
    border-radius: ${theme.radii.large};
    background: ${theme.colors.backgroundSecondary};

    ${mq.sm.min(css`
      grid-template-areas: 'title checkbox' 'description checkbox';
    `)}
  `,
)

// const StyledHeading = styled(Heading)(
//   () => css`
//     width: 100%;
//     word-break: break-all;

//     @supports (overflow-wrap: anywhere) {
//       overflow-wrap: anywhere;
//       word-break: normal;
//     }
//   `,
// )

const gridAreaStyle = ({ $name }: { $name: string }) => css`
  grid-area: ${$name};
`

const moonpayInfoItems = Array.from({ length: 2 }, (_, i) => `steps.info.moonpayItems.${i}`)

const PaymentChoiceContainer = styled.div`
  width: 100%;
`

const StyledRadioButtonGroup = styled(RadioButtonGroup)(
  ({ theme }) => css`
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    gap: 0;
  `,
)

const StyledRadioButton = styled(RadioButton)``

const RadioButtonContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    &:last-child {
      border-top: 1px solid ${theme.colors.border};
    }
  `,
)

const StyledTitle = styled(Typography)`
  margin-left: 15px;
`

const RadioLabel = styled(Typography)(
  ({ theme }) => css`
    margin-right: 10px;
    color: ${theme.colors.text};
  `,
)

const MoonpayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`

const InfoItems = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};

    ${mq.sm.min(css`
      flex-direction: row;
      align-items: stretch;
    `)}
  `,
)

const InfoItem = styled.div(
  ({ theme }) => css`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};

    padding: ${theme.space['4']};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    text-align: center;

    & > div:first-of-type {
      width: ${theme.space['10']};
      height: ${theme.space['10']};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${theme.fontSizes.extraLarge};
      font-weight: ${theme.fontWeights.bold};
      color: ${theme.colors.backgroundPrimary};
      background: ${theme.colors.accentPrimary};
      border-radius: ${theme.radii.full};
    }

    & > div:last-of-type {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
)

const LabelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const CheckboxWrapper = styled.div(
  () => css`
    width: 100%;
  `,
  gridAreaStyle,
)

const OutlinedContainerDescription = styled(Typography)(gridAreaStyle)

const OutlinedContainerTitle = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.large};
    font-weight: ${theme.fontWeights.bold};
    white-space: nowrap;
  `,
  gridAreaStyle,
)

const EthInnerCheckbox = ({
  address,
  hasPrimaryName,
  reverseRecord,
  setReverseRecord,
  started,
}: {
  address: string
  hasPrimaryName: boolean
  reverseRecord: boolean
  setReverseRecord: (val: boolean) => void
  started: boolean
}) => {
  const { t } = useTranslation('register')
  const breakpoints = useBreakpoint()

  useEffect(() => {
    if (!started) {
      setReverseRecord(!hasPrimaryName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setReverseRecord])

  return (
    <CheckboxWrapper $name="checkbox">
      <Field hideLabel label={t('steps.pricing.primaryName')} inline reverse disabled={!address}>
        {(ids) => (
          <Toggle
            {...ids?.content}
            disabled={!address}
            size={breakpoints.sm ? 'large' : 'medium'}
            checked={reverseRecord}
            onChange={(e) => {
              e.stopPropagation()
              setReverseRecord(e.target.checked)
            }}
            data-testid="primary-name-toggle"
          />
        )}
      </Field>
    </CheckboxWrapper>
  )
}

const PaymentChoice = ({
  paymentMethodChoice,
  setPaymentMethodChoice,
  hasEnoughEth,
  hasPendingMoonpayTransaction,
  hasFailedMoonpayTransaction,
  address,
  hasPrimaryName,
  reverseRecord,
  setReverseRecord,
  started,
}: {
  paymentMethodChoice: PaymentMethod
  setPaymentMethodChoice: Dispatch<SetStateAction<PaymentMethod>>
  hasEnoughEth: boolean
  hasPendingMoonpayTransaction: boolean
  hasFailedMoonpayTransaction: boolean
  address: string
  hasPrimaryName: boolean
  reverseRecord: boolean
  setReverseRecord: (reverseRecord: boolean) => void
  started: boolean
}) => {
  const { t } = useTranslation('register')

  return (
    <PaymentChoiceContainer>
      <StyledTitle color="textTertiary" weight="bold">
        {t('steps.info.paymentMethod')}
      </StyledTitle>
      <Spacer $height="2" />
      <StyledRadioButtonGroup
        value={paymentMethodChoice}
        onChange={(e) => setPaymentMethodChoice(e.target.value as PaymentMethod)}
      >
        <RadioButtonContainer>
          <StyledRadioButton
            data-testid="payment-choice-ethereum"
            label={<RadioLabel>{t('steps.info.ethereum')}</RadioLabel>}
            name="RadioButtonGroup"
            value={PaymentMethod.ethereum}
            disabled={hasPendingMoonpayTransaction}
            checked={paymentMethodChoice === PaymentMethod.ethereum || undefined}
          />
          {paymentMethodChoice === PaymentMethod.ethereum && !hasEnoughEth && (
            <>
              <Spacer $height="4" />
              <Helper type="warning" alignment="horizontal">
                {t('steps.info.notEnoughEth')}
              </Helper>
              <Spacer $height="2" />
            </>
          )}
          {paymentMethodChoice === PaymentMethod.ethereum && hasEnoughEth && (
            <>
              <Spacer $height="4" />
              <OutlinedContainer>
                <OutlinedContainerTitle $name="title">
                  {t('steps.pricing.primaryName')}
                </OutlinedContainerTitle>
                <EthInnerCheckbox
                  {...{ address, hasPrimaryName, reverseRecord, setReverseRecord, started }}
                />
                <OutlinedContainerDescription $name="description">
                  {t('steps.pricing.primaryNameMessage')}
                </OutlinedContainerDescription>
              </OutlinedContainer>
              <Spacer $height="2" />
            </>
          )}
        </RadioButtonContainer>
        <RadioButtonContainer>
          <StyledRadioButton
            label={
              <LabelContainer>
                <RadioLabel>{t('steps.info.creditOrDebit')}</RadioLabel>
                <Typography color="textTertiary" weight="light">
                  ({t('steps.info.additionalFee')})
                </Typography>
              </LabelContainer>
            }
            name="RadioButtonGroup"
            value={PaymentMethod.moonpay}
            checked={paymentMethodChoice === PaymentMethod.moonpay || undefined}
          />
          {paymentMethodChoice === PaymentMethod.moonpay && (
            <>
              <Spacer $height="4" />
              <InfoItems>
                {moonpayInfoItems.map((item, idx) => (
                  <InfoItem key={item}>
                    <Typography>{idx + 1}</Typography>
                    <Typography>{t(item)}</Typography>
                  </InfoItem>
                ))}
              </InfoItems>
              <Spacer $height="4" />
              {hasFailedMoonpayTransaction && (
                <Helper type="error">{t('steps.info.failedMoonpayTransaction')}</Helper>
              )}
              <Spacer $height="4" />
              <MoonpayContainer>
                {t('steps.info.poweredBy')}
                <MoonpayLogo />
              </MoonpayContainer>
            </>
          )}
        </RadioButtonContainer>
      </StyledRadioButtonGroup>
    </PaymentChoiceContainer>
  )
}
console.log('PaymentChoice', PaymentChoice)

const RegisterBtn = styled(Button)`
  width: 100% !important;
  max-width: 100% !important;
  &:disabled {
    color: #fff;
    background: rgba(0, 73, 198, 0.53);
  }
`
interface ActionButtonProps {
  address?: string
  hasPendingMoonpayTransaction: boolean
  hasFailedMoonpayTransaction: boolean
  paymentMethodChoice: PaymentMethod | ''
  reverseRecord: boolean
  callback: (props: RegistrationStepData['pricing']) => void
  initiateMoonpayRegistrationMutation: ReturnType<
    typeof useMoonpayRegistration
  >['initiateMoonpayRegistrationMutation']
  years: number
  balance: ReturnType<typeof useBalance>['data']
  totalRequiredBalance?: BigNumber
}

export const ActionButton = ({
  address,
  hasPendingMoonpayTransaction,
  hasFailedMoonpayTransaction,
  paymentMethodChoice,
  reverseRecord,
  callback,
  initiateMoonpayRegistrationMutation,
  years,
  balance,
  totalRequiredBalance,
}: ActionButtonProps) => {
  const { t } = useTranslation('register')
  if (!address) {
    return <ConnectButton large />
  }
  if (hasPendingMoonpayTransaction) {
    return (
      <Button data-testid="next-button" disabled loading>
        {t('steps.info.processing')}
      </Button>
    )
  }
  if (hasFailedMoonpayTransaction && paymentMethodChoice === PaymentMethod.moonpay) {
    return (
      <Button
        data-testid="next-button"
        onClick={() => callback({ reverseRecord, years, paymentMethodChoice })}
      >
        {t('action.tryAgain', { ns: 'common' })}
      </Button>
    )
  }
  if (paymentMethodChoice === PaymentMethod.moonpay) {
    return (
      <Button
        loading={initiateMoonpayRegistrationMutation.isLoading}
        data-testid="next-button"
        onClick={() => callback({ reverseRecord, years, paymentMethodChoice })}
        disabled={!paymentMethodChoice || initiateMoonpayRegistrationMutation.isLoading}
      >
        {t('action.next', { ns: 'common' })}
      </Button>
    )
  }
  if (!balance?.value || !totalRequiredBalance) {
    return (
      <Button data-testid="next-button" disabled>
        {t('loading', { ns: 'common' })}
      </Button>
    )
  }
  if (balance?.value.lt(totalRequiredBalance) && paymentMethodChoice === PaymentMethod.ethereum) {
    return (
      <Button data-testid="next-button" disabled>
        {t('steps.pricing.insufficientBalance')}
      </Button>
    )
  }
  return (
    <RegisterBtn
      data-testid="next-button"
      onClick={() => callback({ reverseRecord, years, paymentMethodChoice })}
      disabled={!paymentMethodChoice}
    >
      {/* {t('action.next', { ns: 'common' })} */}
      Register
    </RegisterBtn>
  )
}

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  resolverExists: boolean | undefined
  callback: (props: RegistrationStepData['pricing']) => void
  isPrimaryLoading: boolean
  hasPrimaryName: boolean
  registrationData: RegistrationReducerDataItem
  moonpayTransactionStatus?: MoonpayTransactionStatus
  initiateMoonpayRegistrationMutation: ReturnType<
    typeof useMoonpayRegistration
  >['initiateMoonpayRegistrationMutation']
}

const PremiumText = styled.div`
  text-align: right;
  font-feature-settings: 'clig' off, 'liga' off;

  /* text-shadow: 0px 1px 1px #9f7c00; */

  font-style: normal;
  line-height: normal;
  background: linear-gradient(90deg, #ffc700 0%, #ffdd29 46%, #e49700 80.13%);
  background-clip: text;

  /* stylelint-disable property-no-vendor-prefix */
  -webkit-background-clip: text;
  /* stylelint-enable property-no-vendor-prefix */

  -webkit-text-fill-color: transparent;
`
// const BigPremiumText = styled(PremiumText)`
//   font-size: 24px;
//   font-weight: 800;
// `
const SmallPremiumText = styled(PremiumText)`
  font-size: 16px;
  font-weight: 500;
`
const InterText = styled(Typography)<{ $size?: string; $color?: string; $weight?: number }>`
  width: max-content;
  height: max-content;
  color: ${(props) => props.$color || '#3F5170'};
  font-size: ${(props) => props.$size || '24px'};
  font-style: normal;
  font-weight: ${(props) => props.$weight || 600};
  line-height: normal;
  white-space: pre-wrap;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
`
const CenterRow = styled(Row)`
  justify-content: space-between;
  align-items: center;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
`

const GrayRoundRow = styled(Row)<{ $p: string }>`
  width: 380px;
  height: max-content;
  padding: ${(props) => props.$p};
  border-radius: 10px;
  background: #f7fafc;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`
const GrayRoundColumn = styled(Column)`
  width: 380px;
  height: max-content;
  border-radius: 10px;
  background: #f7fafc;

  /* gap: 30px; */

  padding-top: 14px;
`
const ContentStyle = styled(Row)`
  justify-content: space-between;
  padding: 0 30px;
  gap: 20px;
`
const InitCodeRound = styled.div`
  width: 380px;
  border-radius: 10px;
  background: #f0f8fd;
  padding: 17px 36px;
`
const UpButton = styled(Button)`
  width: 150px;
  padding: 10px 18px;
  border-radius: 8px;
  border: 1px solid #d4d7e2;
  background: #fff;
  opacity: 0.8;
  &:hover {
    opacity: 1;
    background: #fff;
  }
`
const PremiumImgRound = styled.div<{ $premium: boolean }>(
  ({ $premium }) => css`
    width: 350px;
    height: 350px;
    ${$premium &&
    css`
      border-radius: 8px;
      border: 4px solid #e49700;
    `}
  `,
)
const ToolTipRound = styled.div`
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #97b7ef;
  background: #f8fbff;
  color: #8d8ea5;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
`
const InviCode = styled(EInput)`
  text-align: center;
  &>div:focus-within: {
    border-color: transparent;
  }
`
const ButtonBox = styled.div`
  width: 100%;
  height: 100%;
`
const MAX_YEAR = 5
const UpImage = ({ isPremium }: { isPremium: boolean }) => {
  return (
    <Column>
      <GrayRoundRow $p="15px">
        <PremiumImgRound $premium={isPremium}>
          <Image style={{ width: '100%', height: '100%' }} alt="default img" src={UserAvatar} />
        </PremiumImgRound>
      </GrayRoundRow>
      <UpButton>
        <InterText $size="14px" $weight={500}>
          + Upload image
        </InterText>
      </UpButton>
    </Column>
  )
}
const Pricing = ({
  nameDetails,
  callback,
  isPrimaryLoading,
  hasPrimaryName,
  registrationData,
  resolverExists,
  moonpayTransactionStatus,
  initiateMoonpayRegistrationMutation,
}: Props) => {
  // const { t } = useTranslation('register')
  console.log('isPrimaryLoading', isPrimaryLoading)

  const [initCode, setInitCode] = useState('')
  const { normalisedName, beautifiedName } = nameDetails

  const { address } = useAccountSafely()
  const { data: balance } = useBalance({ address: address as `0x${string}` | undefined })
  const resolverAddress = useContractAddress('PublicResolver')

  const [years, setYears] = useState(registrationData.years)
  const [reverseRecord] = useState(() =>
    registrationData.started ? registrationData.reverseRecord : !hasPrimaryName,
  )

  const hasPendingMoonpayTransaction = moonpayTransactionStatus === 'pending'
  const hasFailedMoonpayTransaction = moonpayTransactionStatus === 'failed'

  const previousMoonpayTransactionStatus = usePrevious(moonpayTransactionStatus)

  const [paymentMethodChoice, setPaymentMethodChoice] = useState<PaymentMethod>(
    hasPendingMoonpayTransaction ? PaymentMethod.moonpay : PaymentMethod.ethereum,
  )

  // Keep radio button choice up to date
  useEffect(() => {
    if (moonpayTransactionStatus) {
      setPaymentMethodChoice(
        hasPendingMoonpayTransaction || hasFailedMoonpayTransaction
          ? PaymentMethod.moonpay
          : PaymentMethod.ethereum,
      )
    }
  }, [
    hasFailedMoonpayTransaction,
    hasPendingMoonpayTransaction,
    moonpayTransactionStatus,
    previousMoonpayTransactionStatus,
    setPaymentMethodChoice,
  ])

  const fullEstimate = useEstimateFullRegistration({
    name: normalisedName,
    registrationData: {
      ...registrationData,
      reverseRecord,
      years,
      records: [{ key: 'ETH', value: resolverAddress, type: 'addr', group: 'address' }],
      clearRecords: resolverExists,
      resolver: resolverAddress,
    },
    price: nameDetails.priceData,
  })
  const { premiumFee, totalYearlyFee, estimatedGasFee } = fullEstimate

  const yearlyRequiredBalance = totalYearlyFee?.mul(110).div(100)
  const totalRequiredBalance = yearlyRequiredBalance?.add(premiumFee || 0).add(estimatedGasFee || 0)

  // const showPaymentChoice = !isPrimaryLoading && address
  const nameLength = beautifiedName.split('.')[0].length
  const isPremium = true
  return (
    <StyledCard>
      <PremiumTitle isPremium nameDetails={nameDetails} />
      <ContentStyle>
        <GrayRoundRow $p="20px 36px">
          <InterText $color="#8D8EA5" $size="16px" $weight={500}>
            length
          </InterText>
          <InterText $color="#3F5170" $size="16px" $weight={500}>
            {nameLength} characters
          </InterText>
        </GrayRoundRow>
        <GrayRoundRow $p="20px 36px">
          <InterText $color="#8D8EA5" $size="16px" $weight={500}>
            Premium
          </InterText>
          {isPremium ? (
            <SmallPremiumText>Yes</SmallPremiumText>
          ) : (
            <InterText $color="#3F5170" $size="16px" $weight={500}>
              No
            </InterText>
          )}
          {/* <InterText $color="#3F5170" $size="16px" $weight={500}>
            {MAX_YEAR} years
          </InterText> */}
        </GrayRoundRow>
      </ContentStyle>
      <ContentStyle>
        <UpImage isPremium={isPremium} />
        <Column>
          <GrayRoundColumn>
            <CenterRow style={{ padding: '0 38px' }}>
              <InterText $color="#8D8EA5" $size="16px" $weight={500}>
                Chain
              </InterText>
              <InterText $color="#3F5170" $size="16px" $weight={500}>
                Ethereum
              </InterText>
            </CenterRow>
            <CenterRow style={{ padding: '0 38px' }}>
              <InterText $color="#8D8EA5" $size="16px" $weight={500}>
                Registration Year
              </InterText>
              <PlusMinusControl
                minValue={1}
                maxValue={MAX_YEAR}
                value={years}
                onChange={(e) => {
                  const newYears = parseInt(e.target.value)
                  if (!Number.isNaN(newYears)) setYears(newYears)
                }}
                highlighted
              />
            </CenterRow>
            <div style={{ padding: '0 38px' }}>
              <FullInvoice {...fullEstimate} />
            </div>

            <InitCodeRound>
              <Row style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
                <InterText $color="#3F5170" $size="14px" $weight={500}>
                  Invitation Code
                </InterText>
                <Tooltip
                  placement="right"
                  content={
                    <ToolTipRound>
                      The beta phase requires an invitation code to register, and you will receive 3
                      invitations for successfully registering an aw domain name.
                    </ToolTipRound>
                  }
                  mobilePlacement="right"
                  mobileWidth={50}
                  width={325}
                >
                  <Button
                    style={{
                      width: 'max-content',
                      height: 'max-content',
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                    }}
                  >
                    <ToolTipSvg />
                  </Button>
                </Tooltip>
              </Row>

              <InviCode
                placeholder="Invitation Code"
                value={initCode}
                label=""
                onChange={(e) => setInitCode(e.target.value)}
              />
            </InitCodeRound>
          </GrayRoundColumn>
          {/* <MobileFullWidth> */}
          <ButtonBox>
            <ActionButton
              {...{
                address,
                hasPendingMoonpayTransaction,
                hasFailedMoonpayTransaction,
                paymentMethodChoice,
                reverseRecord,
                callback,
                initiateMoonpayRegistrationMutation,
                years,
                balance,
                totalRequiredBalance,
              }}
            />
          </ButtonBox>
          {/* </MobileFullWidth> */}
        </Column>
      </ContentStyle>
    </StyledCard>
  )
}

export default Pricing
