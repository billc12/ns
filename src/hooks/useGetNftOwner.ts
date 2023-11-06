import { useEffect, useState } from 'react'

import { useErc721Contract } from './useContract'

export const useGetNftOwner = (tokenId: string) => {
  const contract = useErc721Contract('0x8F116BEFAf0a26E1B9e4Dd29F85EA1f48a7a0Ff2')
  const [owner, setOwner] = useState('')
  useEffect(() => {
    if (!contract) return
    contract
      .ownerOf('1')
      .then((res) => {
        console.log('res123456', res)
      })
      .catch((error) => {
        setOwner('')
        console.log('res123456', error)
      })
  }, [contract, tokenId])
  return { owner }
}
