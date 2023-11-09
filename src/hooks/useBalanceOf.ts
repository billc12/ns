import { formatFixed } from '@ethersproject/bignumber'
import { useEffect, useMemo, useState } from 'react'
import { useBalance } from 'wagmi'

import { emptyAddress } from '@app/utils/constants'

import { useErc20Contract } from './useContract'

export const useBalanceOf = (address: string, account: string, decimals = 18) => {
  const [balance, setBalance] = useState<string>()
  const contract = useErc20Contract(address)
  const { data } = useBalance({
    address: address === emptyAddress ? (account as `0x${string}`) : (account as `0x${string}`),
  })

  useEffect(() => {
    if (!contract || !address) return
    contract.balanceOf(account).then((res) => {
      const b = formatFixed(res, decimals)
      setBalance(b)
    })
  }, [account, address, contract, decimals])

  return useMemo(() => {
    if (address === emptyAddress) {
      if (data && data.value) {
        return formatFixed(data.value, 18)
      }
      return 0
    }
    return balance
  }, [address, balance, data])
}
