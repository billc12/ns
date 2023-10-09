import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useBalance } from 'wagmi'

import { Avatar, Dialog, Helper, ScrollBox, Typography, mq } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { Invoice, InvoiceItem } from '@app/components/@atoms/Invoice/Invoice'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/Awns_PlusMinusControl'
import { StyledName } from '@app/components/@atoms/StyledName/StyledName'
import { BackButton, NameInfo, NextButton } from '@app/components/Awns/Dialog'
import { YEAR_DISCOUNT } from '@app/components/pages/profile/[name]/registration/types'
import { formatDateString } from '@app/components/pages/profile/[name]/tabs/ProfileTab'
import gasLimitDictionary from '@app/constants/gasLimits'
import { useAvatar } from '@app/hooks/useAvatar'
import { useEstimateGasLimitForTransactions } from '@app/hooks/useEstimateGasLimitForTransactions'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useZorb } from '@app/hooks/useZorb'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE } from '@app/utils/constants'
import useUserConfig from '@app/utils/useUserConfig'
import { yearsToSeconds } from '@app/utils/utils'

import { ShortExpiry } from '../../../components/@atoms/ExpiryComponents/ExpiryComponents'
import { useChainId } from '../../../hooks/useChainId'
import { useExpiry } from '../../../hooks/useExpiry'
import { usePrice } from '../../../hooks/usePrice'

const Container = styled.form(
  ({ theme }) => css`
    display: flex;
    width: 100%;
    max-height: 60vh;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['4']};

    ${mq.sm.min(
      css`
        width: calc(80vw - 2 * ${theme.space['6']});
        max-width: ${theme.space['128']};
      `,
    )}
  `,
)

const ScrollBoxWrapper = styled(ScrollBox)(
  ({ theme }) => css`
    width: 100%;
    padding-right: ${theme.space['2']};
    margin-right: -${theme.space['2']};
  `,
)

const InnerContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['4']};
  `,
)

const PlusMinusWrapper = styled.div(({ theme }) => [
  css`
    width: max-content;
    max-width: ${theme.space['80']};
    overflow: hidden;
    display: flex;
  `,
  mq.sm.min(css``),
])

const NamesListItemContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
    height: ${theme.space['16']};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.full};
    padding: ${theme.space['2']};
    padding-right: ${theme.space['5']};
  `,
)

const NamesListItemAvatarWrapper = styled.div(
  ({ theme }) => css`
    position: relative;
    width: ${theme.space['12']};
    height: ${theme.space['12']};
  `,
)

const NamesListItemContent = styled.div(
  () => css`
    flex: 1;
    position: relative;
    overflow: hidden;
  `,
)

const NamesListItemTitle = styled.div(
  ({ theme }) => css`
    font-size: ${theme.space['5.5']};
    background: 'red';
  `,
)

const NamesListItemSubtitle = styled.div(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.normal};
    font-size: ${theme.space['3.5']};
    line-height: 1.43;
    color: ${theme.colors.textTertiary};
  `,
)

const GasEstimationCacheableComponent = styled(CacheableComponent)(
  ({ theme }) => css`
    width: 100%;
    gap: ${theme.space['4']};
    display: flex;
    flex-direction: column;
  `,
)
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const NamesListItem = ({ name }: { name: string }) => {
  const chainId = useChainId()
  const { avatar } = useAvatar(name, chainId)
  const zorb = useZorb(name, 'name')
  const { expiry, loading: expiryLoading } = useExpiry(name)

  if (expiryLoading) return null
  return (
    <NamesListItemContainer>
      <NamesListItemAvatarWrapper>
        <Avatar src={avatar || zorb} label={name} />
      </NamesListItemAvatarWrapper>
      <NamesListItemContent>
        <NamesListItemTitle>
          <StyledName name={name} />
        </NamesListItemTitle>
        {expiry?.expiry && (
          <NamesListItemSubtitle>
            <ShortExpiry expiry={expiry.expiry} textOnly />
          </NamesListItemSubtitle>
        )}
      </NamesListItemContent>
    </NamesListItemContainer>
  )
}

const NamesListContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)
const Text = styled(Typography)`
  color: #8d8ea5;

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const InfoContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 37px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d4d7e2;
  background: #fff;
  padding: 30px 50px;
