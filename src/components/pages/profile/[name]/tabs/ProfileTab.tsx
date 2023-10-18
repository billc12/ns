import { useMemo } from 'react'
// import { Trans, useTranslation } from 'react-i18next' Helper
import styled, { css } from 'styled-components'
import { useAccount, useNetwork } from 'wagmi'

import { Button, Tooltip, Typography, mq } from '@ensdomains/thorin'

import LinkIcon from '@app/assets/LinkIcon.svg'
import TestImg from '@app/assets/TestImage.png'
import TransferIcon from '@app/assets/TransferIcon.svg'
import ExtendBtn from '@app/components/Awns/Button/Extend'
import { CopyButton } from '@app/components/Copy'
// import { Outlink } from '@app/components/Outlink'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useHasGlobalError } from '@app/hooks/errors/useHasGlobalError'
import { useChainId } from '@app/hooks/useChainId'
import useGetNftAddress from '@app/hooks/useGetNftAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useOwners from '@app/hooks/useOwners'
import { usePrimary } from '@app/hooks/usePrimary'
import { useProfileActions } from '@app/hooks/useProfileActions'
import useRegistrationDate from '@app/hooks/useRegistrationData'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { AddressRecord } from '@app/transaction-flow/input/AdvancedEditor/EditResolveAddress-flow'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { emptyAddress } from '@app/utils/constants'
// import { getSupportLink } from '@app/utils/supportLinks'
import { shortenAddress, validateExpiry } from '@app/utils/utils'

import { useEthInvoice } from '../registration/steps/Awns_Complete'

const DetailsWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    width: 100%;
  `,
)

const StyleBg = styled.div(
  () => css`
    height: 321px;
    width: 321px;
    background: var(--bg_light, #f7fafc);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    margin: auto;
    align-items: center;
    padding: 13px;
    ${mq.sm.max(css`
      height: 290px;
      width: 290px;
    `)}
  `,
)

const StyledImg = styled.img(
  () => css`
    width: 100%;
    height: 100%;
    border-radius: 8px;
  `,
)

const ContentStyled = styled.div(
  () => css`
    padding: 30px;
    height: 321px;
    width: 439px;
    border-radius: 8px;
    background: var(--bg_light, #f7fafc);
    display: grid;
    column-gap: 10px;
    justify-content: space-between;
    grid-template-columns: auto 200px;
    ${mq.sm.max(css`
      width: auto;
      padding: 15px;
    `)}
  `,
)

const RowNameStyle = styled(Typography)(
  () => css`
    color: var(--word-color2, #8d8ea5);
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
  `,
)
const RowValueStyle = styled(Typography)(
  () => css`
    display: flex;
    justify-content: end;
    color: var(--word-color2, #3f5170);
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    text-align: right;
    white-space: pre-wrap;
  `,
)

const ButtonsStyle = styled.div(
  () => css`
    display: flex;
    gap: 10px;
    justify-content: end;
    margin-top: 20px;
    ${mq.sm.max(css`
      flex-direction: column;
    `)}
  `,
)

const ButtonStyle = styled(Button)(
  () => css`
    height: 40px;
    width: 150px;
    gap: 12px;
    color: var(--word-color, #3f5170);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    border: 1px solid var(--line, #d4d7e2);
    svg {
      width: auto;
      height: auto;
    }
    ${mq.sm.max(css`
      width: 100%;
      gap: 6px;
      padding: 0 6px;
      svg {
        width: 16px;
        height: 16px;
      }
    `)}
  `,
)
const BtnSetAdd = styled(Button)(
  () => css`
    width: 265px;
    height: 40px;
    border-radius: 6px;
    background: #0049c6;
    ${mq.sm.max(css`
      width: 100%;
      font-size: 14px;
    `)}
  `,
)
const TimeRound = styled(Button)`
  &:hover,
  & {
    background: none;
    padding: 0;
    width: 100%;
    height: max-content;
  }
  & > div > div {
    text-decoration: underline;
  }
`
type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  name: string
}
export function formatDateString(originalDateString: any) {
  const originalDate = new Date(originalDateString)
  const timestamp = originalDate.getTime()
  const targetDate = new Date(timestamp + originalDate.getTimezoneOffset() * 60000)

  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const hours = String(targetDate.getHours()).padStart(2, '0')
  const minutes = String(targetDate.getMinutes()).padStart(2, '0')

  const timezoneOffsetMinutes = targetDate.getTimezoneOffset()
  const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffsetMinutes / 60))
  const timezoneOffsetMinutesRemainder = Math.abs(timezoneOffsetMinutes % 60)
  const timezoneOffsetSign = timezoneOffsetMinutes < 0 ? '+' : '-'
  const timezoneOffsetString = `${timezoneOffsetSign}${String(timezoneOffsetHours).padStart(
    2,
    '0',
  )}:${String(timezoneOffsetMinutesRemainder).padStart(2, '0')}`

  const formattedDate = `${year}.${month}.${day} at ${hours}:${minutes} (UTC${timezoneOffsetString})`

  return formattedDate
}
const ProfileTab = ({ nameDetails, name }: Props) => {
  // const { t } = useTranslation('profile')

  const chainId = useChainId()
  const { address } = useAccount()
  const breakpoints = useBreakpoint()
  const { data: registrationData } = useRegistrationDate(name)
  const { chain: currentChain } = useNetwork()

  const {
    profile,
    normalisedName,
    profileIsCachedData,
    basicIsCachedData,
    ownerData,
    wrapperData,
    expiryDate,
    dnsOwner,
    // isWrapped,
    pccExpired,
    gracePeriodEndDate,
  } = nameDetails

  const abilities = useAbilities(name)

  const { data: primaryData } = usePrimary(address)

  const owners = useOwners({
    ownerData: ownerData!,
    wrapperData: wrapperData!,
    dnsOwner,
    abilities: abilities.data,
  })

  const profileActions = useProfileActions({
    address,
    name,
    profile,
    abilities: abilities.data,
    ownerData,
    wrapperData,
    expiryDate,
  })

  const isExpired = useMemo(
    () => gracePeriodEndDate && gracePeriodEndDate < new Date(),
    [gracePeriodEndDate],
  )
  const snippetButton = useMemo(() => {
    if (isExpired) return 'register'
    if (abilities.data?.canExtend) return 'extend'
  }, [isExpired, abilities.data?.canExtend])

  const getTextRecord = (key: string) => profile?.records?.texts?.find((x) => x.key === key)

  const isSmDown = useMemo(() => {
    if (breakpoints.sm) {
      return false
    }
    return true
  }, [breakpoints.sm])
  const { prepareDataInput } = useTransactionFlow()

  const showSendNameInput = prepareDataInput('AwnsSendName')
  const handleSend = () => {
    showSendNameInput(`send-name-${name}`, {
      name,
    })
  }

  const showEditResolveAddressInput = prepareDataInput('EditResolveAddress')
  const handleEditResolveAddress = () => {
    showEditResolveAddressInput(`edit-resolve-address-${name}`, { name })
  }
  const showSetPrimaryNameInput = prepareDataInput('SetPrimaryName')
  const handleSelectPrimaryName = () => {
    if (address && name) {
      showSetPrimaryNameInput(`edit-resolve-address-${name}`, { address, name })
    }
  }
  const hasGlobalError = useHasGlobalError()
  const parseUseAddress: AddressRecord = nameDetails.profile?.records.coinTypes?.find(
    ({ coin }) => coin === 'ETH',
  ) as any
  const { avatarSrc } = useEthInvoice(normalisedName, false)
  const { accountAddress } = useGetNftAddress(normalisedName)

  const hide = false
  return (
    <DetailsWrapper>
      <div
        style={{
          padding: '20px',
        }}
      >
        <div
          style={{
            display: isSmDown ? 'grid' : 'flex',
            gap: 20,
            justifyContent: isSmDown ? 'center' : 'normal',
          }}
        >
          <StyleBg>
            <StyledImg src={avatarSrc || TestImg.src} />
          </StyleBg>
          <ContentStyled>
            <RowNameStyle>Addresses</RowNameStyle>
            <RowValueStyle>
              {parseUseAddress ? shortenAddress(parseUseAddress.addr) : '--'}
              {parseUseAddress && <CopyButton value={parseUseAddress.addr || ''} />}
            </RowValueStyle>

            <RowNameStyle>Owner</RowNameStyle>
            <RowValueStyle>
              {nameDetails?.ownerData?.owner ? shortenAddress(nameDetails?.ownerData?.owner) : '--'}
              <CopyButton value={nameDetails?.ownerData?.owner} />
            </RowValueStyle>

            <RowNameStyle>Registration</RowNameStyle>
            <Tooltip
              additionalGap={0}
              content={
                <RowValueStyle style={{ justifyContent: 'center' }}>
                  {registrationData?.registrationDate?.toUTCString()}
                </RowValueStyle>
              }
              mobilePlacement="top"
              placement="top"
            >
              <TimeRound id="buttonIdTop">
                <RowValueStyle>{registrationData?.registrationDate?.toString()}</RowValueStyle>
              </TimeRound>
            </Tooltip>

            <RowNameStyle>Expiration</RowNameStyle>

            <Tooltip
              additionalGap={0}
              content={
                <RowValueStyle style={{ justifyContent: 'center' }}>
                  {nameDetails.expiryDate?.toUTCString()}
                </RowValueStyle>
              }
              mobilePlacement="top"
              placement="top"
            >
              <TimeRound id="buttonIdTop">
                <RowValueStyle>{nameDetails.expiryDate?.toString()}</RowValueStyle>
              </TimeRound>
            </Tooltip>

            <RowNameStyle>Chain</RowNameStyle>
            <RowValueStyle>{currentChain?.name || 'Sepolia'}</RowValueStyle>

            <RowNameStyle>Resolver Address</RowNameStyle>
            <RowValueStyle>
              {profile ? shortenAddress(profile.resolverAddress) : '--'}
              <CopyButton value={profile?.resolverAddress} />
            </RowValueStyle>

            <RowNameStyle>6551</RowNameStyle>
            {accountAddress ? (
              <RowValueStyle>
                {shortenAddress(accountAddress)}
                <CopyButton value={accountAddress} />
              </RowValueStyle>
            ) : (
              <RowValueStyle>--</RowValueStyle>
            )}
          </ContentStyled>
        </div>
        <ButtonsStyle>
          {profileActions.canSetMainName && (
            <BtnSetAdd onClick={handleSelectPrimaryName}>Set AWNS for this address</BtnSetAdd>
          )}
          {abilities.data.canEdit && hide && nameDetails.profile?.resolverAddress !== emptyAddress && (
            <ButtonStyle
              colorStyle="background"
              onClick={handleEditResolveAddress}
              prefix={<LinkIcon />}
              disabled={!(abilities.data.canEditRecords && !hasGlobalError)}
            >
              Set Address
            </ButtonStyle>
          )}

          {abilities.data.canExtend && (
            // <ButtonStyle onClick={handleExtend} colorStyle="background" prefix={<TimeIcon />}>
            //   Extend
            // </ButtonStyle>
            <ExtendBtn name={name} />
          )}

          {abilities.data.canSend && (
            <ButtonStyle
              onClick={() => handleSend()}
              colorStyle="background"
              prefix={<TransferIcon />}
            >
              Transfer
            </ButtonStyle>
          )}
        </ButtonsStyle>
      </div>

      {false && (
        <ProfileSnippet
          name={normalisedName}
          network={chainId}
          getTextRecord={getTextRecord}
          button={snippetButton}
          isPrimary={name === primaryData?.name}
        >
          {/* {nameDetails.isNonASCII && (
          <Helper type="warning" alignment="horizontal">
            <Trans
              i18nKey="tabs.profile.warnings.homoglyph"
              ns="profile"
              components={{
                a: <Outlink href={getSupportLink('homoglyphs')} />,
              }}
            />
          </Helper>
        )}
        {isWrapped && !normalisedName.endsWith('.aw') && (
          <Helper type="warning" alignment="horizontal">
            {t('tabs.profile.warnings.wrappedDNS')}
          </Helper>
        )} */}
        </ProfileSnippet>
      )}
      {false && (
        <ProfileDetails
          expiryDate={validateExpiry(
            normalisedName,
            wrapperData,
            expiryDate || wrapperData?.expiryDate,
            pccExpired,
          )}
          pccExpired={!!pccExpired}
          isCached={profileIsCachedData || basicIsCachedData || abilities.isCachedData}
          addresses={(profile?.records?.coinTypes || []).map((item: any) => ({
            key: item.coin,
            value: item.addr,
          }))}
          textRecords={(profile?.records?.texts || [])
            .map((item: any) => ({ key: item.key, value: item.value }))
            .filter((item: any) => item.value !== null)}
          contentHash={profile?.records?.contentHash}
          owners={owners}
          name={normalisedName}
          actions={profileActions.profileActions}
          gracePeriodEndDate={gracePeriodEndDate}
        />
      )}
    </DetailsWrapper>
  )
}

export default ProfileTab
