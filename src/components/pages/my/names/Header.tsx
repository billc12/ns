import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useDisconnect } from 'wagmi'

import { CheckSVG, mq } from '@ensdomains/thorin'

import AwnsWhite from '@app/assets/Awns-white.svg'
import ColumnBarIcon from '@app/assets/ColumnBarIcon.svg'
import CopyIcon from '@app/assets/CopyIcon.svg'
import OffLinkIcon from '@app/assets/OffLink.svg'
import BaseLink from '@app/components/@atoms/BaseLink'
import { useCopied } from '@app/hooks/useCopied'
import { usePrimary } from '@app/hooks/usePrimary'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { shortenAddress } from '@app/utils/utils'

const HederStyle = styled.div(
  () => css`
    width: 1200px;
    height: 141px;
    border-radius: 10px;
    border: 1px solid var(--line, #d4d7e2);
    background: #fff;
    box-shadow: 0 4px 14px 0 rgba(40, 79, 115, 0.1);
    display: flex;
    gap: 35px;
    padding: 0 106px 0 98px;
    ${mq.sm.max(css`
      width: 100%;
      gap: 0;
      display: grid;
      padding: 12px;
      align-items: center;
      height: auto;
    `)}
  `,
)

const TitleStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 24px;
  font-weight: 700;
  ${mq.sm.max(css`
    font-size: 20px;
    font-weight: 600;
  `)}
`

const AddressStyle = styled.div(
  () => css`
    width: 822px;
    height: 50px;
    border-radius: 10px;
    background: #f7fafc;
    padding: 16px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--word-color, #3f5170);
    font-family: Inter;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 2px;
    ${mq.sm.max(css`
      width: auto;
      display: grid;
      padding: 6px;
      gap: 6px;
    `)}
  `,
)

const ButtonStyle = styled.div`
  height: auto;
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  gap: 6px;
  align-items: center;
  cursor: pointer;
  svg {
    width: 14px;
    height: 14px;
  }
`

const RightButtonBox = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`

export default function MyNamesHeader() {
  const breakpoints = useBreakpoint()
  const { disconnect } = useDisconnect()
  const { address: _address } = useAccount()
  const { copy, copied } = useCopied(300)
  const primary = usePrimary(_address!, !_address)
  const userName = useMemo(() => {
    if (primary.data?.name) return primary.data?.name
    return ''
  }, [primary.data?.name])

  const isSmDown = useMemo(() => {
    if (breakpoints.sm) {
      return false
    }
    return true
  }, [breakpoints.sm])
  return (
    <>
      {_address && (
        <HederStyle>
          <AwnsWhite />
          <div style={{ display: 'grid', gap: '12px', padding: '25px 0' }}>
            <TitleStyle>
              Hi,
              {userName && (
                <BaseLink href={`/profile/${userName || 'stp.aw'}`}>
                  <b style={{ color: '#0049C6', cursor: 'pointer' }}> {userName || '--'}</b>
                </BaseLink>
              )}
              {` `}
              Welcome to the Autonomous Worlds Ecosystem.
            </TitleStyle>
            <AddressStyle>
              {isSmDown ? shortenAddress(_address) : _address}
              <RightButtonBox>
                <ButtonStyle onClick={() => copy(_address)}>
                  {copied ? <CheckSVG /> : <CopyIcon />}
                  Copy
                </ButtonStyle>
                <ColumnBarIcon />
                <ButtonStyle onClick={() => disconnect()}>
                  <OffLinkIcon />
                  Disconnect
                </ButtonStyle>
              </RightButtonBox>
            </AddressStyle>
          </div>
        </HederStyle>
      )}
    </>
  )
}
