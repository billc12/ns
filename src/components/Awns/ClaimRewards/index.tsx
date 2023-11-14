import { BigNumber } from '@ethersproject/bignumber'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { Button, Skeleton } from '@ensdomains/thorin'

import { useAccountSafely } from '@app/hooks/useAccountSafely'
import useGetNftAddress from '@app/hooks/useGetNftAddress'
import { useGetNftOwner } from '@app/hooks/useGetNftOwner'
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
  font-size: 28px;
  font-weight: 700;
  height: 44px;
`
const LeftItemStyle = styled.div`
  height: auto;
  width: 100%;
  display: grid;
  gap: 10px;
`
const ClaimRewards = ({ _name }: { _name: string }) => {
  const { rewardInfo, isLoading: loading } = useRewardsInfo(_name)
  const vailableRewards = rewardInfo?.vailableRewards || BigNumber.from('0')
  const totalRewards = rewardInfo?.totalRewards || BigNumber.from('0')
  const { tokenContract, tokenId } = useGetNftAddress(`${_name}.aw`)
  const { owner } = useGetNftOwner(tokenId || '', tokenContract || '')
  const { address } = useAccountSafely()

  const nameOwner = useMemo(
    () => owner.toLocaleLowerCase() === address?.toLocaleLowerCase(),
    [address, owner],
  )
  const signature = rewardInfo?.signature || ''
  const { createTransactionFlow } = useTransactionFlow()
  const primary = usePrimary(address, !address)
  const name = primary.data?.beautifiedName.split('.')[0]
  const claimKey = `claim-${name}-${address}`
  const handleClaim = useCallback(async () => {
    // await refetch()
    createTransactionFlow(claimKey, {
      transactions: [
        makeTransactionItem('claimRewards', {
          name: _name || '',
          canClaimReferralRewards: vailableRewards,
          referralReward: totalRewards,
          signature: signature!,
          totalReferralRewards: totalRewards,
        }),
      ],
      requiresManualCleanup: true,
      autoClose: true,
    })
  }, [_name, claimKey, createTransactionFlow, signature, totalRewards, vailableRewards])
  const auctionBtn = useMemo(() => {
    if (loading || !signature || !primary) {
      return (
        <ButtonStyle loading disabled>
          Claim
        </ButtonStyle>
      )
    }
    if (vailableRewards.lte(BigNumber.from(0)) || !nameOwner) {
      return <ButtonStyle disabled>Claim</ButtonStyle>
    }
    return <ButtonStyle onClick={handleClaim}>Claim</ButtonStyle>
  }, [handleClaim, loading, nameOwner, primary, signature, vailableRewards])
  return (
    <>
      <ClaimStyle>
        <ContentTitleStyle>Available Rewards</ContentTitleStyle>
        <Skeleton loading={loading}>
          <LeftContentStyle>
            {makeDisplay(vailableRewards, undefined, 'eth', 18, 4, 8)}
          </LeftContentStyle>
        </Skeleton>
        {auctionBtn}
      </ClaimStyle>
      <LeftItemStyle>
        <ContentTitleStyle>Total Rewards</ContentTitleStyle>
        <Skeleton loading={loading}>
          <LeftContentStyle>
            {totalRewards ? makeDisplay(totalRewards, undefined, 'eth', 18, 4, 8) : '0ETH'}
          </LeftContentStyle>
        </Skeleton>
      </LeftItemStyle>
    </>
  )
}
export default ClaimRewards
