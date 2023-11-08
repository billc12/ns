import { useEffect, useState } from 'react'
import { useWaitForTransaction } from 'wagmi'

import { useErc721Contract } from '../useContract'

export const useTransferNFT = (from: string, to: string, tokenId: string) => {
  const [loading, setLoading] = useState(false)
  const [hash, setHash] = useState('')
  const erc721Contract = useErc721Contract()
  useEffect(() => {
    if (!erc721Contract || !to || !from || !tokenId) return
    setLoading(true)
    erc721Contract
      .transferFrom(from, to, tokenId)
      .then((res) => {
        setHash(res.hash)
        setLoading(false)
      })
      .catch(() => {
        setHash('')
        setLoading(false)
      })
  }, [erc721Contract, from, to, tokenId])
  const { data, isError, isLoading } = useWaitForTransaction({ hash: hash as `0x${string}` })
  console.log('data, isError, isLoading,loading', data, isError, isLoading, loading)
}
