import { useState } from 'react'
import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import useGetNftAddress from '../useGetNftAddress'

type TChain = 'eth' | 'bsc' | 'klay' | 'matic'
interface Params {
  chain: TChain
  account: string
}
interface IFnProps {
  chain?: TChain
  name: string
}
const _url = `${process.env.NEXT_PUBLIC_BASE_URL}/rpc/token/list`
const fetchGetTokenList = async (_params: Params) => {
  const query = new URLSearchParams(Object.entries(_params)).toString()
  const url = `${_url}?${query}`
  const result = await fetch(url)
  return result.json<{ data: any[] }>()
}
const useGetTokenList = ({ name, chain = 'eth' }: IFnProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const { accountAddress: account } = useGetNftAddress(name)
  const queryKey = useQueryKeys().getUserTokenList
  const { data } = useQuery(
    queryKey(name, account!, chain),
    async () => {
      setLoading(true)
      try {
        const res = await fetchGetTokenList({
          chain,
          account: '0x4775615ea27329083c43e40403141149D20bBe00',
        })
        setLoading(false)

        return res.data
      } catch {
        setLoading(false)
        return undefined
      }
    },
    {
      enabled: !!account,
    },
  )
  return { data, loading }
}
export default useGetTokenList
