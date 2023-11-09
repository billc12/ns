import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSendTransaction } from 'wagmi'

import { useTokenboundClient } from './useTokenboundClient'

interface IBody {
  to: string
  value: any
  data: string
}
// const defaultBody: IBody = { to: '', value: '' }

export const useCreateAccount = (tokenContract: string, tokenId: string) => {
  const tokenboundClient = useTokenboundClient()
  const [body, setBody] = useState<IBody>()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!tokenboundClient) return
    setLoading(true)
    tokenboundClient
      .prepareCreateAccount({
        tokenContract: tokenContract as `0x${string}`,
        tokenId,
      })
      .then((res) => {
        console.log('prepareCreateAccount ', res)
        setBody({ to: res.to as string, value: res.value, data: res.data as string })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [tokenContract, tokenId, tokenboundClient])

  const { sendTransaction, data } = useSendTransaction({
    mode: 'recklesslyUnprepared',
    request: body ? { to: body?.to, value: body?.value, data: body?.data } : undefined,
    onSuccess() {
      setLoading(false)
    },
    onError() {
      setLoading(false)
    },
  })
  useEffect(() => {
    if (!data?.wait) return
    setLoading(true)
    toast
      .promise(
        data?.wait,
        {
          pending: 'Pending',
          error: 'Failed',
          success: 'Transaction Successful',
        },
        {
          onClick: () => {
            window.open(`https://sepolia.etherscan.io/tx/${data?.hash}`, '_blank')
          },
        },
      )
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [data?.hash, data?.wait])
  return { callback: sendTransaction, loading }
}
