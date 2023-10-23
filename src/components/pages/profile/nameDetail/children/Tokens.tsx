import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import TestImg from '@app/assets/TestImage.png'

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

export function Tokens() {
  return (
    <AssetsItemStyle>
      <LeftStyle>
        <StyledImg src={TestImg.src} />
        <div style={{ display: 'grid', gap: '12px' }}>
          <NameStyle>Ethereum</NameStyle>
          <ContentTextStyle>ETH</ContentTextStyle>
        </div>
      </LeftStyle>
      <RightStyle>
        <NameStyle style={{ textAlign: 'right' }}>0.3441 ETH</NameStyle>
        <ContentTextStyle style={{ textAlign: 'right' }}>$100.32 USD</ContentTextStyle>
      </RightStyle>
    </AssetsItemStyle>
  )
}
