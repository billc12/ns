import { formatFixed } from '@ethersproject/bignumber'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import AddRoundSVG from '@app/assets/add-round.svg'
import DelRoundSVG from '@app/assets/del-round.svg'
import { fetchedGetSignName } from '@app/hooks/names/useSignName'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { TDiscountCode } from '@app/transaction-flow/input/DiscountCode-flow'

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  &.content {
    width: max-content;
    gap: 5px;
  }
`
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
  max-width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
const SvgBtn = styled.button`
  width: 16px;
  height: 16px;
  cursor: pointer;
`
export type DisInfo = {
  discountCode: string
  signature: string
  discount: string
  discountCount: number
  timestamp: number
}
export const DefaultDis: DisInfo = {
  discountCode: '',
  signature: '',
  discount: '',
  discountCount: 0,
  timestamp: 0,
}
const DiscountCodeLabel = ({ info, setCodeCallback, name }: TDiscountCode) => {
  const { prepareDataInput } = useTransactionFlow()
  const showDiscountCodeInput = prepareDataInput('DiscountCode')
  const code = info.discountCode
  const hasDiscount = !!code && Number(formatFixed(info?.discount, 18)) < 1
  const discount = !!info?.discount && Number(formatFixed(info?.discount, 18)) * 100
  const handleDiscountCode = () => {
    showDiscountCodeInput(`discount-code-${code}`, {
      info,
      setCodeCallback,
      name,
    })
  }
  const cleanCode = async () => {
    fetchedGetSignName(name, '').then(
      ({ discountCode, discountCount, discountRate, signature, timestamp }) => {
        setCodeCallback({
          discount: discountRate,
          discountCode,
          discountCount,
          signature,
          timestamp,
        })
      },
    )
  }
  const auctionBtn = hasDiscount ? <DelRoundSVG /> : <AddRoundSVG />
  return (
    <Row>
      <LeftTitle>Discount Code</LeftTitle>
      <Row className="content">
        {!!hasDiscount && (
          <RightTitle>
            {code} <span style={{ fontWeight: 700 }}> ({discount}% OFF) </span>
          </RightTitle>
        )}
        <SvgBtn onClick={() => (!hasDiscount ? handleDiscountCode() : cleanCode())} type="button">
          {auctionBtn}
        </SvgBtn>
      </Row>
    </Row>
  )
}
const DiscountCodeLabelProvider = (initData: DisInfo, name: string) => {
  const [disInfo, setDisInfo] = useState<DisInfo>({
    discount: initData.discount,
    discountCode: initData.discountCode,
    discountCount: initData.discountCount,
    timestamp: initData.timestamp,
    signature: initData.signature,
  })
  const handleDisInfo = (d: DisInfo) => {
    setDisInfo(d)
  }
  useEffect(() => {
    if (!initData.discountCode || !Number(initData.discountCode)) {
      fetchedGetSignName(name, '').then(
        ({ discountCode, discountCount, discountRate, signature, timestamp }) => {
          setDisInfo({
            ...disInfo,
            discount: discountRate,
            discountCode,
            discountCount,
            signature,
            timestamp,
          })
        },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const disLabel = <DiscountCodeLabel setCodeCallback={handleDisInfo} info={disInfo} name={name} />
  return { disInfo, disLabel }
}
export default DiscountCodeLabelProvider
