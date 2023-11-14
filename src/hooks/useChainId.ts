import { useNetwork } from 'wagmi'

export enum ChainId {
  MAINNET = 1,
  GOERLI = 5,
}

export const useChainId = (): number => {
  const { chain } = useNetwork()
  if (chain) {
    return chain.id ?? null
  }
  return 1
}
