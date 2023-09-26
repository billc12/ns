import { useMemo, useState } from 'react'
// import { Trans, useTranslation } from 'react-i18next' Helper
import styled, { css } from 'styled-components'
import { useAccount, useNetwork } from 'wagmi'

import { Button, Typography, mq } from '@ensdomains/thorin'

import LinkIcon from '@app/assets/LinkIcon.svg'
import TestImg from '@app/assets/TestImage.png'
import TimeIcon from '@app/assets/TimeIcon.svg'
import TransferIcon from '@app/assets/TransferIcon.svg'
import SetAddressDialog from '@app/components/Awns/Dialog/SetAddressDialog'
import TransferDialog from '@app/components/Awns/Dialog/TransferDialog'
import { CopyButton } from '@app/components/Copy'
// import { Outlink } from '@app/components/Outlink'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useHasGlobalError } from '@app/hooks/errors/useHasGlobalError'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useOwners from '@app/hooks/useOwners'
import { usePrimary } from '@app/hooks/usePrimary'
import { AuctionType, useProfileActions } from '@app/hooks/useProfileActions'
import useRegistrationDate from '@app/hooks/useRegistrationData'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { shouldShowExtendWarning } from '@app/utils/abilities/shouldShowExtendWarning'
import { emptyAddress } from '@app/utils/constants'
// import { getSupportLink } from '@app/utils/supportLinks'
import { shortenAddress, validateExpiry } from '@app/utils/utils'

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
    grid-template-columns: auto 1fr;
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
    color: var(--word-color2, #3f5170);
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    text-align: right;
    display: flex;
    justify-content: end;
  `,
)

const ButtonsStyle = styled.div(
  () => css`
    display: flex;
    gap: 10px;
    justify-content: end;
    margin-top: 20px;
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
      width: auto;
      gap: 6px;
      padding: 0 6px;
      height: 32px;
      svg {
        width: 12px;
        height: 12px;
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
  `,
)
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
  const [openTransferDialog, setOpenTransferDialog] = useState(false)
  const [openAddressDialog, setOpenAddressDialog] = useState<boolean>(false)
  const transferHandleDialog = (open: boolean) => {
    setOpenTransferDialog(open)
  }
  const addressHandleDialog = (open: boolean) => {
    setOpenAddressDialog(open)
  }

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

  const IsOwner = useMemo(() => {
    if (address === ownerData?.owner) {
      return true
    }
    return false
  }, [address, ownerData?.owner])
  console.log(IsOwner)

  const PrimaryNameAuction = profileActions.profileActions?.filter(
    (item) => !!item.type && item.type === AuctionType.PrimaryName,
  )[0]
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
  const showExtendNamesInput = prepareDataInput('AwnsExtendNames')
  const handleExtend = () => {
    showExtendNamesInput(`extend-names-${name}`, {
      names: [name],
      isSelf: shouldShowExtendWarning(abilities.data),
    })
  }
  const showEditResolveAddressInput = prepareDataInput('EditResolveAddress')
  const handleEditResolveAddress = () => {
    showEditResolveAddressInput(`edit-resolve-address-${name}`, { name })
  }
  const hasGlobalError = useHasGlobalError()
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
            <StyledImg src={TestImg.src} />
          </StyleBg>
          <ContentStyled>
            <RowNameStyle>Addresses</RowNameStyle>
            <RowValueStyle>
              {nameDetails?.ownerData?.owner ? shortenAddress(nameDetails?.ownerData?.owner) : '--'}{' '}
              <CopyButton value={nameDetails?.ownerData?.owner} />
            </RowValueStyle>

            <RowNameStyle>Owner</RowNameStyle>
            <RowValueStyle>
              {nameDetails?.ownerData?.owner ? shortenAddress(nameDetails?.ownerData?.owner) : '--'}{' '}
              <CopyButton value={nameDetails?.ownerData?.owner} />
            </RowValueStyle>

            <RowNameStyle>Registration Date</RowNameStyle>
            <RowValueStyle>{registrationData?.registrationDate?.toString() || '--'}</RowValueStyle>

            <RowNameStyle>Expiration Date</RowNameStyle>
            <RowValueStyle>{nameDetails.expiryDate?.toString() || '--'} </RowValueStyle>

            <RowNameStyle>Chain</RowNameStyle>
            <RowValueStyle>{currentChain?.name || '--'}</RowValueStyle>

            <RowNameStyle>Contract Address</RowNameStyle>
            <RowValueStyle>
              0x6621...2ae908 <CopyButton value="1" />
            </RowValueStyle>

            <RowNameStyle>Contract Address</RowNameStyle>
            <RowValueStyle>
              0x45678...2aef4 <CopyButton value="1" />
            </RowValueStyle>
          </ContentStyled>
        </div>
        <ButtonsStyle>
          {profileActions.canSetMainName && (
            <BtnSetAdd
              onClick={() => {
                addressHandleDialog(true)
              }}
            >
              Set AWNS for this address
            </BtnSetAdd>
          )}
          {abilities.data.canEdit && nameDetails.profile?.resolverAddress !== emptyAddress && (
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
            <ButtonStyle onClick={handleExtend} colorStyle="background" prefix={<TimeIcon />}>
              Extend
            </ButtonStyle>
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
        {isWrapped && !normalisedName.endsWith('.eth') && (
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
      <TransferDialog
        open={openTransferDialog}
        handleOpen={transferHandleDialog}
        nameDetails={nameDetails}
      />
      <SetAddressDialog
        open={openAddressDialog}
        handleOpen={addressHandleDialog}
        nameDetails={nameDetails}
        address={address}
        submit={() => {
          PrimaryNameAuction?.onClick()
        }}
      />
    </DetailsWrapper>
  )
}

export default ProfileTab
