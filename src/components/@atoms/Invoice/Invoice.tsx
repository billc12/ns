import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Colors, Skeleton, Typography } from '@ensdomains/thorin'

import { CurrencyDisplay } from '@app/types'

import { CurrencyText } from '../CurrencyText/CurrencyText'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;

    width: 100%;
    border-radius: ${theme.space['2']};

    & > div {
      padding: 25px 38px;
      background: #f7fafc;
    }
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
    margin-top: 12px;
    padding: 22px 38px;
    background: #f7fafc;
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
const OldPrice = styled.p`
  color: rgba(63, 81, 112, 0.46);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-decoration: line-through;
`
const OldPriceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

  // eslint-disable-next-line react/no-unused-prop-types
  discount?: { label: string; discount: number }
  discountCodeLabel?: JSX.Element

  // eslint-disable-next-line react/no-unused-prop-types
  invitationNameLabel?: JSX.Element
  totalTitle?: string
  isHasDiscount?: boolean
  discountedPrice?: BigNumber
  originalPrice?: BigNumber
}

export const Invoice = ({
  totalLabel = 'Estimated total',
  unit = 'eth',
  items,
  discountCodeLabel,
  totalTitle,
  isHasDiscount,
  discountedPrice,
  originalPrice,
}: Props) => {
  const filteredItems = items
    .map(({ value, bufferPercentage }) =>
      value && unit === 'eth' && bufferPercentage ? value.mul(bufferPercentage).div(100) : value,
    )
    .filter((x) => !!x)
  const total = filteredItems.reduce((a, b) => a!.add(b!), BigNumber.from(0))
  const hasEmptyItems = filteredItems.length !== items.length
  const disTotal = useMemo(() => {
    if (total && originalPrice && originalPrice && discountedPrice && isHasDiscount) {
      return total.sub(originalPrice).add(discountedPrice)
    }
    return BigNumber.from('0')
  }, [discountedPrice, isHasDiscount, originalPrice, total])
  return (
    <>
      <Container>
        {items.slice(0, 1).map(({ label, value, bufferPercentage, color }, inx) => (
          <LineItem data-testid={`invoice-item-${inx}`} $color={color} key={label}>
            <LeftTitle>{label}</LeftTitle>
            <Skeleton loading={!value}>
              <RightTitle>
                <CurrencyText
                  bufferPercentage={bufferPercentage}
                  eth={value || BigNumber.from(0)}
                  currency={unit}
                />
              </RightTitle>
            </Skeleton>
          </LineItem>
        ))}
        {items.slice(1).map(({ label, value, bufferPercentage, color }, inx) => (
          <LineItem data-testid={`invoice-item-${inx}`} $color={color} key={label}>
            <LeftTitle>{label}</LeftTitle>
            <Skeleton loading={!value}>
              <RightTitle>
                <CurrencyText
                  bufferPercentage={bufferPercentage}
                  eth={value || BigNumber.from(0)}
                  currency={unit}
                />
              </RightTitle>
            </Skeleton>
          </LineItem>
        ))}
        {discountCodeLabel}
      </Container>
      <Total>
        <LeftTitle>{totalTitle || totalLabel}</LeftTitle>
        <Skeleton loading={hasEmptyItems}>
          {!!isHasDiscount && !!disTotal ? (
            <OldPriceBox>
              <OldPrice>
                <CurrencyText eth={hasEmptyItems ? BigNumber.from(0) : total} currency={unit} />
              </OldPrice>
              <RightTitle $weight={800}>
                <CurrencyText eth={hasEmptyItems ? BigNumber.from(0) : disTotal} currency={unit} />
              </RightTitle>
            </OldPriceBox>
          ) : (
            <RightTitle $weight={800}>
              <CurrencyText eth={hasEmptyItems ? BigNumber.from(0) : total} currency={unit} />
            </RightTitle>
          )}
        </Skeleton>
      </Total>
    </>
  )
}
