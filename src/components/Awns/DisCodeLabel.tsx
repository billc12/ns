import { formatFixed } from '@ethersproject/bignumber'
import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Input, Skeleton, mq } from '@ensdomains/thorin'

import DisCodeDialog from '@app/components/Awns/Dialog/DisCodeDialog'
import { DisInfo } from '@app/components/pages/profile/[name]/registration/steps/Pricing/DiscountCodeLabel'
// import useSignName from '@app/hooks/names/useSignName'
import { UseScenes } from '@app/hooks/requst/type'
// import { useAccountSafely } from '@app/hooks/useAccountSafely'
import useVerifyDiscode from '@app/hooks/useVerifyDiscode'
import { emptyAddress } from '@app/utils/constants'

export type TDiscountCode = {
  setCodeCallback: (v: DisInfo) => void
  info: DisInfo
  name: string
}
export type Props = {
  setCodeCallback: (v: DisInfo, p?: any) => void
  info: DisInfo
  name: string
  useScenes: UseScenes
}

const ErrTip = styled.p`
  color: #e46767;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 150.5%;
  & > a {
    color: #e46767;
    text-align: right;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-decoration-line: underline;
  }
`
const SuccessTip = styled.p`
  & > a,
  & {
    color: #21c331;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  & > a {
    text-decoration-line: underline;
  }
`
export const CodeInput = styled(Input)`
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
  &:disabled {
    background: #f8fbff;
    border: 1px solid #97b7ef;
    color: #0049c6;
  }
`
const Container = styled.div`
  width: 179px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${mq.sm.max(css`
    width: 100%;
  `)}
  &>div {
    height: 32px;
  }
`

const DiscountCode = ({
  info,
  setCodeCallback,
  name,
  useScenes,
  years,
}: Props & { years: number }) => {
  const [disCode, setDisCode] = useState(info.discountCode)
  // const { address } = useAccountSafely()

  // const { data: signData, isLoading } = useSignName({
  //   name,
  //   discountCode: disCode,
  //   useScenes,
  //   account: address,
  // })
  const { signData, isLoading } = useVerifyDiscode({
    code: disCode,
    name,
    useScenes,
    years,
  })
  const hasDiscount = signData && Number(formatFixed(signData?.discount || '0', 18)) < 1
  const discount = hasDiscount && 100 - Number(formatFixed(signData?.discount || '0', 18)) * 100

  const saveCode = () => {
    if (signData) {
      setCodeCallback({
        ...info,
        ...signData,
      })
    }
  }
  const [openDia, setOpenDia] = useState(false)
  const handleOpenDia = (e: any) => {
    e.preventDefault()
    setOpenDia(true)
  }
  const closeDia = () => {
    setOpenDia(false)
  }
  const params = {
    code: disCode,
    discount: discount ? `${discount}% OFF` : '---',
    date: signData?.discountEndTime
      ? new Date(signData.discountEndTime * 1000).toUTCString()
      : '---',
    type: signData?.discountBinding === emptyAddress ? 'Public' : 'Private',
  }
  return (
    <>
      <Container>
        <CodeInput
          hideLabel
          label
          placeholder="Enter Discount Code"
          value={disCode}
          onChange={(e) => setDisCode(e.target.value)}
          onBlur={saveCode}
        />
      </Container>
      {disCode && (
        <div style={{ display: 'flex', justifyContent: 'end', marginTop: 5 }} className="tip">
          <Skeleton loading={isLoading}>
            {hasDiscount ? (
              <SuccessTip>
                {discount}% OFF{' '}
                <a href="#" onClick={handleOpenDia}>
                  Details
                </a>
              </SuccessTip>
            ) : (
              <ErrTip>
                The coupon is not available{' '}
                <a href="#" onClick={handleOpenDia}>
                  Details
                </a>
              </ErrTip>
            )}
          </Skeleton>
        </div>
      )}
      <DisCodeDialog open={openDia} close={closeDia} {...(params as any)} />
    </>
  )
}
export default DiscountCode
