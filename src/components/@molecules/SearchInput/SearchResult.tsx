/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/interactive-supports-focus */
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useNetwork } from 'wagmi'

import { Avatar, Spinner, Tag, Typography } from '@ensdomains/thorin'

import { useAvatar } from '@app/hooks/useAvatar'
import { useBasicName } from '@app/hooks/useBasicName'
import useBeautifiedName from '@app/hooks/useBeautifiedName'
import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import { useZorb } from '@app/hooks/useZorb'
import type { RegistrationStatus } from '@app/utils/registrationStatus'
import { shortenAddress } from '@app/utils/utils'

const SearchItem = styled.div<{
  $selected?: boolean
  $clickable?: boolean
  $error?: boolean
  $gridTemplateColumns?: string
}>(
  ({ theme, $selected, $clickable, $error, $gridTemplateColumns }) => css`
    height: max-content;
    display: grid;
    grid-template-columns: ${() => $gridTemplateColumns || 'auto 1fr'};
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['2']};
    padding: 20px 34px;
    position: relative;
    opacity: 0.8;
    border-radius: 10px;
    border: 1px solid #97b7ef;
    background: #122861;
    backdrop-filter: blur(7px);
    ${$clickable &&
    css`
      cursor: pointer;
    `}
    &:hover {
      /* cursor: pointer; */
      opacity: 1;
    }
    ${$selected &&
    css`
      /* background-color: ${theme.colors.background}; */
      opacity: 1;
    `}
    ${$error &&
    css`
      /* background-color: ${theme.colors.redSurface};
      color: ${theme.colors.red}; */
    `}
  `,
)

const NoInputYetTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

const AvatarWrapper = styled.div<{ $isPlaceholder?: boolean }>(
  ({ theme, $isPlaceholder }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['8']};
    min-width: ${theme.space['8']};
    height: ${theme.space['8']};
    flex-grow: 1;
    ${$isPlaceholder &&
    css`
      filter: grayscale(100%);
    `}
  `,
)

const LeadingSearchItem = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    max-width: min-content;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    gap: ${theme.space['4.5']};
    flex-gap: ${theme.space['4.5']};
  `,
)

const AddressAndName = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  `,
)

const StyledTag = styled(Tag)(
  () => css`
    width: max-content;
    justify-self: flex-end;
    overflow-wrap: normal;
    word-break: keep-all;
    white-space: nowrap;
  `,
)

const AddressTag = styled(StyledTag)(
  ({ theme }) => css`
    border: ${theme.borderWidths['0.375']} solid ${theme.colors.border};
    background-color: transparent;
  `,
)

const AddressPrimary = styled.div(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.small};
    color: ${theme.colors.greyPrimary};
  `,
)

const SpinnerWrapper = styled.div(
  () => css`
    width: max-content;
    justify-self: flex-end;
  `,
)
const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
`

export const InterText = styled(Typography)<{ $size?: string; $color?: string; $weight?: number }>`
  width: max-content;
  height: max-content;
  color: ${(props) => props.$color || '#fff'};
  font-size: ${(props) => props.$size || '20px'};
  font-style: normal;
  font-weight: ${(props) => props.$weight || 600};
  line-height: normal;
`
const ChainRound = styled.div`
  width: max-content;
  height: max-content;
  padding: 4px 12px;
  border-radius: 20px;
  background: #7187d4;
`
const ViewRound = styled(Row)`
  width: 142px;
  height: 40px;
  border-radius: 38px;
  border: 1px solid #97b7ef;
  box-shadow: 0 4px 44px 0 rgba(2, 26, 98, 0.52);
  justify-content: center;
  align-items: center;
`
const ComingSoonRound = styled(Row)`
  justify-content: center;
  align-items: center;
  width: 142px;
  height: 40px;
  border-radius: 38px;
  background: #1a3372;
  box-shadow: 0 4px 44px 0 rgba(2, 26, 98, 0.52);
`
const ComingSonText = styled(Typography)`
  color: #465d97;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`
const AddressResultItem = ({ address }: { address: string }) => {
  const { t } = useTranslation('common')
  const primary = usePrimary(address)
  const network = useChainId()
  const { avatar } = useAvatar(primary.data?.name, network)
  const zorb = useZorb(address, 'address')
  const { chain } = useNetwork()
  return (
    <>
      <LeadingSearchItem>
        <Column>
          <Row>
            <InterText>{shortenAddress(address, undefined, 8, 6)}</InterText>
            <ChainRound>
              <InterText $size="14px">{chain?.name || 'Ethereum'}</InterText>
            </ChainRound>
          </Row>
          <InterText $size="14px" $color="#A7F46A">
            Address
          </InterText>
        </Column>
      </LeadingSearchItem>
      <ViewRound>
        <InterText $size="16px" $weight={500} $color="#97B7EF">
          View
        </InterText>
      </ViewRound>
    </>
  )
  return (
    <>
      <LeadingSearchItem>
        <AvatarWrapper>
          <Avatar src={avatar || zorb} label="avatar" />
        </AvatarWrapper>
        <AddressAndName>
          <Typography weight="bold">{shortenAddress(address, undefined, 8, 6)}</Typography>
          {primary.data?.name && <AddressPrimary>{primary.data?.beautifiedName}</AddressPrimary>}
        </AddressAndName>
      </LeadingSearchItem>
      <AddressTag>{t('address.label')}</AddressTag>
    </>
  )
}

