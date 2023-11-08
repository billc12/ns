// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TokenboundClient } from '@tokenbound/sdk'
import { waitForTransaction } from '@wagmi/core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
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
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const tokenboundClient = useMemo(() => {
    if (!chainId || !signer) return
    return new TokenboundClient({ chainId, signer })
  }, [chainId, signer])

  const callback = useCallback(() => {
    if (!tokenboundClient) return
    setLoading(true)
    tokenboundClient
      .transferNFT({
        account,
        recipientAddress,
        tokenContract,
        tokenId,
        tokenType,
      })
      .then((res) => setHash(res))
      .catch(() => {
        setLoading(false)
        toast.error('Cancel Transaction')
      })
  }, [account, recipientAddress, tokenContract, tokenId, tokenType, tokenboundClient])

  useEffect(() => {
    if (!hash) return
    const rusult = waitForTransaction({ hash: hash as `0x${string}` })
    toast
      .promise(
        rusult,
        {
          pending: 'Pending',
          error: 'Failed',
          success: 'Transaction Successful',
        },
        {
          onClick: () => {
            window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank')
          },
        },
      )
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [hash])

  return { callback, loading }
}
