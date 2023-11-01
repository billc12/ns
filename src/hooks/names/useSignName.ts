import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { emptyAddress } from '@app/utils/constants'

import { UseScenes } from '../requst/type'
import useQueryDiscount from '../requst/useQueryDiscount'
import { useAccountSafely } from '../useAccountSafely'
import { useEthRegistrarControllerContract } from '../useContract'

interface Params {
  name: string
  discountCode?: string
  account?: string
  useScenes?: UseScenes
}
type Result = {
  signature: string
  discountCode: string
  discount: string
  discountCount: number
  timestamp: number
  premium: boolean
  booker: string
  discountBinding: string
  discountEndTime: number
}
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/sign/name`

export const fetchedGetSignName = async ({
  name,
  account,
  discountCode,
  useScenes,
}: Params): Promise<Result> => {
  const paramsObj: Params = { name }
  if (account) {
    paramsObj.account = account
  }
  if (discountCode) {
    paramsObj.discountCode = discountCode
  }
  if (useScenes?.toString()) {
    paramsObj.useScenes = useScenes
  }

  const query = new URLSearchParams(Object.entries(paramsObj) as string[][]).toString()
  const { data } = await fetch(`${BASE_URL}?${query}`).then((res) => res.json<any>())
  return {
    signature: data.signature,
    discountCode: data.discountCode,
    discount: data.discountRate,
    discountCount: data.discountCount,
    timestamp: data.timestamp,
    premium: data.premium,
    booker: data.booker,
    discountBinding: data.specialAddr,
    discountEndTime: data.discountEndTime,
  }
}
export const defaultDis = '1000000000000000000'
const useSignName = ({ name, account, discountCode, useScenes }: Params) => {
  const { address } = useAccountSafely()
  const contract = useEthRegistrarControllerContract()
  const queryKey = useQueryKeys().getSignName(name, discountCode || '')
  const { data: queryData, isLoading: queryLoading } = useQueryDiscount({
    account: address || '',
    discountCode: discountCode || '',
    useScenes: useScenes || UseScenes.register,
  })
  const isValid = queryData?.isValid

  const { data, isLoading } = useQuery(
    queryKey,
    async () => {
      try {
        const result = await fetchedGetSignName({ name, account, discountCode, useScenes })
        // let isUsed = false
        // if (discountCode) {
        //   const disUseCount = (await contract?.discountsUsed(discountCode)) || 0
        //   isUsed = disUseCount === result.discountCount && result.discountCount > 0
        // }
        // if (isUsed) {
        //   result.discount = defaultDis
        // }
        if (result.discountBinding !== emptyAddress && result.discountBinding !== address) {
          result.discount = defaultDis
        }
        if (!isValid) {
          result.discount = defaultDis
        }
        return {
          ...result,
        }
      } catch (error) {
        console.log('useSignName err', error)

        return null
      }
    },
    { enabled: !!name && !!contract && !!useScenes?.toString() },
  )

  return { data, isLoading: queryLoading || isLoading }
}
export default useSignName
