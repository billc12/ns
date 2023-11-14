import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useChainName } from '../useChainName'

export const useGetUserImg = (name: string) => {
  const network = useChainName()
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${network}/${name}`
  const queryKey = useQueryKeys().getUserImg
  const { data } = useQuery(
    queryKey(name, network),
    async () => {
      const fetchHandle = await fetch(baseUrl)
      const res = await fetchHandle.json<string>()
      return res
    },
    { enabled: !!network && !!name },
  )
  return { avatarSrc: data }
}
