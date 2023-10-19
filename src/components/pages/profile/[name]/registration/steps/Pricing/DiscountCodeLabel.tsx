import { formatFixed } from '@ethersproject/bignumber'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import AddRoundSVG from '@app/assets/add-round.svg'
import DelRoundSVG from '@app/assets/del-round.svg'
import DisCodeDialog from '@app/components/Awns/Dialog/DisCodeDialog'
import { fetchedGetSignName } from '@app/hooks/names/useSignName'
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
  premium: boolean
  booker: string
}
export const DefaultDis: DisInfo = {
  discountCode: '',
  signature: '',
  discount: '',
  discountCount: 0,
  timestamp: 0,
  premium: false,
  booker: '0x0000000000000000000000000000000000000000',
}
const DiscountCodeLabel = ({ info, setCodeCallback, name }: TDiscountCode) => {
  const [showDia, setShowDia] = useState(false)
  const hideDia = () => {
    setShowDia(false)
  }
  const openDia = () => {
    setShowDia(true)
  }

  const code = info.discountCode
  const hasDiscount = !!code && Number(formatFixed(info?.discount, 18)) < 1
  const discount = !!info?.discount && Number(formatFixed(info?.discount, 18)) * 100

  const cleanCode = async () => {
    fetchedGetSignName(name, '').then(
      ({
        discountCode,
        discountCount,
        discount: _discount,
        signature,
        timestamp,
        booker,
        premium,
      }) => {
        setCodeCallback({
          discount: _discount,
          discountCode,
          discountCount,
          signature,
          timestamp,
          booker,
          premium,
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
        <SvgBtn onClick={() => (!hasDiscount ? openDia() : cleanCode())} type="button">
          {auctionBtn}
        </SvgBtn>
      </Row>
      <DisCodeDialog
        info={info}
        show={showDia}
        onCancel={hideDia}
        setCodeCallback={setCodeCallback}
        name={name}
      />
    </Row>
  )
}

const DiscountCodeLabelProvider = (initData: DisInfo, name: string) => {
  const [disInfo, setDisInfo] = useState<DisInfo>({
    ...initData,
  })
  const handleDisInfo = (d: DisInfo) => {
    setDisInfo(d)
  }
  useEffect(() => {
    if (!initData.discountCode || !Number(initData.discountCode)) {
      fetchedGetSignName(name, '').then((info) => {
        setDisInfo({
          ...info,
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const disLabel = <DiscountCodeLabel setCodeCallback={handleDisInfo} info={disInfo} name={name} />
  return { disInfo, disLabel }
}
export default DiscountCodeLabelProvider
