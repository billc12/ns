import { isAddress } from '@ethersproject/address'
import { TokenboundClient } from '@tokenbound/sdk'
import { useEffect, useMemo, useState } from 'react'
import { useChainId, useSigner } from 'wagmi'

export function useContractIsDeployList(tokenContracts?: string[]) {
  const { data: signer } = useSigner()
  const chainId = useChainId()
  const [isDeploys, setIsDeploys] = useState<boolean[] | undefined>()
  const tokenContractsLength = useMemo(() => tokenContracts?.length, [tokenContracts?.length])
  useEffect(() => {
    setIsDeploys(undefined)
  }, [chainId])

  useEffect(() => {
    if (!tokenContracts?.length || !signer || !signer?.provider) return
    const list = tokenContracts.map((item) => {
      if (!isAddress(item)) return false
      return signer?.provider
        ?.getCode(item)
        .then((code) => {
          if (code === '0x' || code === '0x0') {
            return false
          }
          return true
        })
        .catch(() => false)
    })

    Promise.all(list).then((res) => setIsDeploys(res as any))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenContractsLength])

  return useMemo(() => isDeploys, [isDeploys])
}

export function useSBTIsDeployList(
  erc721Address: string[] | undefined,
  tokenIds: string[] | undefined,
) {
  const { data: signer } = useSigner()
  const chainId = useChainId()
  const tokenboundClient = useMemo(
    () => (signer && chainId ? new TokenboundClient({ signer, chainId }) : undefined),
    [chainId, signer],
  )

  const getAllAccount = useMemo(() => {
    if (!tokenboundClient || !erc721Address || !tokenIds) {
      return []
    }
    if (erc721Address.length !== tokenIds.length) {
      throw new Error('length error')
    }
    return erc721Address.map((addr, idx) =>
      tokenboundClient.getAccount({
        tokenContract: addr as `0x${string}`,
        tokenId: tokenIds[idx],
      }),
    )
  }, [erc721Address, tokenIds, tokenboundClient])
  console.log('getAllAccount', getAllAccount)

  return useContractIsDeployList(getAllAccount)
}
