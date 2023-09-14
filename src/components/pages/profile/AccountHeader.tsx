import styled, { css } from 'styled-components'

import ShareIcon from '@app/assets/ShareIcon.svg'

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

export const AccountHeader = ({ address }: { address?: string }) => {
  return (
    <>
      <HederStyle>
        MY AWNS
        <AddressStyle>
          {address}
          <ShareSvg
            as={ShareIcon}
            onClick={() => {
              console.log(1)
            }}
          />
        </AddressStyle>
      </HederStyle>
    </>
  )
}
