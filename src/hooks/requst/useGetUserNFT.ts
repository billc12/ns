import { useCallback } from 'react'
import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import useGetNftAddress from '../useGetNftAddress'

type TChainId = 1 | 56 | 137 | 324
type TErcType = 'erc721' | 'erc1155'
interface Params {
  chainId?: TChainId
  ercType?: TErcType
  account: string
  contractAddress?: string
  cursor?: number
  limit?: number
}
type HookParams = Omit<Params, 'account'> & { name: string }
interface IResult {
  total: number
  content: any[]
  next: string
}
const BaseUrl = `${process.env.NEXT_PUBLIC_BASE_URL_V3}`
const fetchGetUserNFT = async (params: Params) => {
  const query = new URLSearchParams(Object.entries(params)).toString()
  const url = `${BaseUrl}/user/nftscan?${query}`
  const result = await fetch(url)
  return result.json<{ data: IResult }>()
}

const useGetUserNFT = ({
  name,
  chainId = 1,
  ercType = 'erc721',
  contractAddress,
  cursor = 1,
  limit = 10,
}: HookParams) => {
  const { accountAddress: account } = useGetNftAddress(name)
  const params: Params = {
    chainId,
    ercType,
    cursor,
    limit,
    account: account || '',
  }
  if (contractAddress) {
    params.contractAddress = contractAddress
  }
  const queryKey = useQueryKeys().getUserNFTList
  const { data, isLoading } = useQuery(
    queryKey(name),
    async () => {
      try {
        const result = await fetchGetUserNFT(params)
        return result.data
      } catch {
        return undefined
      }
    },
    {
      enabled: !!name && !!account,
    },
  )
  return { data, isLoading }
}
export interface IRefreshParams {
  contractAddress: string
  tokenId: string
}
const refreshNFT = (params: IRefreshParams) => {
  const url = `${BaseUrl}/user/nftscan/refresh`
  return fetch(url, { method: 'POST', body: JSON.stringify(params) }).then((res) =>
    res.json<{ code: number; data: { status: string }; msg: string }>(),
  )
}
export const useRefreshNFTScan = () => {
  const refresh = useCallback((params: IRefreshParams) => {
    return refreshNFT(params)
  }, [])
  return refresh
}
export default useGetUserNFT
