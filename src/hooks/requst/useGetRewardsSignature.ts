import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

interface Params {
  name: string
}

interface IResult {
  signature: string
  reward: string
}

const BaseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`
const fetchGetRewardsSignature = async ({ name }: Params) => {
  const url = `${BaseUrl}/sign/referral?name=${name}`
  const result = await fetch(url)
  return result.json<{ data: IResult }>()
}

const useGetRewardsSignature = (name: string) => {
  const queryKey = useQueryKeys().getRewardsSignature
  const { data, isLoading, refetch } = useQuery(
    queryKey(name),
    async () => {
      try {
        const result = await fetchGetRewardsSignature({ name })
        return result.data
      } catch {
        return undefined
      }
    },
    {
      enabled: !!name,
      refetchOnWindowFocus: 'always',
    },
  )
  return { data, isLoading, refetch }
}

export default useGetRewardsSignature
