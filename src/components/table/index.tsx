import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { useBreakpoint } from '@app/utils/BreakpointProvider'

const TableStyle = styled.table(
  () => css`
    width: 100%;
    border: none;
    thead tr {
      padding: 0 20px;
      background: var(--bg_light, #f7fafc);
      height: 36px;
      text-align: center;
      color: var(--word-color2, #8d8ea5);
      font-size: 14px;
      font-weight: 500;
      line-height: 36px;
      th:first-child {
        text-align: left !important;
        padding-left: 30px;
      }
      th:last-child {
        text-align: right;
        padding-right: 30px;
      }
    }
    tbody tr {
      padding: 0 20px;
      background: var(--bg_light, #fff);
      height: 58px;
      text-align: center;
      color: var(--word-color2, #8d8ea5);
      font-size: 14px;
      font-weight: 500;
      line-height: 58px;
      border-bottom: 1px solid #dce6ed;
      td:first-child {
        text-align: left !important;
        padding-left: 30px;
      }
      td:last-child {
        text-align: right;
        padding-right: 30px;
      }
    }
  `,
)

const Card = styled.div(
  () => css`
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    padding: 16px;
    width: 100%;
  `,
)

const CardRow = styled.div(
  () => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: auto 100%;
    > div:first-of-type {
      white-space: nowrap;
    }
    > div:last-child {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  `,
)

function Row({ row }: { row: (string | number | JSX.Element)[] }) {
  return (
    <>
      <tr>
        {row.map((item) => (
          <td>{item}</td>
        ))}
      </tr>
    </>
  )
}

export const Table = ({
  label,
  rows,
  hederRow,
  height,
}: {
  label: string[]
  rows: (string | number | JSX.Element)[][]
  hederRow?: JSX.Element
  height?: number
}) => {
  const breakpoints = useBreakpoint()
  const isSmDown = useMemo(() => {
    if (breakpoints.sm) {
      return false
    }
    return true
  }, [breakpoints.sm])
  console.log(isSmDown)

  return (
    <>
      {isSmDown ? (
        <>
          {rows.map((data) => (
            <Card>
              <div
                style={{
                  display: 'grid',
                  gap: '16px',
                }}
              >
                {label.map((headerString, index) => (
                  <CardRow>
                    <Typography
                      style={{
                        color: '#000000',
                      }}
                    >
                      {headerString}
                    </Typography>
                    <Typography style={{ color: '#80829F' }}>{data[index] ?? null}</Typography>
                  </CardRow>
                ))}
              </div>
            </Card>
          ))}
        </>
      ) : (
        <div
          style={{
            width: 'auto',
            minHeight: 285,
            height: height || '100%',
            borderRadius: '10px',
            border: ' 1px solid var(--line, #D4D7E2)',
            background: '#FFF',
            boxShadow: '0px 4px 14px 0px rgba(40, 79, 115, 0.10)',
            overflow: 'hidden',
          }}
        >
          {hederRow}
          <TableStyle style={{ width: '100%' }}>
            <thead>
              <tr>
                {label.map((item) => (
                  <th>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <Row row={item} />
              ))}
            </tbody>
          </TableStyle>
        </div>
      )}
    </>
  )
}
