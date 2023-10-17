import { getEncryptedLabelAmount } from '@myclique/awnsjs/utils/labels'
import Head from 'next/head'
import { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Banner, CheckCircleSVG, Typography, mq } from '@ensdomains/thorin'

import BaseLink from '@app/components/@atoms/BaseLink'
import { LoadingOverlay } from '@app/components/LoadingOverlay'
import { Table } from '@app/components/table'
import useSignName from '@app/hooks/names/useSignName'
// import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useRecentTransactions } from '@app/hooks/transactions/useRecentTransactions'
import { useChainName } from '@app/hooks/useChainName'
import useGetTransfers from '@app/hooks/useGetTransfers'
// import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { useQueryParameterState } from '@app/hooks/useQueryParameterState'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { emptyAddress } from '@app/utils/constants'
// import { Content, ContentWarning } from '@app/layouts/Content'
import { formatFullExpiry, makeEtherscanLink, shortenAddress } from '@app/utils/utils'

import { shouldShowSuccessPage } from '../../import/[name]/shared'
import { AccountHeader } from '../AccountHeader'
import { BigPremiumText } from './registration/PremiumTitle'
import { AssetsTab } from './tabs/AssetsTab'
import { InvitationCode } from './tabs/InvitationCodeTab'
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
    ${mq.sm.max(css`
      gap: 10px;
      padding: 0 10px 0 0;
    `)}
  `,
)

// const PageButtonsStyle = styled(PageButtons)(
//   () => css`
//     width: auto;
//     & > button {
//       width: auto;
//       height: auto;
//       min-height: auto;
//       min-width: auto;
//       border: none;
//       padding: 0;
//     }
//   `,
// )

const TopRowStyle = styled.div(
  () => css`
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
  `,
)

const Relates = styled.div(
  () => css`
    width: 840px;
    ${mq.sm.max(css`
      width: auto;
      display: grid;
      gap: 10px;
    `)}
  `,
)

const TableContentStyle = styled(Typography)(
  () => css`
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    ${mq.sm.max(css`
      height: 36px;
    `)};
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
    ${mq.sm.max(css`
      padding: 0 10px 0;
      height: 60px;
    `)}
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
    cursor: pointer;
    position: relative;
    &:hover {
      color: ${$selected ? theme.colors.accentBright : theme.colors.text};
    }
    ::before {
      display: ${$selected ? 'block' : 'none'};
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background: var(--main, #0049c6);
      position: absolute;
      bottom: 0;
      left: 0;
      content: ' ';
    }
    ${mq.sm.max(css`
      font-size: 13px;
    `)}
  `,
)

const CardTitleStyle = styled(Typography)(
  () => css`
    color: var(--word-color, #3f5170);
    font-size: 24px;
    font-weight: 600;
    line-height: normal;
    ${mq.sm.max(css`
      font-size: 18px;
    `)}
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

const ProfileContent = ({ isSelf, isLoading: _isLoading, name }: Props) => {
  const { result } = useGetTransfers(name)
  const chainName = useChainName()
  const tableList = useMemo(() => {
    if (!result || !result.length) return []
    return result
      .filter(({ owner }) => owner.id !== emptyAddress)
      .map(({ eventTime, owner, preOwner, transactionID }) => [
        <TableContentStyle>{shortenAddress(preOwner.id)}</TableContentStyle>,
        <TableContentStyle
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => window.open(makeEtherscanLink(transactionID, chainName), '_blank')}
        >
          {shortenAddress(owner.id)}
        </TableContentStyle>,
        <TableContentStyle>{new Date(eventTime * 1000).toLocaleString()}</TableContentStyle>,
        <TableContentStyle
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => window.open(makeEtherscanLink(transactionID, chainName), '_blank')}
        >
          {shortenAddress(transactionID)}
        </TableContentStyle>,
      ])
  }, [chainName, result])
  const router = useRouterWithHistory()
  const { t } = useTranslation('profile')
  // const chainId = useChainId()
  const { address } = useAccount()
  const transactions = useRecentTransactions()
  const breakpoints = useBreakpoint()
  // const [current, setCurrent] = useState<number>(1)
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
  const { data } = useSignName(normalisedName)
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
  console.log(titleContent, descriptionContent)
  return (
    <>
      <Head>
        <title>{name && `${name} -`} AWNS</title>
        <meta name="description" content={descriptionContent} />
      </Head>
      {!isLoading ? (
        <div style={{ display: 'grid', gap: 20, padding: isSmDown ? '20px' : 0 }}>
          {typeof window === 'object' && isOwner && <AccountHeader />}

          <ContentStyle
            key={0}
            style={{
              width: isSmDown ? 'auto' : 840,
            }}
          >
            <CardsStyle>
              {data?.isPremium ? (
                <BigPremiumText>{beautifiedName}</BigPremiumText>
              ) : (
                <CardTitleStyle>{beautifiedName}</CardTitleStyle>
              )}

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
              <AssetsTab nameDetails={nameDetails} />
            ) : (
              <>
                <InvitationCode />
              </>
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
            <Relates>
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
                      {/* <PageButtonsStyle
                        alwaysShowFirst
                        alwaysShowLast
                        current={current}
                        size="small"
                        total={6}
                        onChange={(value) => setCurrent(value)}
                      /> */}
                    </TopRowStyle>
                  </>
                }
              />
            </Relates>
          )}
        </div>
      ) : (
        <>
          <LoadingOverlay />
        </>
      )}
    </>
  )
}

export default ProfileContent
