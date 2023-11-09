import { isAddress } from '@ethersproject/address'
import { useMemo, useState } from 'react'
import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

// type TChain = 'eth' | 'bsc' | 'klay' | 'matic'
interface Params {
  chain: string
  account: string
}
interface IFnProps {
  chain: number
  account: string
}
interface IResultItem {
  address: string
  name: string
  symbol: string
  logoUrl: string
  price: number
  amount: number
  rawAmount: number
}
const _url = `${process.env.NEXT_PUBLIC_BASE_URL}/rpc/token/list`
const fetchGetTokenList = async (_params: Params) => {
  const query = new URLSearchParams(Object.entries(_params)).toString()
  const url = `${_url}?${query}`
  const result = await fetch(url)
  return result.json<{ data: IResultItem[] }>()
}
const useGetTokenList = ({ account, chain }: IFnProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const chainName = useMemo(() => {
    if (chain === 1) {
      return 'eth'
    }
    return chain.toString()
  }, [chain])
  const queryKey = useQueryKeys().getUserTokenList
  const { data } = useQuery(
    queryKey(account, chainName),
    async () => {
      setLoading(true)
      try {
        const res = await fetchGetTokenList({
          chain: chainName,
          account,
        })
        setLoading(false)

        return res.data.map((item: any) => ({
          address: isAddress(item.id) ? item.id : '0x0000000000000000000000000000000000000000',
          name: item.name,
          symbol: item.symbol,
          logoUrl: item.logo_url,
          price: item.price,
          amount: item.amount,
          rawAmount: item.raw_amount,
        }))
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
