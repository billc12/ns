import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useEthRegistrarControllerContract } from '../useContract'

type Result = {
  signature: string
  discountCode: string
  discount: string
  discountCount: number
  timestamp: number
  premium: boolean
  booker: string
}
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/sign/name`

export const fetchedGetSignName = async (n: string, d: string): Promise<Result> => {
  const { data } = await fetch(`${BASE_URL}?name=${n}&discountCode=${d}`).then((res) =>
    res.json<any>(),
  )
  return {
    signature: data.signature,
    discountCode: data.discountCode,
    discount: data.discountRate,
    discountCount: data.discountCount,
    timestamp: data.timestamp,
    premium: data.premium,
    booker: data.booker,
  }
}
export const defaultDis = '1000000000000000000'
const useSignName = (name: string, discountCode?: string) => {
  const contract = useEthRegistrarControllerContract()
  const queryKey = useQueryKeys().getSignName(name, discountCode || '')
  const { data, isLoading } = useQuery(
    queryKey,
    async () => {
      try {
        const result = await fetchedGetSignName(name, discountCode || '')

        const disUseCount = await contract?.discountsUsed(discountCode!)
        const isUsed = disUseCount === result.discountCount
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
    { enabled: !!name && !!contract && !!discountCode },
  )

  return { data, isLoading }
}
export default useSignName