const GracePeriodTag = styled(StyledTag)(
  ({ theme }) => css`
    color: ${theme.colors.yellow};
    background-color: ${theme.colors.yellowSurface};
  `,
)

const PremiumTag = styled(StyledTag)(
  ({ theme }) => css`
    color: ${theme.colors.purple};
    background-color: ${theme.colors.purpleSurface};
  `,
)
const RegisterTag = styled(Row)`
  width: 142px;
  height: 40px;
  border-radius: 38px;
  background: linear-gradient(180deg, #2265d8 0%, #012eac 81.25%, #0150ac 100%);
  box-shadow: 0 4px 44px 0 rgba(2, 26, 98, 0.52);
  justify-content: center;
  align-items: center;
`
const StatusTag = ({ status }: { status: RegistrationStatus }) => {
  const { t } = useTranslation('common')
  switch (status) {
    case 'owned':
    case 'imported':
    case 'registered':
      return <StyledTag>{t(`search.status.${status}`)}</StyledTag>
    case 'gracePeriod':
      return <GracePeriodTag>{t(`search.status.${status}`)}</GracePeriodTag>
    case 'premium':
      return <PremiumTag>{t(`search.status.${status}`)}</PremiumTag>
    case 'available':
      return <StyledTag colorStyle="greenSecondary">{t(`search.status.${status}`)}</StyledTag>
    case 'notOwned':
    case 'notImported':
      return <StyledTag colorStyle="blueSecondary">{t(`search.status.${status}`)}</StyledTag>
    case 'short':
    default:
      return <StyledTag colorStyle="redSecondary">{t(`search.status.${status}`)}</StyledTag>
  }
}
console.log('StatusTag', StatusTag)

const AwnsStatusTag = ({ status }: { status: RegistrationStatus }) => {
  // const { t } = useTranslation('common')
  switch (status) {
    case 'owned':
    case 'imported':
    case 'registered':
      return (
        <ViewRound>
          <InterText $size="16px" $weight={500} $color="#97B7EF">
            View
          </InterText>
        </ViewRound>
      )
    // return  <StyledTag>{t(`search.status.${status}`)}</StyledTag>
    case 'gracePeriod':
      return (
        <ComingSoonRound>
          <ComingSonText>Coming Soon </ComingSonText>
        </ComingSoonRound>
      )
    case 'premium':
      return (
        <ComingSoonRound>
          <ComingSonText>Coming Soon </ComingSonText>
        </ComingSoonRound>
      )
    case 'available':
      return (
        <RegisterTag>
          <InterText $size="16px" $weight={700}>
            Register Now
          </InterText>
        </RegisterTag>
      )
    // return <StyledTag colorStyle="greenSecondary">{t(`search.status.${status}`)}</StyledTag>
    case 'notOwned':
    case 'notImported':
      return (
        <ComingSoonRound>
          <ComingSonText>Coming Soon </ComingSonText>
        </ComingSoonRound>
      )
    case 'short':
    default:
      return (
        <ComingSoonRound>
          <ComingSonText>Coming Soon </ComingSonText>
        </ComingSoonRound>
      )
  }
}
const AwnsStatusText = ({ status }: { status: RegistrationStatus }) => {
  const { t } = useTranslation('common')
  switch (status) {
    case 'owned':
    case 'imported':
    case 'registered':
      return (
        <InterText $size="14px" $color="#F4C56A" $weight={500}>
          {t(`search.status.${status}`)}
        </InterText>
      )
    case 'gracePeriod':
      return (
        <InterText $size="14px" $color="#fff" $weight={500}>
          {t(`search.status.${status}`)}
        </InterText>
      )
    case 'premium':
      return (
        <InterText $size="14px" $color="#fff" $weight={500}>
          {t(`search.status.${status}`)}
        </InterText>
      )
    case 'available':
      return (
        <InterText $size="14px" $color="#A7F46A" $weight={500}>
          {t(`search.status.${status}`)}
        </InterText>
      )
    case 'notOwned':
    case 'notImported':
      return (
        <InterText $size="14px" $color="#fff" $weight={500}>
          {t(`search.status.${status}`)}
        </InterText>
      )
    case 'short':
    default:
      return (
        <InterText $size="14px" $color="#E46767" $weight={500}>
          {t(`search.status.${status}`)}
        </InterText>
      )
  }
}
// E46767
const TextWrapper = styled.div(
  () => css`
    overflow: hidden;
    text-align: left;
    & > div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: clip;
      text-align: left;
      direction: rtl;
      &::before {
        content: '‎';
      }
    }
  `,
)

