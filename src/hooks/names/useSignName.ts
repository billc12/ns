import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type Result = { data: string }
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/sign/name`

export const fetchedGetSignName = async (n: string) => {
  const response = await fetch(`${BASE_URL}?name=${n}`).then((res) => res.json<Result>())
  return response.data
}

const useSignName = (name: string) => {
  const queryKey = useQueryKeys().getSignName(name)
  const { data } = useQuery(
    queryKey,
    async () => {
      try {
        const result = await fetchedGetSignName(name)
        return {
          sign: result,
          isPremium: result === '0x',
        }
      } catch {
        return {
          sign: undefined,
          isPremium: false,
        }
      }
    },
    { enabled: !!name },
  )

  return { data }
}
export default useSignName
