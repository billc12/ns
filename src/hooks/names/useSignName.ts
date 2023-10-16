import { formatFixed } from '@ethersproject/bignumber'
import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type Result = {
  data: {
    signature: string
    discountCode: string
    discountRate: string
    discountCount: number
    timestamp: number
  }
}
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/sign/name`

export const fetchedGetSignName = async (n: string, d: string) => {
  const response = await fetch(`${BASE_URL}?name=${n}&discountCode=${d}`).then((res) =>
    res.json<Result>(),
  )
  return response.data
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
          isPremium: result.signature === '0x',
          hasDiscount: Number(formatFixed(result.discountRate, 18)) < 1,
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
