import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { PageButtons, Spinner, Typography } from '@ensdomains/thorin'

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
        & > div {
          justify-content: flex-start;
        }
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

const TrStyle = styled.tr(
  () => css`
    height: auto;
  `,
)
const PaginationContainer = styled.div`
  padding-top: 15px;
`
const SpinnerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
function Row({ row, RowHeight }: { row: (string | number | JSX.Element)[]; RowHeight?: number }) {
  return (
    <>
      <TrStyle style={{ height: RowHeight || 58, lineHeight: `${RowHeight}px` || '58px' }}>
        {row.map((item, index) => (
          <td key={+index.toString()}>{item}</td>
        ))}
      </TrStyle>
    </>
  )
}
type PaginationParams = {
  currentPage: number
  total: number
  onChange: (v: number) => void
}
export const Table = ({
  labels,
  rows,
  hederRow,
  TableHeight,
  RowHeight,
  minHeight,
  noneBorder,
  isLoading,
  isEnablePagination,
  paginationParams,
}: {
  labels: string[]
  rows: (string | number | JSX.Element)[][]
  hederRow?: JSX.Element
  TableHeight?: number
  RowHeight?: number
  minHeight?: number
  noneBorder?: boolean
  isLoading?: boolean
  isEnablePagination?: boolean
  paginationParams?: PaginationParams
}) => {
  const breakpoints = useBreakpoint()
  const isSmDown = useMemo(() => {
    if (breakpoints.sm) {
      return false
    }
    return true
  }, [breakpoints.sm])
  if (isLoading) {
    return (
      <SpinnerContainer>
        <Spinner color="accent" size="large" />
      </SpinnerContainer>
    )
  }
  return (
    <>
      {isSmDown ? (
        <>
          {!!rows.length &&
            rows.map((data, ind) => (
              <Card key={+ind.toString()}>
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
          {!rows.length && <EmptyData />}
        </>
      ) : (
        <div
          style={{
            width: '100%',
            minHeight: minHeight || 285,
            height: TableHeight || '100%',
            borderRadius: '0 0 10px 10px',
            border: noneBorder ? 'none' : '1px solid var(--line, #D4D7E2)',
            background: '#FFF',
            padding: '0 0 20px 0',
            boxShadow: noneBorder ? 'none' : '0px 4px 14px 0px rgba(40, 79, 115, 0.10)',
            overflow: 'hidden',
          }}
        >
          {hederRow}
          {!!rows.length && (
            <TableStyle style={{ width: '100%' }}>
              <thead>
                <tr>
                  {labels.map((item, v) => (
                    <th key={+v.toString()}>{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((item, i) => (
                  <Row key={+i.toString()} row={item} RowHeight={RowHeight} />
                ))}
              </tbody>
            </TableStyle>
          )}
          {!!isEnablePagination && paginationParams && (
            <PaginationContainer>
              <PageButtons
                alwaysShowFirst
                alwaysShowLast
                current={paginationParams.currentPage}
                total={paginationParams.total}
                onChange={paginationParams.onChange}
                size="small"
              />
            </PaginationContainer>
          )}
          {!rows.length && <EmptyData />}
        </div>
      )}
    </>
  )
}
