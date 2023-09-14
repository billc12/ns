import { useMemo } from 'react'
// import { Trans, useTranslation } from 'react-i18next' Helper
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Typography, mq } from '@ensdomains/thorin'

import LinkIcon from '@app/assets/LinkIcon.svg'
import TimeIcon from '@app/assets/TimeIcon.svg'
import TransferIcon from '@app/assets/TransferIcon.svg'
import TestImg from '@app/assets/testImage.png'
import { CopyButton } from '@app/components/Copy'
// import { Outlink } from '@app/components/Outlink'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useOwners from '@app/hooks/useOwners'
import { usePrimary } from '@app/hooks/usePrimary'
import { useProfileActions } from '@app/hooks/useProfileActions'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
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
    justify-content: space-between;
    grid-template-columns: auto 1fr;
    ${mq.sm.max(css`
      width: auto;
      column-gap: 10px;
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

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  name: string
}

const ProfileTab = ({ nameDetails, name }: Props) => {
  // const { t } = useTranslation('profile')

  const chainId = useChainId()
  const { address } = useAccount()
  const breakpoints = useBreakpoint()
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
  console.log(nameDetails.expiryDate)

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
              <CopyButton value="1" />
            </RowValueStyle>

            <RowNameStyle>Owner</RowNameStyle>
            <RowValueStyle>
              {nameDetails?.ownerData?.owner ? shortenAddress(nameDetails?.ownerData?.owner) : '--'}{' '}
              <CopyButton value="1" />
            </RowValueStyle>

            <RowNameStyle>Registration Date</RowNameStyle>
            <RowValueStyle>{nameDetails.expiryDate?.toString() || '--'} </RowValueStyle>

            <RowNameStyle>Expiration Date</RowNameStyle>
            <RowValueStyle>2023.08.26 at 21:45 (UTC+08:00)</RowValueStyle>

            <RowNameStyle>Chain</RowNameStyle>
            <RowValueStyle>Ethereum</RowValueStyle>

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
        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'end',
            marginTop: 20,
          }}
        >
          <ButtonStyle colorStyle="background" prefix={<LinkIcon />}>
            Set Address
          </ButtonStyle>
          <ButtonStyle colorStyle="background" prefix={<TimeIcon />}>
            Extend
          </ButtonStyle>
          <ButtonStyle colorStyle="background" prefix={<TransferIcon />}>
            Transfer
          </ButtonStyle>
        </div>
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
    </DetailsWrapper>
  )
}

export default ProfileTab
