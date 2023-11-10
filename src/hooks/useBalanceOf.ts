import { formatFixed } from '@ethersproject/bignumber'
import { useEffect, useMemo, useState } from 'react'
import { useBalance } from 'wagmi'

import { emptyAddress } from '@app/utils/constants'

import { useErc20Contract } from './useContract'

export const useBalanceOf = (contractAddress: string, account: string, decimals = 18) => {
  const [balance, setBalance] = useState<string>()
  const contract = useErc20Contract(contractAddress)
  const { data } = useBalance({
    address: account as `0x${string}`,
  })

  useEffect(() => {
    if (!contract || !contractAddress || !account) return
    contract
      .balanceOf(account)
      .then((res) => {
        const b = formatFixed(res, decimals)
        setBalance(b)
      })
      .catch((error) => {
        console.log('error123', error)
      })
  }, [account, contractAddress, contract, decimals])

  return useMemo(() => {
    if (contractAddress === emptyAddress) {
      if (data && data.value) {
        return formatFixed(data.value, 18)
      }
      return 0
    }
    return balance
  }, [contractAddress, balance, data])
}
