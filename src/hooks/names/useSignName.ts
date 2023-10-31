import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { UseScenes } from '../requst/type'
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
}
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/sign/name`

export const fetchedGetSignName = async (params: Params): Promise<Result> => {
  const paramsObj = { ...params }
  if (paramsObj.account) {
    delete paramsObj.account
  }
  if (paramsObj.discountCode) {
    delete paramsObj.discountCode
  }
  if (paramsObj.useScenes?.toString()) {
    delete paramsObj.useScenes
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
  }
}
export const defaultDis = '1000000000000000000'
const useSignName = ({ name, account, discountCode, useScenes }: Params) => {
  const contract = useEthRegistrarControllerContract()
  const queryKey = useQueryKeys().getSignName(name, discountCode || '')
  const { data, isLoading } = useQuery(
    queryKey,
    async () => {
      try {
        const result = await fetchedGetSignName({ name, account, discountCode, useScenes })
        let isUsed = false
        if (discountCode) {
          const disUseCount = (await contract?.discountsUsed(discountCode)) || 0
          isUsed = disUseCount === result.discountCount && result.discountCount > 0
        }
        if (isUsed) {
          result.discount = defaultDis
        }
        return {
          ...result,
        }
      } catch {
        return null
      }
    },
    { enabled: !!name && !!contract },
  )

  return { data, isLoading }
}
export default useSignName
