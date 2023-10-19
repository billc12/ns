import { useState } from 'react'
import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

/* eslint-disable */
interface Params {
  chain: string
  account: string
  tokenId?: string
  startTime?: string
  pageCount?: string
}
interface TokenHistoryTypeProp {
  amount: number
  to_addr: string
  token_id: string
}

interface TokenHistoryTxProp {
  from_addr: string
  message: string | number
  name: string
  params: []
  selector: string
  status: number
  to_addr: string
  value: number
}

export interface TokenHistoryListProp {
  cate_id: string
  cex_id: string | number
  chain: string
  id: string
  is_scam: boolean
  other_addr: string
  project_id: string | number
  time_at: number
  token_approve: string | number
  receives: TokenHistoryTypeProp[] | undefined
  sends: TokenHistoryTypeProp[] | undefined
  tx: TokenHistoryTxProp | undefined
}

export interface TokenHistoryProp {
  history_list: TokenHistoryListProp[]
  token_dict: {
    [key: string]: {
      logo_url: string
      id: string
      name: string
    }
  }
}

const BaseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`
const fetchGetAssetsHistory = async (params: Params) => {
  const query = new URLSearchParams(Object.entries(params)).toString()
  const url = `${BaseUrl}/rpc/history/list?${query}`
  const result = await fetch(url)
  return result.json<{ data: TokenHistoryProp }>()
}

export function AssetsHistoryCallback(chain: string, account: string) {
    const [loading,setLoading] = useState<boolean>(false)
  const queryKey = useQueryKeys().getAssetsHistory
  const { data } = useQuery(
    queryKey(chain, account),
    async () => {
        if(!chain||!account) return
        setLoading(true)
      try {
        const result = await fetchGetAssetsHistory({ chain, account })
        setLoading(false)
        return result.data
      } catch {
        setLoading(false)
        return undefined
      }
    },
    {
      enabled: !!chain && !!account,
      refetchOnWindowFocus: 'always',
    },
  )
  return { data, loading }
}
