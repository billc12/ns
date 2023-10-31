import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useAccountSafely } from './useAccountSafely'
import { usePrimary } from './usePrimary'

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

const useGetSignReferral = (name?: string) => {
  const { address } = useAccountSafely()
  const primary = usePrimary(address)
  const beautifiedName = primary.data?.beautifiedName.split('.')[0]
  const _name = name || beautifiedName || ''
  const queryKey = useQueryKeys().getSignReferral(_name)
  const { data, refetch } = useQuery(
    queryKey,
    async () => {
      try {
        const result = await fetchedGetSignReferral(_name)
        return result
      } catch {
        return null
      }
    },
    { enabled: !!_name },
  )

  return { data, refetch }
}
export default useGetSignReferral
