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