`
type NamesListProps = {
  names: string[]
}

const NamesList = ({ names }: NamesListProps) => {
  return (
    <NamesListContainer data-testid="extend-names-names-list">
      {names.map((name) => (
        <NamesListItem key={name} name={name} />
      ))}
    </NamesListContainer>
  )
}

type Data = {
  names: string[]
  isSelf?: boolean
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const ExtendNames = ({ data: { names, isSelf }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')
  const { address } = useAccount()
  const { data: balance } = useBalance({
    address,
  })

  const [view, setView] = useState<'name-list' | 'registration'>(
    names.length > 1 ? 'name-list' : 'registration',
  )
  const _nameDetails = useNameDetails(names[0])
  const nameDetail = useMemo(() => {
    if (view === 'registration') {
      return _nameDetails
    }
    return null
  }, [_nameDetails, view])
  const [years, setYears] = useState(1)
  const duration = yearsToSeconds(years)

  const { userConfig } = useUserConfig()
  const currencyDisplay = userConfig.currency === 'fiat' ? userConfig.fiat : 'eth'

  const { total: rentFee, totalYearlyFee } = usePrice(names, years, false)

  // const totalRentFee = rentFee ? rentFee.mul(years) : undefined
  const transactions = [
    makeTransactionItem('extendNames', { names, duration, rentPrice: totalYearlyFee!, isSelf }),
  ]
  const currentExpiry = useMemo(() => {
    if (!nameDetail || !nameDetail.expiryDate) {
      return null
    }
    const old = new Date(nameDetail.expiryDate)
    const cur = old.setFullYear(old.getFullYear() + years)
    return new Date(cur)
  }, [nameDetail, years])
  const {
    gasLimit: estimatedGasLimit,
    error: estimateGasLimitError,
    isLoading: isEstimateGasLoading,
    gasPrice,
  } = useEstimateGasLimitForTransactions(transactions, !!rentFee)

  const hardcodedGasLimit = gasLimitDictionary.RENEW(names.length)
  const gasLimit = estimatedGasLimit || hardcodedGasLimit

  const transactionFee = gasPrice ? gasLimit.mul(gasPrice) : BigNumber.from('0')
  const discountInvoiceItems = useMemo(
    () => ({ label: `${years} Year Discount`, discount: YEAR_DISCOUNT[years - 1] }),
    [years],
  )
  const items: InvoiceItem[] = [
    {
      label: t('input.extendNames.invoice.extension', { count: years }),
      value: totalYearlyFee,
      bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
    },
    {
      label: t('input.extendNames.invoice.transaction'),
      value: transactionFee,
    },
  ]
  const trailingButtonProps =
    view === 'name-list'
      ? { onClick: () => setView('registration'), children: t('action.next', { ns: 'common' }) }
      : {
          disabled: !!estimateGasLimitError,
          onClick: () => {
            if (!totalYearlyFee) return
            dispatch({
              name: 'setTransactions',
              payload: transactions,
            })
            dispatch({ name: 'setFlowStage', payload: 'transaction' })
          },
          children: t('action.next', { ns: 'common' }),
        }

  return (
    <>
      <Dialog.Heading title="Extend AWNS" />
      <Container data-testid="extend-names-modal">
        <ScrollBoxWrapper>
          <InnerContainer>
            {view === 'name-list' ? (
              <NamesList names={names} />
            ) : (
              <>
                <NameInfo
                  name={nameDetail?.normalisedName || ''}
                  expiryDate={nameDetail?.expiryDate}
                />
                <InfoContainerStyle>
                  <Row>
                    <Text>Registration Year</Text>
                    <PlusMinusWrapper>
                      <PlusMinusControl
                        minValue={1}
                        value={years}
                        onChange={(e) => {
                          const newYears = parseInt(e.target.value)
                          if (!Number.isNaN(newYears)) setYears(newYears)
                        }}
                      />
                    </PlusMinusWrapper>
                  </Row>
                  <Row>
                    <Text>Expiry on</Text>
                    <Text>{formatDateString(currentExpiry)}</Text>
                  </Row>
                  <GasEstimationCacheableComponent $isCached={isEstimateGasLoading}>
                    <Invoice
                      items={items}
                      unit={currencyDisplay}
                      totalLabel="Estimated total"
                      discount={discountInvoiceItems}
                    />
                    {(!!estimateGasLimitError ||
                      (estimatedGasLimit && balance?.value.lt(estimatedGasLimit))) && (
                      <Helper type="warning">{t('input.extendNames.gasLimitError')}</Helper>
                    )}
                  </GasEstimationCacheableComponent>
                </InfoContainerStyle>
              </>
            )}
          </InnerContainer>
        </ScrollBoxWrapper>
        <Dialog.Footer
          leading={
            <BackButton onClick={onDismiss}>{t('action.back', { ns: 'common' })}</BackButton>
          }
          trailing={
            <NextButton
              {...trailingButtonProps}
              data-testid="extend-names-confirm"
              disabled={isEstimateGasLoading}
            />
          }
        />
      </Container>
    </>
  )
}

export default ExtendNames
