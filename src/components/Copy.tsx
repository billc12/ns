import styled, { css } from 'styled-components'

import { CheckSVG } from '@ensdomains/thorin'

import CopyIcon from '@app/assets/CopyIcon.svg'
import { useCopied } from '@app/hooks/useCopied'

const CopyStyle = styled.div(
  () => css`
    width: auto;
    height: auto;

    :hover {
      cursor: pointer;
    }
  `,
)

const IconStyle = styled.svg(
  () => css`
    height: 12px;
    width: 12px;
    font-size: 12px;
  `,
)

export const CopyButton = ({ value, noneMargin }: { value?: string; noneMargin?: boolean }) => {
  const { copy, copied } = useCopied(300)
  return (
    <CopyStyle
      style={{
        marginLeft: noneMargin ? 0 : '8px',
      }}
      onClick={() => {
        copy(value || '')
      }}
    >
      {copied ? <IconStyle as={CheckSVG} /> : <IconStyle as={CopyIcon} />}
    </CopyStyle>
  )
}
