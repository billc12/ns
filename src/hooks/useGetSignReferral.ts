import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type Result = {
  data: {
    reward: string
    signature: string
  }
}
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/sign/referral`

export const fetchedGetSignReferral = async (n: string) => {
  const response = await fetch(`${BASE_URL}?name=${n}`).then((res) => res.json<Result>())
  return response.data
}

const useGetSignReferral = (name: string) => {
  const queryKey = useQueryKeys().getSignReferral(name)
  const { data } = useQuery(
    queryKey,
    async () => {
      try {
        const result = await fetchedGetSignReferral(name)
        return result
      } catch {
        return null
      }
    },
    { enabled: !!name },
  )

  return { data }
}
export default useGetSignReferral
