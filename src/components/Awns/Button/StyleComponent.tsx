import styled, { css } from 'styled-components'

import { Button, mq } from '@ensdomains/thorin'

export const ButtonStyle = styled(Button)<{ $loading?: boolean }>(
  ({ $loading }) => css`
    height: 40px;
    width: 150px;
    gap: 12px;
    color: var(--word-color, #3f5170);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    border: 1px solid var(--line, #d4d7e2);
    svg {
      width: auto;
      height: auto;
    }
    & > div {
      stroke: ${() => ($loading ? '#97B7EF' : '')};
    }

    ${mq.sm.max(css`
      width: 100%;
      gap: 6px;
      padding: 0 6px;
      svg {
        width: 16px;
        height: 16px;
      }
    `)}
  `,
)
