import styled, { css } from 'styled-components'

import { CheckSVG, CopySVG } from '@ensdomains/thorin'

import { useCopied } from '@app/hooks/useCopied'

const CopyStyle = styled.div(
  () => css`
    width: auto;
    height: auto;
    margin-left: 8px;
    :hover {
      cursor: pointer;
    }
  `,
)

export const CopyButton = ({ value }: { value: string }) => {
  const { copy, copied } = useCopied(300)
  return (
    <CopyStyle
      onClick={() => {
        copy(value)
      }}
    >
      {copied ? <CheckSVG /> : <CopySVG />}
    </CopyStyle>
  )
}
