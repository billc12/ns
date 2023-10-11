import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import AddRoundSVG from '@app/assets/add-round.svg'
import DelRoundSVG from '@app/assets/del-round.svg'
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
`
const SvgBtn = styled.button`
  width: 16px;
  height: 16px;
  cursor: pointer;
`
const DiscountCodeLabel = ({ code, setCodeCallback }: TDiscountCode) => {
  const { prepareDataInput } = useTransactionFlow()
  const showDiscountCodeInput = prepareDataInput('DiscountCode')
  const handleDiscountCode = () => {
    showDiscountCodeInput(`discount-code-${code}`, { code, setCodeCallback })
  }
  const cleanCode = () => {
    setCodeCallback('')
  }
  const auctionBtn = code ? <DelRoundSVG /> : <AddRoundSVG />
  return (
    <Row>
      <LeftTitle>Discount Code</LeftTitle>
      <Row className="content">
        {!!code && <RightTitle>{code}</RightTitle>}
        <SvgBtn onClick={() => (!code ? handleDiscountCode() : cleanCode())} type="button">
          {auctionBtn}
        </SvgBtn>
      </Row>
    </Row>
  )
}
export default DiscountCodeLabel
