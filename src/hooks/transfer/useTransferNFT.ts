// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TokenboundClient } from '@tokenbound/sdk'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSigner } from 'wagmi'

import { useChainId } from '../useChainId'

export const useTransferNFT = ({
  account,
  tokenType = 'ERC721',
  tokenContract,
  tokenId,
  recipientAddress,
}: {
  account: `0x${string}`
  tokenType?: 'ERC721'
  tokenContract: `0x${string}`
  tokenId: string
  recipientAddress: `0x${string}` | `${string}.eth`
}) => {
  const chainId = useChainId()
  const { data: signer } = useSigner()
  const tokenboundClient = useMemo(() => {
    if (!chainId || !signer) return
    return new TokenboundClient({ chainId, signer })
  }, [chainId, signer])
  return useCallback(() => {
    if (!tokenboundClient) return
    return tokenboundClient.transferNFT({
      account,
      recipientAddress,
      tokenContract,
      tokenId,
      tokenType,
    })
  }, [account, recipientAddress, tokenContract, tokenId, tokenType, tokenboundClient])
}
