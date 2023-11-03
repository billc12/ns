import { TokenboundClient } from '@tokenbound/sdk'
import { useEffect, useMemo, useState } from 'react'
import { useChainId, useSigner } from 'wagmi'

type Result = {
  contractAddress: string
  tokenId: string
  isDeployment: boolean
}
export const useCheckAccountDeployment = (
  contractAddress: string[] | undefined,
  tokenId: string[] | undefined,
) => {
  const [deploymentMap] = useState<Result[]>()
  const { data: signer } = useSigner()
  const chainId = useChainId()

  const tokenboundClient = useMemo(() => {
    if (!signer || !chainId) return undefined
    return new TokenboundClient({ chainId: 1, signer })
  }, [chainId, signer])
  // signer?.provider?.getCode()
  const accountAddress = useMemo(() => {
    if (!contractAddress || !tokenId) {
      return []
    }
    if (Array.isArray(contractAddress)) {
      return contractAddress.map((i, d) =>
        tokenboundClient?.getAccount({ tokenContract: i as `0x${string}`, tokenId: tokenId[d] }),
      )
    }
  }, [contractAddress, tokenId, tokenboundClient])

  useEffect(() => {
    if (accountAddress?.length) {
      const allTask = accountAddress.map((i) => {
        return tokenboundClient?.checkAccountDeployment({ accountAddress: i as `0x${string}` })
      })
      Promise.all(allTask)
        .then((res) => {
          const result = contractAddress!.map<Result>((t, i) => ({
            contractAddress: t,
            tokenId: tokenId![i],
            isDeployment: res[i] as boolean,
          }))
          console.log('result123456', result)

          // setDeploymentMap(result)
        })
        .catch((error) => {
          const result = contractAddress!.map<Result>((t, i) => ({
            contractAddress: t,
            tokenId: tokenId![i],
            isDeployment: false,
          }))
          // setDeploymentMap(result)
          console.log('error132456', error, result)
        })
    }
  }, [accountAddress, contractAddress, tokenId, tokenboundClient])
  return { accountAddress, deploymentMap }
}
