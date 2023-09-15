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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <EmptyDataStyle style={{ ...sx }}>
          <SvgStyle as={BoxIcon} />
          {children || 'No Data'}
        </EmptyDataStyle>
      </div>
    </>
  )
}
