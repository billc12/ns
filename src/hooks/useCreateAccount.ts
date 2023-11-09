import { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (!tokenboundClient) return
    tokenboundClient
      .prepareCreateAccount({
        tokenContract: tokenContract as `0x${string}`,
        tokenId,
      })
      .then((res) => {
        console.log('prepareCreateAccount ', res)
        setBody({ to: res.to as string, value: res.value, data: res.data as string })
      })
  }, [tokenContract, tokenId, tokenboundClient])

  const { sendTransaction } = useSendTransaction({
    mode: 'recklesslyUnprepared',
    request: body ? { to: body?.to, value: body?.value, data: body?.data } : undefined,
  })

  useEffect(() => {
    console.log('body change', body, sendTransaction)
  }, [body, sendTransaction])

  return sendTransaction
}
