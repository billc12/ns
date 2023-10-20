import { BigNumber } from '@ethersproject/bignumber'
import { useEffect, useState } from 'react'

import { useAccountSafely } from './useAccountSafely'
import { useEthRegistrarControllerContract } from './useContract'
import { usePrimary } from './usePrimary'

export const useRewardsInfo = (total: BigNumber) => {
  const [rewardsObj, setRewardsObj] = useState({
    vailableRewards: BigNumber.from(0),
    usedRewards: BigNumber.from(0),
  })
  const [loading, setLoading] = useState(false)
  const contract = useEthRegistrarControllerContract()
  const { address } = useAccountSafely()
  const primary = usePrimary(address)

  useEffect(() => {
    if (!primary.data || !primary.data.beautifiedName.split('.')[0]) {
      return
    }
    setLoading(true)
    contract?.referralRewards(primary.data.beautifiedName.split('.')[0]).then((res: any) => {
      setRewardsObj({
        usedRewards: res,
        vailableRewards: !total ? BigNumber.from(0) : total.sub(res),
      })
      setLoading(false)
    })
  }, [contract, primary.data, primary.data?.beautifiedName, total])
  return {
    ...rewardsObj,
    loading,
  }
}
