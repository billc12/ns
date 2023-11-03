import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import AddIcon from '@app/assets/Add.svg'

import BaseLink from './@atoms/BaseLink'

const RegisterItemStyle = styled.div(
  () => css`
    width: 212px;
    height: 250px;
    border-radius: 10px;
    border: 1px solid var(--line, #d4d7e2);
    background: var(--light-bg, #fff);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    gap: 15px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    ${mq.sm.max(css`
      padding: 10px;
      width: 168px;
      height: 200px;
    `)}
  `,
)

const TextStyle = styled(Typography)`
  color: var(--button-line, #97b7ef);
  font-family: Inter;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`

const BottomStyle = styled.div`
  height: 40px;
  width: 100%;
  bottom: 0;
  left: 0;
  position: absolute;
  padding: 10px 40px 10px 15px;
  border-radius: 0 0 10px 10px;
  background: var(--light-bg, #f8fbff);
`

const IconStyle = styled.svg`
  height: 30px;
  width: 30px;
`

export const RegisterItem = () => {
  return (
    <>
      <BaseLink href="/">
        <RegisterItemStyle>
          <IconStyle as={AddIcon} />
          <TextStyle>Register AWNS</TextStyle>
          <BottomStyle />
        </RegisterItemStyle>
      </BaseLink>
    </>
  )
}
