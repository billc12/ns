import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { UseScenes } from './type'

interface Params {
  discountCode: string
  account: string
  useScenes: UseScenes
}
type Result = {
  isValid: boolean
  code: string
  rate: string
  useScenes: UseScenes
  minSpending: string
  maxDiscount: string
}
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/query/discount`

export const fetchedQueryDiscount = async (params: Params): Promise<Result> => {
  const query = new URLSearchParams(Object.entries(params)).toString()
  const { data } = await fetch(`${BASE_URL}?${query}`).then((res) => res.json<any>())
  return data
}

const useQueryDiscount = ({ account, discountCode, useScenes }: Params) => {
  const queryKey = useQueryKeys().useQueryDiscount(account, discountCode, useScenes)
  const { data, isLoading } = useQuery(
    queryKey,
    async () => {
      try {
        const result = await fetchedQueryDiscount({ account, discountCode, useScenes })
        return result
      } catch {
        return null
      }
    },
    { enabled: !!account && !!discountCode && !!useScenes.toString() },
  )

  return { data, isLoading }
}
export default useQueryDiscount
