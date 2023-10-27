import styled, { css } from 'styled-components'
import { useBalance } from 'wagmi'

import { Typography } from '@ensdomains/thorin'

import TestImg from '@app/assets/TestImage.png'
import { useNameErc20Assets } from '@app/hooks/useNameDetails'
import { makeDisplay } from '@app/utils/currency'

const AssetsItemStyle = styled.div`
  width: 100%;
  height: 80px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f7fafc;
  display: flex;
  padding: 15px 20px;
  justify-content: space-between;
`

const LeftStyle = styled.div`
  display: flex;
  gap: 17px;
`
const NameStyle = styled(Typography)`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
`

const ContentTextStyle = styled(Typography)`
  color: var(--tile-grey, #80829f);
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
`

const RightStyle = styled.div`
  display: grid;
  gap: 12px;
`
const StyledImg = styled.img(
  () => css`
    width: 50px;
    height: 50px;
    border-radius: 50%;
  `,
)

export function Tokens({ accountAddress }: { accountAddress: string }) {
  const { tokenBalance, tokenSymbol, tokenName } = useNameErc20Assets(accountAddress)
  const { data: balance } = useBalance({ address: accountAddress as `0x${string}` | undefined })

  return (
    <>
      <AssetsItemStyle>
        <LeftStyle>
          <StyledImg src={TestImg.src} />
          <div style={{ display: 'grid', gap: '12px' }}>
            <NameStyle>{tokenName}</NameStyle>
            <ContentTextStyle>{tokenSymbol}</ContentTextStyle>
          </div>
        </LeftStyle>
        <RightStyle>
          <NameStyle style={{ textAlign: 'right' }}>
            {tokenBalance?.slice(0, -3)} {tokenSymbol}
          </NameStyle>
          <ContentTextStyle style={{ textAlign: 'right' }}>$0.00 USD</ContentTextStyle>
        </RightStyle>
      </AssetsItemStyle>
      <AssetsItemStyle>
        <LeftStyle>
          <StyledImg src={TestImg.src} />
          <div style={{ display: 'grid', gap: '12px' }}>
            <NameStyle>SepoliaETH</NameStyle>
            <ContentTextStyle>{balance?.symbol}</ContentTextStyle>
          </div>
        </LeftStyle>
        <RightStyle>
          <NameStyle style={{ textAlign: 'right' }}>
            {balance
              ? makeDisplay(balance?.value!, undefined, 'eth', balance?.decimals).slice(0, -3)
              : '--'}
            {balance?.symbol}
          </NameStyle>
          <ContentTextStyle style={{ textAlign: 'right' }}>$0.00 USD</ContentTextStyle>
        </RightStyle>
      </AssetsItemStyle>
    </>
  )
}
