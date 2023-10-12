import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import styled, { css } from 'styled-components'

import { Colors, Skeleton, Typography } from '@ensdomains/thorin'

import { CurrencyDisplay } from '@app/types'

import { CurrencyText } from '../CurrencyText/CurrencyText'

const Container = styled.div(
  ({ theme }) => css`
    /* padding: ${theme.space['4']}; */
    /* background: ${theme.colors.backgroundSecondary}; */
    display: flex;
    flex-direction: column;
    /* gap: ${theme.space['2']}; */
    gap: 25px;
    width: 100%;
    border-radius: ${theme.space['2']};
  `,
)

const LineItem = styled.div<{ $color?: Colors }>(
  ({ theme, $color }) => css`
    display: flex;
    justify-content: space-between;
    line-height: ${theme.space['5']};
    color: ${$color ? theme.colors[$color] : theme.colors.textTertiary};
  `,
)

const Total = styled(LineItem)(
  ({ theme }) => css`
    color: ${theme.colors.text};
  `,
)
const LeftTitle = styled(Typography)`
  color: #8d8ea5;

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const RightTitle = styled(Typography)<{ $weight?: number }>`
  color: #3f5170;
  font-size: 14px;
  font-style: normal;
  font-weight: ${(props) => props.$weight || 500};
  line-height: normal;
`
export type InvoiceItem = {
  label: string
  value?: BigNumber
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: number
  color?: Colors
}

type Props = {
  items: InvoiceItem[]
  totalLabel: string
  unit?: CurrencyDisplay
  discount?: { label: string; discount: number }
  discountCodeLabel?: JSX.Element
  invitationNameLabel?: JSX.Element
}

export const Invoice = ({
  totalLabel = 'Estimated total',
  unit = 'eth',
  items,
  discount,
  discountCodeLabel,
  invitationNameLabel,
}: Props) => {
  const filteredItems = items
    .map(({ value, bufferPercentage }) =>
      value && unit === 'eth' && bufferPercentage ? value.mul(bufferPercentage).div(100) : value,
    )
    .filter((x) => !!x)
  const total = filteredItems.reduce((a, b) => a!.add(b!), BigNumber.from(0))
  const hasEmptyItems = filteredItems.length !== items.length
  console.log('totalLabel', totalLabel)
  return (
    <Container>
      {items.slice(0, 1).map(({ label, value, bufferPercentage, color }, inx) => (
        <LineItem data-testid={`invoice-item-${inx}`} $color={color} key={label}>
          <LeftTitle>{label}</LeftTitle>
          <Skeleton loading={!value}>
            {/* <div data-testid={`invoice-item-${inx}-amount`}> */}
            <RightTitle>
              <CurrencyText
                bufferPercentage={bufferPercentage}
                eth={value || BigNumber.from(0)}
                currency={unit}
              />
            </RightTitle>
            {/* </div> */}
          </Skeleton>
        </LineItem>
      ))}
      {discount && (
        <LineItem data-testid={`invoice-item-${items.length}`} key={discount?.label}>
          <LeftTitle>{discount?.label}</LeftTitle>
          <Skeleton loading={false}>
            {/* <div data-testid={`invoice-item-${inx}-amount`}> */}
            <RightTitle style={{ color: '#00B833' }}>{`${
              discount && discount.discount * 100
            }%`}</RightTitle>
            {/* </div> */}
          </Skeleton>
        </LineItem>
      )}
      {items.slice(1).map(({ label, value, bufferPercentage, color }, inx) => (
        <LineItem data-testid={`invoice-item-${inx}`} $color={color} key={label}>
          <LeftTitle>{label}</LeftTitle>
          <Skeleton loading={!value}>
            {/* <div data-testid={`invoice-item-${inx}-amount`}> */}
            <RightTitle>
              <CurrencyText
                bufferPercentage={bufferPercentage}
                eth={value || BigNumber.from(0)}
                currency={unit}
              />
            </RightTitle>
            {/* </div> */}
          </Skeleton>
        </LineItem>
      ))}
      {discountCodeLabel}
      {invitationNameLabel}
      <Total>
        <LeftTitle>Estimated Total</LeftTitle>
        <Skeleton loading={hasEmptyItems}>
          {/* <div data-testid="invoice-total"> */}
          <RightTitle $weight={800}>
            <CurrencyText eth={hasEmptyItems ? BigNumber.from(0) : total} currency={unit} />
          </RightTitle>
          {/* </div> */}
        </Skeleton>
      </Total>
    </Container>
  )
}
