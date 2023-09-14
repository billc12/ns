import Head from 'next/head'
import { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { getEncryptedLabelAmount } from '@ensdomains/ensjs/utils/labels'
import { Banner, CheckCircleSVG, PageButtons, Typography } from '@ensdomains/thorin'

import BaseLink from '@app/components/@atoms/BaseLink'
import { Table } from '@app/components/table'
// import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
// import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { useQueryParameterState } from '@app/hooks/useQueryParameterState'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
// import { Content, ContentWarning } from '@app/layouts/Content'
import { formatFullExpiry } from '@app/utils/utils'

import { shouldShowSuccessPage } from '../../import/[name]/shared'
import { AccountHeader } from '../AccountHeader'
import { AssetsTab } from './tabs/AssetsTab'
// import MoreTab from './tabs/MoreTab/MoreTab'
// import { PermissionsTab } from './tabs/PermissionsTab/PermissionsTab'
import ProfileTab from './tabs/ProfileTab'

// import { RecordsTab } from './tabs/RecordsTab'

// import { SubnamesTab } from './tabs/SubnamesTab'

const TabButtonContainer = styled.div(
  ({ theme }) => css`
    height: 100%;
    margin-left: -${theme.radii.extraLarge};
    margin-right: -${theme.radii.extraLarge};
    padding: 0 calc(${theme.radii.extraLarge} * 2);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 100px;
    flex-gap: ${theme.space['6']};
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  `,
)

const PageButtonsStyle = styled(PageButtons)(
  () => css`
    width: auto;
    & > button {
      width: auto;
      height: auto;
      min-height: auto;
      min-width: auto;
      border: none;
      padding: 0;
    }
  `,
)

const TopRowStyle = styled.div(
  () => css`
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
  `,
)

const TableContentStyle = styled(Typography)(
  () => css`
    height: 58px;
    display: flex;
    align-items: center;
  `,
)

const ContentStyle = styled.div(
  () => css`
    background: #fff;
    height: auto;
    min-height: 500px;
    border-radius: 10px;
    border: 1px solid var(--line, #d4d7e2);
  `,
)

const CardsStyle = styled.div(
  () => css`
    display: flex;
    height: 80px;
    justify-content: space-between;
    align-items: center;
    padding: 0 80px 0 30px;
    border-bottom: 1px solid #dce6ed;
  `,
)

const TabButton = styled.button<{ $selected: boolean }>(
  ({ theme, $selected }) => css`
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    font-weight: ${$selected ? 600 : 400};
    color: ${$selected ? '#0049C6' : '#3F5170'};
    font-size: ${theme.fontSizes.body};
    transition: all 0.15s ease-in-out;
    height: 100%;
    /* border-bottom: ${$selected ? '4px solid #0049C6' : 'none'}; */
    cursor: pointer;
    &:hover {
      color: ${$selected ? theme.colors.accentBright : theme.colors.text};
    }
  `,
)

const CardTitleStyle = styled(Typography)(
  () => css`
    color: var(--word-color, #3f5170);
    font-size: 24px;
    font-weight: 600;
    line-height: normal;
  `,
)

// const tabs = ['profile', 'records', 'subnames', 'permissions', 'more'] as const
const tabs = ['detail', 'assets', 'invitationCode'] as const
type Tab = typeof tabs[number]

type Props = {
  isSelf: boolean
  isLoading: boolean
  name: string
}

export const NameAvailableBanner = ({
  normalisedName,
  expiryDate,
}: {
  normalisedName: string
  expiryDate?: Date
}) => {
  const { t } = useTranslation('profile')
  return (
    <BaseLink href={`/register/${normalisedName}`} passHref legacyBehavior>
      <Banner
        alert="info"
        as="a"
        icon={<CheckCircleSVG />}
        title={t('banner.available.title', { name: normalisedName })}
      >
        <Trans
          ns="profile"
          i18nKey="banner.available.description"
          values={{
            date: formatFullExpiry(expiryDate),
          }}
          components={{ strong: <strong /> }}
        />
      </Banner>
    </BaseLink>
  )
}
const arr = [
  { a: '0x6621...2ae908', b: '0x6621...2ae908', c: '2023.08.26 21:45:21', d: '0x6621...2ae908' },
  { a: '0x6621...2ae908', b: '0x6621...2ae908', c: '2023.08.26 21:45:21', d: '0x6621...2ae908' },
  { a: '0x6621...2ae908', b: '0x6621...2ae908', c: '2023.08.26 21:45:21', d: '0x6621...2ae908' },
  { a: '0x6621...2ae908', b: '0x6621...2ae908', c: '2023.08.26 21:45:21', d: '0x6621...2ae908' },
]
const ProfileContent = ({ isSelf, isLoading: _isLoading, name }: Props) => {
  const tableList = useMemo(() => {
    return arr.map(({ a, b, c, d }) => [
      <TableContentStyle>{a}</TableContentStyle>,
      <TableContentStyle>{b}</TableContentStyle>,
      <TableContentStyle>{c}</TableContentStyle>,
      <TableContentStyle>{d}</TableContentStyle>,
      <TableContentStyle>{d}</TableContentStyle>,
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const router = useRouterWithHistory()
  const { t } = useTranslation('profile')
  // const chainId = useChainId()
  const { address } = useAccount()
  const transactions = useRecentTransactions()
  const breakpoints = useBreakpoint()

  const nameDetails = useNameDetails(name)
  const {
    // error,
    // errorTitle,
    profile,
    // gracePeriodEndDate,
    // expiryDate,
    normalisedName,
    beautifiedName,
    isValid,
    // profileIsCachedData,
    // basicIsCachedData,
    // isWrapped,
    isLoading: detailsLoading,
    // wrapperData,
    // registrationStatus,
  } = nameDetails

  const isLoading = _isLoading || detailsLoading

  const isSmDown = useMemo(() => {
    if (breakpoints.sm) {
      return false
    }
    return true
  }, [breakpoints.sm])

  useProtectedRoute(
    '/',
    // When anything is loading, return true
    isLoading
      ? true
      : // if is self, user must be connected
        (isSelf ? address : true) && typeof name === 'string' && name.length > 0,
  )

  const isOwner = useMemo(() => {
    if (address === nameDetails.ownerData?.owner) {
      return true
    }
    return false
  }, [address, nameDetails.ownerData?.owner])
  console.log(isSmDown, isOwner)

  const [titleContent, descriptionContent] = useMemo(() => {
    if (isSelf) {
      return [t('yourProfile'), '']
    }
    if (beautifiedName) {
      return [
        t('meta.title', {
          name: beautifiedName,
        }),
        t('meta.description', {
          name: beautifiedName,
        }),
      ]
    }
    if (typeof isValid === 'boolean' && isValid === false) {
      return [t('errors.invalidName'), t('errors.invalidName')]
    }
    return [
      t('meta.title', {
        name,
      }),
      t('meta.description', {
        name,
      }),
    ]
  }, [isSelf, beautifiedName, isValid, name, t])

  // const [tab, setTab] = useQueryParameterState<Tab>('tab', 'profile')
  const [tab, setTab] = useQueryParameterState<Tab>('tab', 'detail')
  console.log('tab', tab)
  // const tab = isWrapped ? tabs : tabs.filter((_tab) => _tab !== 'permissions')

  // const abilities = useAbilities(normalisedName)

  // hook for redirecting to the correct profile url
  // profile.decryptedName fetches labels from NW/subgraph
  // normalisedName fetches labels from localStorage
  useEffect(() => {
    if (
      name !== profile?.decryptedName &&
      profile?.decryptedName &&
      !isSelf &&
      getEncryptedLabelAmount(normalisedName) > getEncryptedLabelAmount(profile.decryptedName)
    ) {
      // if the fetched decrypted name is different to the current name
      // and the decrypted name has less encrypted labels than the normalised name
      // direct to the fetched decrypted name
      router.replace(`/profile/${profile.decryptedName}`, { shallow: true, maintainHistory: true })
    } else if (
      name !== normalisedName &&
      normalisedName &&
      !isSelf &&
      (!profile?.decryptedName ||
        getEncryptedLabelAmount(profile.decryptedName) > getEncryptedLabelAmount(normalisedName)) &&
      decodeURIComponent(name) !== normalisedName
    ) {
      // if the normalised name is different to the current name
      // and the normalised name has less encrypted labels than the decrypted name
      // direct to normalised name
      router.replace(`/profile/${normalisedName}`, { shallow: true, maintainHistory: true })
    }
  }, [profile?.decryptedName, normalisedName, name, isSelf, router])

  useEffect(() => {
    if (isSelf && name) {
      router.replace(`/profile/${name}`)
    }
  }, [isSelf, name, router])

  useEffect(() => {
    if (shouldShowSuccessPage(transactions)) {
      router.push(`/import/${name}`)
    }
  }, [name, router, transactions])

  // const infoBanner = useMemo(() => {
  //   if (
  //     registrationStatus !== 'gracePeriod' &&
  //     gracePeriodEndDate &&
  //     gracePeriodEndDate < new Date()
  //   ) {
  //     return <NameAvailableBanner {...{ normalisedName, expiryDate }} />
  //   }
  //   return undefined
  // }, [registrationStatus, gracePeriodEndDate, normalisedName, expiryDate])

  // const warning: ContentWarning = useMemo(() => {
  //   if (error)
  //     return {
  //       type: 'warning',
  //       message: error,
  //       title: errorTitle,
  //     }
  //   return undefined
  // }, [error, errorTitle])
  console.log(titleContent)

  return (
    <>
      <Head>
        <title>{titleContent}</title>
        <meta name="description" content={descriptionContent} />
      </Head>
      <div style={{ display: 'grid', gap: 20 }}>
        {typeof window === 'object' && isOwner && (
          <AccountHeader address={nameDetails.profile?.address} />
        )}

        <ContentStyle
          key={0}
          style={{
            width: isSmDown ? 'auto' : 840,
          }}
        >
          <CardsStyle>
            <CardTitleStyle>{beautifiedName}</CardTitleStyle>
            <TabButtonContainer>
              {isOwner
                ? tabs.map((tabItem) => (
                    <TabButton
                      key={tabItem}
                      data-testid={`${tabItem}-tab`}
                      $selected={tabItem === tab}
                      onClick={() => setTab(tabItem)}
                    >
                      {t(`tabs.${tabItem}.name`)}
                    </TabButton>
                  ))
                : tabs
                    .filter((item) => item !== 'invitationCode')
                    .map((tabItem) => (
                      <TabButton
                        key={tabItem}
                        data-testid={`${tabItem}-tab`}
                        $selected={tabItem === tab}
                        onClick={() => setTab(tabItem)}
                      >
                        {t(`tabs.${tabItem}.name`)}
                      </TabButton>
                    ))}
            </TabButtonContainer>
          </CardsStyle>

          {tab === 'detail' ? (
            <ProfileTab name={normalisedName} nameDetails={nameDetails} />
          ) : tab === 'assets' ? (
            <AssetsTab />
          ) : (
            <></>
          )}

          {/* <Content noTitle title={beautifiedName} loading={isLoading} copyValue={beautifiedName}>
        {{
          info: infoBanner,
          warning,
          header: (
            <TabButtonContainer>
              {tabs.map((tabItem) => (
                <TabButton
                  key={tabItem}
                  data-testid={`${tabItem}-tab`}
                  $selected={tabItem === tab}
                  onClick={() => setTab(tabItem)}
                >
                  <Typography fontVariant="extraLargeBold" color="inherit">
                    {t(`tabs.${tabItem}.name`)}
                  </Typography>
                </TabButton>
              ))}
            </TabButtonContainer>
          ),
          trailing: {
            detail: <ProfileTab name={normalisedName} nameDetails={nameDetails} />,
            assets: (
              <AssetsTab />
              // <RecordsTab
              //   network={chainId}
              //   name={normalisedName}
              //   texts={(profile?.records?.texts as any) || []}
              //   addresses={(profile?.records?.coinTypes as any) || []}
              //   contentHash={profile?.records?.contentHash}
              //   abi={profile?.records?.abi}
              //   resolverAddress={profile?.resolverAddress}
              //   canEdit={abilities.data?.canEdit}
              //   canEditRecords={abilities.data?.canEditRecords}
              //   isCached={profileIsCachedData}
              // />
            ),
            // subnames: (
            //   <SubnamesTab
            //     name={normalisedName}
            //     isWrapped={isWrapped}
            //     canEdit={!!abilities.data?.canEdit}
            //     canCreateSubdomains={!!abilities.data?.canCreateSubdomains}
            //     network={chainId}
            //   />
            // ),
            // permissions: (
            //   <PermissionsTab
            //     name={normalisedName}
            //     wrapperData={wrapperData}
            //     isCached={basicIsCachedData}
            //   />
            // ),
            // more: (
            //   <MoreTab name={normalisedName} nameDetails={nameDetails} abilities={abilities.data} />
            // ),
          }[tab],
        }}
      </Content> */}
        </ContentStyle>

        {tab === 'detail' && (
          <div key={1} style={{ width: isSmDown ? 'auto' : 840 }}>
            <Table
              TableHeight={400}
              labels={['From', 'To', 'Date', 'TXid', ' ']}
              rows={tableList}
              hederRow={
                <>
                  <TopRowStyle>
                    <Typography
                      style={{
                        color: 'var(--word-color, #3F5170)',
                        fontSize: '16px',
                        fontWeight: 600,
                      }}
                    >
                      Related Transactions
                    </Typography>
                    <PageButtonsStyle
                      alwaysShowFirst
                      alwaysShowLast
                      current={4}
                      size="small"
                      total={6}
                      onChange={(value) => console.log(value)}
                    />
                  </TopRowStyle>
                </>
              }
            />
          </div>
        )}
      </div>
    </>
  )
}

export default ProfileContent
