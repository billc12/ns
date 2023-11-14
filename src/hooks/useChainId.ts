import { useNetwork } from 'wagmi'

import { SUPPORT_NETWORK_CHAIN_IDS } from '@app/utils/constants'

export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,
}

export const useChainId = (): number => {
  const { chain } = useNetwork()
  if (chain) {
    return chain.id ?? null
  }
  return SUPPORT_NETWORK_CHAIN_IDS[0]
}
