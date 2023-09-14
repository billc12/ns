import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useDisconnect } from 'wagmi'

import { mq } from '@ensdomains/thorin'

import OutRightIcon from '@app/assets/OutRightIcon.svg'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { shortenAddress } from '@app/utils/utils'

const HederStyle = styled.div(
  () => css`
    width: 840px;
    height: 83px;
    border-radius: 10px;
    border: 1px solid var(--line, #d4d7e2);
    background: #fff;
    box-shadow: 0 4px 14px 0 rgba(40, 79, 115, 0.1);
    padding: 23px 30px;
    color: var(--word-color, #3f5170);
    font-size: 30px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    ${mq.sm.max(css`
      width: 100%;
      font-size: 22px;
      padding: 10px 15px;
      align-items: center;
      height: auto;
    `)}
  `,
)
const AddressStyle = styled.div(
  () => css`
    width: 492px;
    height: 40px;
    border-radius: 40px;
    border: 1px solid var(--stroke, #dae4f0);
    background: var(--bg_light, #f7fafc);
    color: var(--word-color, #3f5170);
    font-size: 16px;
    font-weight: 500;
    padding: 0 10px 0 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${mq.sm.max(css`
      height: auto;
      padding: 5px 10px;
      font-size: 14px;
    `)}
  `,
)

const ShareSvg = styled.svg(
  () => css`
    width: auto;
    height: auto;
    :hover {
      cursor: pointer;
    }
  `,
)

export const AccountHeader = () => {
  const breakpoints = useBreakpoint()
  const { disconnect } = useDisconnect()
  const { address: _address } = useAccount()

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
          MY AWNS
          <AddressStyle style={{ width: isSmDown ? 'auto' : 492, gap: isSmDown ? 6 : 0 }}>
            {isSmDown ? shortenAddress(_address) : _address}
            <ShareSvg
              as={OutRightIcon}
              onClick={() => {
                disconnect()
              }}
            />
          </AddressStyle>
        </HederStyle>
      )}
    </>
  )
}
