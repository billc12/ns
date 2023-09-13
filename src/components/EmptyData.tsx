import styled, { css } from 'styled-components'

import BoxIcon from '@app/assets/BoxIcon.svg'

const EmptyDataStyle = styled.div(
  () => css`
    color: var(--button-line, #97b7ef);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    text-align: center;
    justify-content: center;
    display: grid;
    gap: 11px;
    margin-top: 50px;
  `,
)
const SvgStyle = styled.svg(
  () => css`
    width: auto;
    height: auto;
  `,
)

export const EmptyData = ({
  children,
  sx,
}: {
  children?: any
  sx?: React.HTMLProps<HTMLDivElement>
}) => {
  return (
    <>
      <EmptyDataStyle style={{ ...sx }}>
        <SvgStyle as={BoxIcon} />
        {children || 'No Data'}
      </EmptyDataStyle>
    </>
  )
}
