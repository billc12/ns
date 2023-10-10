import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type TChain = 'eth' | 'bsc' | 'klay' | 'matic'
interface Params {
  chain?: TChain
  account: string
}
const _url = `${process.env.NEXT_PUBLIC_BASE_URL}/rpc/token/list`
const fetchGetTokenList = async (_params: Params) => {
  const query = new URLSearchParams(Object.entries(_params)).toString()
  const url = `${_url}?${query}`
  const result = await fetch(url)
  return result.json<{ data: any[] }>()
}
const useGetTokenList = ({ name, account, chain = 'eth' }: Params & { name: string }) => {
  const queryKey = useQueryKeys().getUserTokenList
  const { data, isLoading } = useQuery(
    queryKey(name, account, chain),
    async () => {
      try {
        const res = await fetchGetTokenList({ account, chain })
        return res.data
      } catch {
        return undefined
      }
    },
    {
      enabled: !!account,
    },
  )
  return { data, isLoading }
}
export default useGetTokenList
