import { BigNumber } from '@ethersproject/bignumber'
import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'

import { useAccountSafely } from './useAccountSafely'
import { useEthRegistrarControllerContract } from './useContract'
import useGetSignReferral from './useGetSignReferral'
import { usePrimary } from './usePrimary'

export const useRewardsInfo = () => {
  const { address } = useAccountSafely()
  const primary = usePrimary(address)
  const name = primary.data?.beautifiedName.split('.')[0] || ''
  const { data: rewardData } = useGetSignReferral(name)
  const reward = rewardData?.reward

  const signature = rewardData?.signature || ''
  const key = useQueryKeys().getReferralRewardsInfo(name)
  const contract = useEthRegistrarControllerContract()
  const { data: rewardInfo, isLoading } = useQuery(
    key,
    async () => {
      const res = await contract?.referralRewards(name)
      return {
        usedRewards: res,
        vailableRewards: BigNumber.from(reward).sub(res || BigNumber.from('0')),
        totalRewards: BigNumber.from(reward),
        signature,
      }
    },
    { enabled: !!name && !!reward && !!contract && !!signature },
  )
  return { rewardInfo, isLoading }
}
