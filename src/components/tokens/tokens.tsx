import styled, { css } from 'styled-components'

import ETHIcon from '@app/assets/token/ETH.svg'
import STPTIcon from '@app/assets/token/STPT.svg'
import USDCIcon from '@app/assets/token/USDC.svg'
import USDTIcon from '@app/assets/token/USDT.svg'
import WETHIcon from '@app/assets/token/WETH.svg'

const TokenContentStyle = styled.div(
  () => css`
    color: var(--word-color, #3f5170);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    display: flex;
    gap: 4px;
    align-items: center;
  `,
)

const TokenIcon = styled.svg(
  () => css`
    width: 24px;
    height: 24px;
  `,
)

const TokenList = {
  ETH: (
    <>
      <TokenIcon as={ETHIcon} />
      ETH
    </>
  ),
  WETH: (
    <>
      <TokenIcon as={WETHIcon} />
      WETH
    </>
  ),
  USDT: (
    <>
      <TokenIcon as={USDTIcon} />
      USDT
    </>
  ),

  USDC: (
    <>
      <TokenIcon as={USDCIcon} />
      USDC
    </>
  ),

  STPT: (
    <>
      <TokenIcon as={STPTIcon} />
      STPT
    </>
  ),
}

const tokensSymbol = ['ETH', 'WETH', 'USDT', 'USDC', 'STPT'] as const
type TokenSymbol = typeof tokensSymbol[number]
export const Tokens = ({ Symbol }: { Symbol: TokenSymbol }) => {
  return (
    <>
      <TokenContentStyle>{TokenList[Symbol]}</TokenContentStyle>
    </>
  )
}
