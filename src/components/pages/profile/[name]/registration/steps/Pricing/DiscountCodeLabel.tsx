import { formatFixed } from '@ethersproject/bignumber'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import DisCodeDialog from '@app/components/Awns/DisCodeLabel'
import useSignName from '@app/hooks/names/useSignName'
import { UseScenes } from '@app/hooks/requst/type'
import { TDiscountCode } from '@app/transaction-flow/input/DiscountCode-flow'
import { emptyAddress } from '@app/utils/constants'

const Container = styled.div`
  display: grid;
  grid-template-columns: 131px auto;
  justify-content: space-between;
  & .tip {
    grid-column: 1 / 3;
    text-align: right;
  }
`
const LeftTitle = styled(Typography)`
  color: #8d8ea5;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  align-self: self-start;
  margin-top: 6px;
`
export type DisInfo = {
  discountCode: string
  signature: string
  discount: string
  discountCount: number
  timestamp: number
  premium: boolean
  booker: string
  discountBinding: string
  maxDeduct: string
  minLimit: string
}
export const DefaultDis: DisInfo = {
  discountCode: '',
  signature: '',
  discount: '',
  discountCount: 0,
  timestamp: 0,
  premium: false,
  booker: emptyAddress,
  discountBinding: emptyAddress,
  maxDeduct: '0',
  minLimit: '0',
}
const DiscountCodeLabel = ({
  info,
  setCodeCallback,
  name,
  useScenes,
  years,
}: TDiscountCode & { useScenes: UseScenes; years: number }) => {
  const code = info.discountCode
  const hasDiscount = !!code && Number(formatFixed(info?.discount, 18)) < 1

  const _info = hasDiscount ? info : { ...info, discountCode: '0' }

  return (
    <Container>
      <LeftTitle>Discount Code</LeftTitle>

      <DisCodeDialog
        info={_info}
        setCodeCallback={setCodeCallback}
        name={name}
        useScenes={useScenes}
        years={years}
      />
    </Container>
  )
}

const DiscountCodeLabelProvider = (
  initData: DisInfo,
  name: string,
  useScenes: UseScenes,
  years: number,
) => {
  const [disInfo, setDisInfo] = useState<DisInfo>({
    ...initData,
  })

  const handleDisInfo = (d: DisInfo) => {
    setDisInfo(d)
  }
  const { data: signInfo } = useSignName({ name, discountCode: initData.discountCode })

  useEffect(() => {
    if ((!initData.discountCode || !Number(initData.discountCode)) && !!signInfo) {
      setDisInfo({
        ...signInfo,
      })
      return
    }
    if (
      initData.discountCode &&
      Number(formatFixed(initData.discount, 18)) < 1 &&
      !!signInfo &&
      disInfo.discount !== signInfo.discount
    ) {
      setDisInfo({
        ...signInfo,
        discountCode: '',
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signInfo])
  const disLabel = (
    // add key
    <DiscountCodeLabel
      key={`${disInfo.discountCode}-${disInfo.discount}`}
      setCodeCallback={handleDisInfo}
      info={disInfo}
      name={name}
      useScenes={useScenes}
      years={years}
    />
  )
  return { disInfo, disLabel }
}
export default DiscountCodeLabelProvider
