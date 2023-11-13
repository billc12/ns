import { useEffect, useState } from 'react'

// import { erc721ContractAddress } from '@app/utils/constants'
import { useErc721Contract } from './useContract'

export const useGetNftOwner = (tokenId: string, contractAddress: string) => {
  const contract = useErc721Contract(contractAddress)
  const [owner, setOwner] = useState('')
  useEffect(() => {
    if (!contract || !tokenId || !contractAddress) return
    contract
      .ownerOf(tokenId)
      .then((res) => {
        console.log('res123456', res)
        setOwner(res)
      })
      .catch((error) => {
        setOwner('')
        console.log('res123456', error, tokenId)
      })
  }, [contract, contractAddress, tokenId])
  return { owner }
}
