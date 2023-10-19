import { formatFixed } from '@ethersproject/bignumber'
import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

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

const useSignName = (name: string, discountCode?: string) => {
  const queryKey = useQueryKeys().getSignName(name, discountCode || '')
  const { data, isLoading } = useQuery(
    queryKey,
    async () => {
      try {
        const result = await fetchedGetSignName(name, discountCode || '')

        return {
          ...result,
          isPremium: result.premium,
          hasDiscount: Number(formatFixed(result.discount, 18)) < 1,
        }
      } catch {
        return null
      }
    },
    { enabled: !!name },
  )

  return { data, isLoading }
}
export default useSignName
