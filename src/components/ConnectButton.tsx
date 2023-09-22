import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import { Key, ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useBalance, useDisconnect } from 'wagmi'

import {
  Button,
  CheckSVG,
  CogSVG,
  CopySVG,
  Dropdown,
  ExitSVG,
  PersonSVG,
  Profile,
  mq,
} from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import DefaultUser from '@app/assets/DefaultUser.svg'
import InfoSVG from '@app/assets/Info.svg'
import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useAvatar } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { useCopied } from '@app/hooks/useCopied'
import { usePrimary } from '@app/hooks/usePrimary'
import { useZorb } from '@app/hooks/useZorb'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { shortenAddress } from '@app/utils/utils'

import BaseLink from './@atoms/BaseLink'
import { InterText } from './Awns_Header'

const StyledButtonWrapper = styled.div<{ $isTabBar?: boolean; $large?: boolean }>(
  ({ theme, $isTabBar, $large }) => [
    $isTabBar
      ? css`
          position: absolute;
          align-self: center;
          justify-self: center;

          right: ${theme.space['2']};

          & button {
            padding: 0 ${theme.space['4']};
            width: ${theme.space.full};
            height: ${theme.space['10']};
            border-radius: ${theme.radii.full};
            font-size: ${theme.fontSizes.body};
            ${mq.xs.min(css`
              padding: 0 ${theme.space['8']};
            `)}
          }
        `
      : css`
          position: relative;
          & button {
            /* border-radius: ${theme.radii['2xLarge']}; */
          }
          ${$large &&
          css`
            width: 100%;
            & button {
              border-radius: ${theme.radii.large};
            }
          `}
        `,
  ],
)

const SectionDivider = styled.div(
  ({ theme }) => css`
    width: calc(100% + ${theme.space['4']});
    height: 1px;
    background-color: ${theme.colors.border};
  `,
)

const PersonOverlay = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1;

    background: rgba(0, 0, 0, 0.25);

    svg {
      color: ${theme.colors.background};
    }
  `,
)
const RoundBox = styled.div`
  /* padding: 6px 12px; */
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--line, #d4d7e2);
  background: #fff;
`
const UserButton = styled.button`
  display: flex;
  padding: 6px 12px;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #d4d7e2;
  background: #fff;
  cursor: pointer;
`
const RoundProfile = styled(Profile)`
  &.profile {
    background: 'red';
  }
`
type Props = {
  isTabBar?: boolean
  large?: boolean
  inHeader?: boolean
}

const calculateTestId = (isTabBar: boolean | undefined, inHeader: boolean | undefined) => {
  if (isTabBar) {
    return 'tabbar-connect-button'
  }
  if (!inHeader) {
    return 'body-connect-button'
  }
  return 'connect-button'
}

export const ConnectButton = ({ isTabBar, large, inHeader }: Props) => {
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()
  const { openConnectModal } = useConnectModal()

  return (
    <StyledButtonWrapper $large={large} $isTabBar={isTabBar}>
      <Button
        data-testid={calculateTestId(isTabBar, inHeader)}
        onClick={() => openConnectModal?.()}
        size={breakpoints.sm || large ? 'medium' : 'small'}
        width={inHeader ? '45' : undefined}
        shape="rounded"
      >
        {t('wallet.connect')}
      </Button>
    </StyledButtonWrapper>
  )
}

const HeaderProfile = ({ address }: { address: string }) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const primary = usePrimary(address!, !address)
  const chainId = useChainId()
  const { avatar } = useAvatar(primary.data?.name, chainId)
  const zorb = useZorb(address, 'address')
  const { disconnect } = useDisconnect()
  const { copy, copied } = useCopied(300)
  const hasPendingTransactions = useHasPendingTransactions()
  const dropdownItems = [
    ...(primary.data?.name
      ? [
          {
            label: t('wallet.myProfile'),
            wrapper: (children: ReactNode, key: Key) => (
              <BaseLink href="/my/profile" key={key}>
                {children}
              </BaseLink>
            ),
            as: 'a' as 'a',
            color: 'text',
            icon: <PersonSVG />,
          },
        ]
      : []),
    {
      label: t('navigation.settings'),
      color: 'text',
      wrapper: (children: ReactNode, key: Key) => (
        <BaseLink href="/my/settings" key={key}>
          {children}
        </BaseLink>
      ),
      as: 'a',
      icon: <CogSVG />,
      showIndicator: hasPendingTransactions,
    },
    <SectionDivider key="divider" />,
    {
      label: shortenAddress(address),
      color: 'text',
      onClick: () => copy(address),
      icon: copied ? <CheckSVG /> : <CopySVG />,
    },
    {
      label: t('wallet.disconnect'),
      color: 'red',
      onClick: () => disconnect(),
      icon: <ExitSVG />,
    },
  ] as DropdownItem[]
  console.log(dropdownItems)
  const { data: balance } = useBalance({ address: address as `0x${string}` | undefined, chainId })
  const mainText = useMemo(() => {
    if (primary.data && primary.data.beautifiedName) {
      return primary.data.beautifiedName
    }
    if (address) {
      return shortenAddress(address, undefined, 4, 4)
    }
    return '-- --'
  }, [address, primary.data])
  return (
    <Dropdown
      width={170}
      align="left"
      items={
        [
          {
            label: shortenAddress(address),
            color: 'text',
            onClick: () => {
              router.push(`/my/names`)
            },
            icon: <InfoSVG />,
          },
          {
            label: t('wallet.disconnect'),
            color: 'red',
            onClick: () => disconnect(),
            icon: <ExitSVG />,
          },
        ] as DropdownItem[]
      }
    >
      <UserButton>
        <DefaultUser />
        <InterText style={{ fontWeight: 500 }}>{mainText}</InterText>
      </UserButton>
    </Dropdown>
  )
  return (
    <RoundBox>
      <RoundProfile
        address={address}
        ensName={balance ? `${Number(balance?.formatted).toFixed(4)} ${balance?.symbol}` : '-- --'}
        dropdownItems={
          [
            {
              label: shortenAddress(address),
              color: 'text',
              onClick: () => copy(address),
              icon: copied ? <CheckSVG /> : <CopySVG />,
            },
            {
              label: t('wallet.disconnect'),
              color: 'red',
              onClick: () => disconnect(),
              icon: <ExitSVG />,
            },
          ] as DropdownItem[]
        }
        avatar={{
          src: avatar || zorb,
          decoding: 'sync',
          loading: 'eager',
          noBorder: true,
          overlay: avatar ? undefined : (
            <PersonOverlay>
              <PersonSVG />
            </PersonOverlay>
          ),
        }}
        size="medium"
        alignDropdown="left"
        data-testid="header-profile"
      />
    </RoundBox>
  )
}

export const HeaderConnect = () => {
  const { address } = useAccountSafely()

  if (!address) {
    return <ConnectButton inHeader />
  }

  return <HeaderProfile address={address} />
}
