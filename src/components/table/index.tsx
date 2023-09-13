import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { EmptyData } from '../EmptyData'

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
      line-height: 36px;
      th {
        font-weight: 500;
        font-size: 14px;
      }
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
      text-align: center;
      color: var(--word-color2, #8d8ea5);
      border-bottom: 1px solid #dce6ed;
      td {
        font-weight: 500;
        font-size: 14px;
      }
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
    background: #fff;
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

function Row({ row, RowHeight }: { row: (string | number | JSX.Element)[]; RowHeight?: number }) {
  return (
    <>
      <tr style={{ height: RowHeight || 58, lineHeight: `${RowHeight}px` || '58px' }}>
        {row.map((item) => (
          <td>{item}</td>
        ))}
      </tr>
    </>
  )
}

export const Table = ({
  labels,
  rows,
  hederRow,
  TableHeight,
  RowHeight,
  minHeight,
  noneBorder,
}: {
  labels: string[]
  rows: (string | number | JSX.Element)[][]
  hederRow?: JSX.Element
  TableHeight?: number
  RowHeight?: number
  minHeight?: number
  noneBorder?: boolean
}) => {
  const breakpoints = useBreakpoint()
  const isSmDown = useMemo(() => {
    if (breakpoints.sm) {
      return false
    }
    return true
  }, [breakpoints.sm])

  return (
    <>
      {isSmDown ? (
        <>
          {rows.map((data, ind) => (
            <Card key={ind.toLocaleString()}>
              <div
                style={{
                  display: 'grid',
                  gap: '16px',
                }}
              >
                {labels.map((headerString, index) => (
                  <CardRow key={headerString}>
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
            minHeight: minHeight || 285,
            height: TableHeight || '100%',
            borderRadius: noneBorder ? '0' : '10px',
            border: noneBorder ? 'none' : '1px solid var(--line, #D4D7E2)',
            background: '#FFF',
            boxShadow: noneBorder ? 'none' : '0px 4px 14px 0px rgba(40, 79, 115, 0.10)',
            overflow: 'hidden',
          }}
        >
          {hederRow}
          {!!rows.length && (
            <TableStyle style={{ width: '100%' }}>
              <thead>
                <tr>
                  {labels.map((item) => (
                    <th>{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <Row row={item} RowHeight={RowHeight} />
                ))}
              </tbody>
            </TableStyle>
          )}

          {!rows.length && <EmptyData />}
        </div>
      )}
    </>
  )
}
