import { BigNumber } from '@ethersproject/bignumber'
import { useEffect, useState } from 'react'

import { useAccountSafely } from './useAccountSafely'
import { useEthRegistrarControllerContract } from './useContract'

export const useRewardsInfo = (total: BigNumber) => {
  const [rewardsObj, setRewardsObj] = useState({
    vailableRewards: BigNumber.from(0),
    usedRewards: BigNumber.from(0),
  })
  const [loading, setLoading] = useState(false)
  const contract = useEthRegistrarControllerContract()
  const { address } = useAccountSafely()

  useEffect(() => {
    setLoading(true)
    contract?.referralRewards(address || '').then((res) => {
      setRewardsObj({
        usedRewards: res,
        vailableRewards: !total ? BigNumber.from(0) : total.sub(res),
      })
      setLoading(false)
    })
  }, [address, contract, total])
  return {
    ...rewardsObj,
    loading,
  }
}
