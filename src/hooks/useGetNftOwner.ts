import { useEffect, useState } from 'react'

import { erc721ContractAddress } from '@app/utils/constants'

import { useErc721Contract } from './useContract'

export const useGetNftOwner = (tokenId: string) => {
  const contract = useErc721Contract(erc721ContractAddress)
  const [owner, setOwner] = useState('')
  useEffect(() => {
    if (!contract || !tokenId) return
    contract
      .ownerOf(tokenId)
      .then((res) => {
        console.log('res123456', res)
      })
      .catch((error) => {
        setOwner('')
        console.log('res123456', error, tokenId)
      })
  }, [contract, tokenId])
  return { owner }
}
