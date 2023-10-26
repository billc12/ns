import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { labelhash } from '@myclique/awnsjs/utils/labels'
import { namehash } from '@myclique/awnsjs/utils/normalise'
import { TokenboundClient } from '@tokenbound/sdk'
import { useMemo } from 'react'

import { checkETH2LDFromName } from '@app/utils/utils'

import { useChainId } from './useChainId'
import { useContractAddress } from './useContractAddress'
import { useNameDetails } from './useNameDetails'

const useGetNftAddress = (_name: string) => {
  const name = _name || ''
  const chainId = useChainId()
  const { isWrapped } = useNameDetails(name)
  const wrapperAddress = useContractAddress('NameWrapper')
  const registrarAddress = useContractAddress('BaseRegistrarImplementation')
  const is2ldEth = checkETH2LDFromName(name)
  const hasToken = is2ldEth || isWrapped

  const { tokenContract, tokenId } = useMemo(() => {
    const _contractAddress: `0x${string}` = (isWrapped ? wrapperAddress : registrarAddress) as any
    const _hex = isWrapped ? namehash(name) : labelhash(name.split('.')[0])
    const _tokenId = BigNumber.from(_hex).toString()
    return { tokenContract: _contractAddress, tokenId: _tokenId }
  }, [isWrapped, name, registrarAddress, wrapperAddress])
  console.log('tokenContract, tokenId=>>', tokenContract, tokenId)
  if (!name || !hasToken) {
    return { accountAddress: undefined }
  }
  const tokenboundClient = new TokenboundClient({ chainId })
  const tokenBoundAccount = tokenboundClient.getAccount({
    tokenContract,
    tokenId,
  })
  return { accountAddress: tokenBoundAccount }
}
export default useGetNftAddress
