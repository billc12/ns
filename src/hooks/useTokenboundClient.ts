import { TokenboundClient } from '@tokenbound/sdk'
import { useMemo } from 'react'
import { useSigner } from 'wagmi'

import { useChainId } from './useChainId'

export const useTokenboundClient = () => {
  const chainId = useChainId()
  const { data: signer } = useSigner()
  const tokenboundClient = useMemo(() => {
    if (!chainId || !signer) return
    return new TokenboundClient({ chainId, signer })
  }, [chainId, signer])
  return tokenboundClient
}

export function useGetAccount(erc721Address: string | undefined, tokenId: string | undefined) {
  const tokenboundClient = useTokenboundClient()
  return (
    tokenId &&
    erc721Address &&
    tokenboundClient?.getAccount({
      tokenContract: erc721Address as `0x${string}`,
      tokenId,
    })
  )
}
