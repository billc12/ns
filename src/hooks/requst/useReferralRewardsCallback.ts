import { BigNumber } from '@ethersproject/bignumber'
import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

interface Params {
  name: string
  offset: number
  limit: number
}

interface ResListProp {
  referral: string
  registrant: string
  reward: string
  timestamp: number
  type: string
}

interface IResult {
  countDirect: number
  countIndirect: number
  list: ResListProp[]
  totalRewards: BigNumber
}
const BaseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`
const fetchGetRewards = async (params: Params) => {
  const query = new URLSearchParams(Object.entries(params)).toString()
  const url = `${BaseUrl}/list/referral?${query}`
  const result = await fetch(url)
  return result.json<{ data: IResult }>()
}

const useReferralRewards = (name: string) => {
  const offset = 0
  const limit = 10
  const queryKey = useQueryKeys().getReferralRewards
  const { data, isLoading, refetch } = useQuery(
    queryKey(name, offset, limit),
    async () => {
      try {
        const result = await fetchGetRewards({ name, offset, limit })

        return { ...result.data }
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

export default useReferralRewards
