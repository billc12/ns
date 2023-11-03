import { useMemo } from 'react'

import useSignName, { defaultDis } from './names/useSignName'
import { UseScenes } from './requst/type'
import useQueryDiscount from './requst/useQueryDiscount'
import { useAccountSafely } from './useAccountSafely'
import { usePrice } from './usePrice'

const useVerifyDiscode = ({
  code,
  useScenes,
  name,
  years,
}: {
  code: string
  useScenes: UseScenes
  name: string
  years: number
}) => {
  const { address: account } = useAccountSafely()
  const { data: queryData, isLoading: queryLoading } = useQueryDiscount({
    account: account || '',
    discountCode: code,
    useScenes,
  })
  const { data: signData, isLoading: signLoading } = useSignName({
    name,
    account,
    discountCode: code,
    useScenes,
  })
  const priceData = usePrice({
    nameOrNames: name,
    legacy: false,
    years,
    signData: signData || undefined,
  })
  const result = useMemo(() => {
    //  code can't use discount = 1e18
    if (!queryData?.isValid) {
      return signData
    }
    //  code can't use
    if (!priceData.isUseDiscount) {
      return { ...signData, discount: defaultDis }
    }
    return signData
  }, [priceData.isUseDiscount, queryData?.isValid, signData])
  return {
    signData: result,
    priceData,
    isLoading: queryLoading || signLoading || priceData.loading,
  }
}
export default useVerifyDiscode
