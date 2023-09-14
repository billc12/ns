import styled, { css } from 'styled-components'

import { Button, CheckSVG, Typography, mq } from '@ensdomains/thorin'

import CopyIcon from '@app/assets/CopyIcon.svg'
import ShareIcon from '@app/assets/ShareIcon.svg'
import { useCopied } from '@app/hooks/useCopied'

const ItemsStyle = styled.div(
  () => css`
    padding: 16px 30px 50px;
    display: grid;
    gap: 10px;
  `,
)

const InvitationCodeItem = styled.div(
  () => css`
    width: 780px;
    height: 79px;
    border-radius: 10px;
    background: #f7fafc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px;
    ${mq.sm.max(css`
      width: 100%;
      height: auto;
      padding: 10px 15px;
      display: grid;
      gap: 10px;
    `)}
  `,
)
const DelLineText = styled(Typography)(
  () => css`
    color: var(--word-color, #3f5170);
    font-size: 24px;
    font-weight: 600;
    text-decoration-line: strikethrough;
    opacity: 0.5;
    ${mq.sm.max(css`
      font-size: 18px;
    `)}
  `,
)

const DisableText = styled(Typography)(
  () => css`
    color: var(--tile-grey, #80829f);
    font-size: 16px;
    font-weight: 500;
    ${mq.sm.max(css`
      font-size: 14px;
    `)}
  `,
)

const InvitationCodeStyle = styled(Typography)(
  () => css`
    color: var(--word-color, #3f5170);
    font-size: 24px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 30px;
    ${mq.sm.max(css`
      font-size: 18px;
      gap: 10px;
      display: grid;
    `)}
  `,
)

const AvailableText = styled(Typography)(
  () => css`
    color: var(--green, #21c331);
    font-size: 16px;
    font-weight: 500;
  `,
)

const ButtonsStyle = styled.div(
  () => css`
    height: 31px;
    width: auto;
    display: flex;
    gap: 10px;
    ${mq.sm.max(css`
      gap: 5px;
    `)}
  `,
)

const ButtonStyle = styled(Button)(
  () => css`
    width: 120px;
    height: 31px;
    gap: 4px;
    padding: 7px 8px;
    color: var(--word-color, #3f5170);
    font-size: 14px;
    font-weight: 500;
    border: 1px solid var(--line, #d4d7e2);
    svg {
      width: 12px;
      height: 12px;
      font-size: 12px;
    }
    ${mq.sm.max(css`
      width: auto;
      height: auto;
      font-size: 12px;
    `)}
  `,
)

function InvitationCodeDisable() {
  return (
    <>
      <InvitationCodeItem
        style={{
          opacity: 0.6,
        }}
      >
        <DelLineText>
          <del>BCC4E2431</del>
        </DelLineText>
        <DisableText>Code Taken</DisableText>
      </InvitationCodeItem>
    </>
  )
}
function InvitationCodeAvailable() {
  const { copy, copied } = useCopied(300)

  return (
    <>
      <InvitationCodeItem>
        <InvitationCodeStyle>
          BCC4E2431
          <ButtonsStyle>
            <ButtonStyle
              onClick={() => copy('value')}
              colorStyle="background"
              prefix={copied ? <CheckSVG /> : <CopyIcon />}
            >
              Copy Code
            </ButtonStyle>
            <ButtonStyle colorStyle="background" prefix={<ShareIcon />}>
              Share URL
            </ButtonStyle>
          </ButtonsStyle>
        </InvitationCodeStyle>
        <AvailableText>Available</AvailableText>
      </InvitationCodeItem>
    </>
  )
}

export const InvitationCode = () => {
  return (
    <>
      <ItemsStyle>
        <InvitationCodeDisable />
        <InvitationCodeAvailable />
      </ItemsStyle>
    </>
  )
}
