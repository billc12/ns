import { BigNumber } from '@ethersproject/bignumber'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { Button, Skeleton } from '@ensdomains/thorin'

import useGetRewardsSignature from '@app/hooks/requst/useGetRewardsSignature'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
// import { useEthRegistrarControllerContract } from '@app/hooks/useContract'
import { usePrimary } from '@app/hooks/usePrimary'
import { useRewardsInfo } from '@app/hooks/useRewardsInfo'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { makeDisplay } from '@app/utils/currency'

const ButtonStyle = styled(Button)`
  height: 40px;
`
const ClaimStyle = styled.div`
  height: auto;
  width: 100%;
  display: grid;
  gap: 10px;
`
const ContentTitleStyle = styled.div`
  color: var(--word-color2, #8d8ea5);
  font-size: 16px;
  font-weight: 400;
  height: 19px;
`
const LeftContentStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-size: 36px;
  font-weight: 700;
  height: 44px;
`
const ClaimRewards = () => {
  const { rewardInfo, isLoading: loading } = useRewardsInfo()
  const vailableRewards = rewardInfo?.vailableRewards || BigNumber.from('0')
  const totalRewards = rewardInfo?.vailableRewards || BigNumber.from('0')
  const { createTransactionFlow } = useTransactionFlow()
  const { address } = useAccountSafely()
  const primary = usePrimary(address, !address)
  const { data } = useGetRewardsSignature(primary.data?.beautifiedName.split('.')[0] || '')

  const signature = data?.signature
  const claimKey = `claim-${primary.data?.beautifiedName}-${address}`

  const handleClaim = useCallback(() => {
    return createTransactionFlow(claimKey, {
      transactions: [
        makeTransactionItem('claimRewards', {
          name: primary.data?.beautifiedName || '',
          canClaimReferralRewards: vailableRewards,
          referralReward: BigNumber.from(data?.reward || '0'),
          signature: signature!,
          totalReferralRewards: totalRewards,
        }),
      ],
      requiresManualCleanup: true,
      autoClose: true,
    })
  }, [
    claimKey,
    createTransactionFlow,
    data?.reward,
    primary.data?.beautifiedName,
    signature,
    totalRewards,
    vailableRewards,
  ])
  const auctionBtn = useMemo(() => {
    if (loading || !signature || !primary || !data) {
      console.log(
        'loading || !signature || !primary || !data',
        loading || !signature || !primary || !data,
      )

      return (
        <ButtonStyle loading disabled>
          Claim
        </ButtonStyle>
      )
    }
    if (vailableRewards.lte(BigNumber.from(0))) {
      return <ButtonStyle disabled>Not Enough Rewards</ButtonStyle>
    }
    return <ButtonStyle onClick={handleClaim}>Claim</ButtonStyle>
  }, [data, handleClaim, loading, primary, signature, vailableRewards])

  return (
    <ClaimStyle>
      <ContentTitleStyle>Available rewards</ContentTitleStyle>
      <Skeleton loading={loading}>
        <LeftContentStyle>{makeDisplay(vailableRewards, undefined, 'eth', 18)}</LeftContentStyle>
      </Skeleton>
      {auctionBtn}
    </ClaimStyle>
  )
}
export default ClaimRewards
