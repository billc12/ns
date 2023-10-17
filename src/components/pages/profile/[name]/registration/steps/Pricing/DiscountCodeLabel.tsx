import { formatFixed } from '@ethersproject/bignumber'
import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import AddRoundSVG from '@app/assets/add-round.svg'
import DelRoundSVG from '@app/assets/del-round.svg'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { TDiscountCode } from '@app/transaction-flow/input/DiscountCode-flow'

import { defaultDisInfo } from './Pricing'

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
`
const SvgBtn = styled.button`
  width: 16px;
  height: 16px;
  cursor: pointer;
`
const DiscountCodeLabel = ({ info, setCodeCallback, name }: TDiscountCode) => {
  const { prepareDataInput } = useTransactionFlow()
  const showDiscountCodeInput = prepareDataInput('DiscountCode')
  const code = info.discountCode
  const discount = !!info?.discount && Number(formatFixed(info?.discount, 18)) * 100
  const handleDiscountCode = () => {
    showDiscountCodeInput(`discount-code-${code}`, {
      info,
      setCodeCallback,
      name,
    })
  }
  const cleanCode = () => {
    setCodeCallback({ ...defaultDisInfo, invitationName: info.invitationName })
  }
  const auctionBtn = code ? <DelRoundSVG /> : <AddRoundSVG />
  return (
    <Row>
      <LeftTitle>Discount Code</LeftTitle>
      <Row className="content">
        {!!code && (
          <RightTitle>
            {code} <span style={{ fontWeight: 700 }}> ({discount}% OFF) </span>
          </RightTitle>
        )}
        <SvgBtn onClick={() => (!code ? handleDiscountCode() : cleanCode())} type="button">
          {auctionBtn}
        </SvgBtn>
      </Row>
    </Row>
  )
}
export default DiscountCodeLabel
