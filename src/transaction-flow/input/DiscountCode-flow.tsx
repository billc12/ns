import { formatFixed } from '@ethersproject/bignumber'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Dialog, Input, Skeleton, mq } from '@ensdomains/thorin'

import { BackButton, NextButton } from '@app/components/Awns/Dialog'
import { DisInfo } from '@app/components/pages/profile/[name]/registration/steps/Pricing/Pricing'
import useSignName from '@app/hooks/names/useSignName'

import { TransactionDialogPassthrough } from '../types'

export type TDiscountCode = {
  setCodeCallback: (v: DisInfo) => void
  info: DisInfo
  name: string
}
export type Props = {
  data: TDiscountCode
  // onDismiss?: () => void
} & TransactionDialogPassthrough
const Label = styled.p`
  color: #3f5170;
  /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150.5%;
  margin-bottom: 8px;
`
const ErrTip = styled.p`
  color: #f00;
  /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150.5%; /* 21.07px */
`
const SuccessTip = styled.p`
  /* stylelint-disable-next-line font-family-no-missing-generic-family-keyword */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  background: linear-gradient(90deg, #f0ac47 0%, #fcc04d 48.73%, #e5983c 85%);
  background-clip: text;
  /* stylelint-disable-next-line property-no-vendor-prefix */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
const CodeInput = styled(Input)`
  width: 100%;
  border-radius: 6px;
  background: #fff;
  color: #d4d7e2;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px; /* 135.714% */

  &:focus-within {
    border: 1px solid #97b7ef;
    color: #3f5170;
  }
`
const Container = styled.div`
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${mq.sm.max(css`
    width: 100%;
  `)}
`
const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-top: 50px;
  ${mq.sm.max(css`
    margin-top: 30px;
  `)}
`
const setInitCode = (i: string) => {
  if (!i) return ''
  if (!Number(i)) return ''
  return i
}
const DiscountCode = ({ data: { info, setCodeCallback, name }, onDismiss }: Props) => {
  const [disCode, setDisCode] = useState(setInitCode(info.discountCode))

  const { data: signData, isLoading } = useSignName(name, disCode)
  const saveCode = () => {
    setCodeCallback({
      ...info,
      discount: signData?.discountRate!,
      discountCode: signData?.discountCode!,
      discountCount: signData?.discountCount!,
      timestamp: signData?.timestamp!,
      signature: signData?.signature!,
    })
    onDismiss()
  }
  const hasDiscount = signData && signData.hasDiscount
  const discount = hasDiscount && Number(formatFixed(signData?.discountRate || '0', 18)) * 100
  console.log('signData', signData)

  return (
    <>
      <Dialog.Heading title="Discount Code" />
      <Container>
        <Label>Please enter the discount code</Label>
        <CodeInput
          hideLabel
          label
          placeholder="Discount Code"
          value={disCode}
          onChange={(e) => setDisCode(e.target.value)}
        />
        <Skeleton loading={isLoading}>
          {hasDiscount ? (
            <SuccessTip>Discount {discount}% OFF</SuccessTip>
          ) : (
            <ErrTip>Discount code invalid</ErrTip>
          )}
        </Skeleton>
        <Row>
          <BackButton onClick={onDismiss}>Close</BackButton>
          <NextButton onClick={() => hasDiscount && saveCode()} disabled={!hasDiscount}>
            Save
          </NextButton>
        </Row>
      </Container>
    </>
  )
}
export default DiscountCode