const PlaceholderResultItem = ({ input }: { input: string }) => {
  const zorb = useZorb('placeholder', 'name')
  const beautifiedName = useBeautifiedName(input)
  const { chain } = useNetwork()
  return (
    <>
      <LeadingSearchItem>
        <Column>
          <Row>
            <InterText>{beautifiedName}</InterText>
            <ChainRound>
              <InterText $size="14px">{chain?.name || 'Ethereum'} </InterText>
            </ChainRound>
          </Row>
          <InterText $size="14px" $color="#A7F46A">
            -- --
          </InterText>
        </Column>
      </LeadingSearchItem>
      <SpinnerWrapper>
        <Spinner color="accent" />
      </SpinnerWrapper>
    </>
  )
}

const NameResultItem = forwardRef<HTMLDivElement, { name: string; $selected: boolean }>(
  ({ name, ...props }, ref) => {
    // const network = useChainId()
    // const { avatar } = useAvatar(name, network)
    // const zorb = useZorb(name, 'name')
    const { registrationStatus, isLoading, beautifiedName } = useBasicName(name)

    const { chain } = useNetwork()
    const isImported = registrationStatus !== 'notImported'

    return (
      <>
        {isImported && (
          <SearchItem
            data-testid="search-result-name"
            {...props}
            $clickable={registrationStatus !== 'short'}
            ref={ref}
            $gridTemplateColumns="auto auto"
          >
            <LeadingSearchItem>
              <Column>
                <Row>
                  <InterText>{beautifiedName}</InterText>
                  <ChainRound>
                    <InterText $size="14px"> {chain?.name || 'Ethereum'}</InterText>
                  </ChainRound>
                </Row>
                {registrationStatus ? <AwnsStatusText status={registrationStatus} /> : '-- --'}
              </Column>
            </LeadingSearchItem>
            {!isLoading && registrationStatus ? (
              <AwnsStatusTag status={registrationStatus} />
            ) : (
              <SpinnerWrapper>
                <Spinner color="accent" />
              </SpinnerWrapper>
            )}
          </SearchItem>
        )}
      </>
    )
  },
)

type SearchItemType = 'text' | 'error' | 'address' | 'name' | 'nameWithDotEth'

export const SearchResult = ({
  type,
  value,
  hoverCallback,
  clickCallback,
  index,
  selected,
  usingPlaceholder = true,
}: {
  type: SearchItemType
  value: string
  hoverCallback: (index: number) => void
  clickCallback: (index: number) => void
  index: number
  selected: number
  usingPlaceholder?: boolean
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: MouseEvent) => e.preventDefault()

  const handleClick = useCallback(() => {
    clickCallback(index)
  }, [index, clickCallback])

  useEffect(() => {
    const wrapper = wrapperRef.current
    wrapper?.addEventListener('mousedown', handleMouseDown)
    wrapper?.addEventListener('click', handleClick)
    return () => {
      wrapper?.removeEventListener('mousedown', handleMouseDown)
      wrapper?.removeEventListener('click', handleClick)
    }
  }, [handleClick])

  const input = useMemo(() => {
    if (type === 'nameWithDotEth') {
      return `${value!}.aw`
    }
    return value
  }, [type, value])

  const props = useMemo(
    () => ({
      ref: wrapperRef,
      onMouseEnter: () => hoverCallback(index),
      $selected: index === selected,
    }),
    [index, hoverCallback, selected],
  )

  if (usingPlaceholder && type !== 'error' && type !== 'text') {
    return (
      <SearchItem data-testid="search-result-placeholder" {...props}>
        <PlaceholderResultItem input={input} />
      </SearchItem>
    )
  }

  if (type === 'address') {
    return (
      <SearchItem data-testid="search-result-address" $clickable {...props}>
        <AddressResultItem address={input} />
      </SearchItem>
    )
  }

  if (type === 'name' || type === 'nameWithDotEth') {
    return <NameResultItem name={input} {...props} />
  }

  if (type === 'error') {
    console.log('error')

    return (
      <SearchItem data-testid="search-result-error" $selected $error>
        <InterText $color="#97B7EF" $size="14px">
          {value}
        </InterText>
      </SearchItem>
    )
  }

  return (
    <SearchItem data-testid="search-result-text">
      <NoInputYetTypography weight="bold">{value}</NoInputYetTypography>
    </SearchItem>
  )
}
