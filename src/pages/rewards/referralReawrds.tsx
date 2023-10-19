import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Button, Skeleton, mq } from '@ensdomains/thorin'

import { LoadingOverlay } from '@app/components/LoadingOverlay'
import { Table } from '@app/components/table'
import useReferralRewards from '@app/hooks/requst/useReferralRewardsCallback'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { usePrimary } from '@app/hooks/usePrimary'
import { useRewardsInfo } from '@app/hooks/useRewardsInfo'
import { timestampToDateFormat } from '@app/utils'
import { makeDisplay } from '@app/utils/currency'

const ContentStyle = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  gap: 20px;
`
const HeaderTitles = styled.div`
  width: 100%;
  height: auto;
  display: grid;
  gap: 20px;
`

const TitleStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-size: 36px;
  font-weight: 700;
  text-align: center;
`

const SubtitleStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-size: 16px;
  font-weight: 400;
  text-align: center;
`

const BodyStyle = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  gap: 14px;
  ${mq.sm.max(css`
    display: grid;
  `)}
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

const CenterLeftStyle = styled.div`
  border-radius: 10px;
  border: 1px solid var(--line, #d4d7e2);
  background: #fff;
  box-shadow: 0 4px 14px 0 rgba(40, 79, 115, 0.1);
  width: 318px;
  height: 585px;
  padding: 30px 36px;
  display: grid;
  gap: 24px;
  ${mq.sm.max(css`
    width: 100%;
    height: auto;
  `)}
`

const ClaimStyle = styled.div`
  height: auto;
  width: 100%;
  display: grid;
  gap: 10px;
`

const LeftItemStyle = styled.div`
  height: auto;
  width: 100%;
  display: grid;
  gap: 10px;
`

const LeftOpenStyle = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
`

const CenterRightStyle = styled.div`
  border-radius: 10px;
  border: 1px solid var(--line, #d4d7e2);
  background: #fff;
  box-shadow: 0 4px 14px 0 rgba(40, 79, 115, 0.1);
  width: 643px;
  height: 585px;
  display: flex;
  flex-direction: column;
  ${mq.sm.max(css`
    width: 100%;
    height: auto;
    min-height: 300px;
  `)}
`

const BottomStyle = styled.div`
  border-radius: 10px;
  border: 1px solid var(--line, #d4d7e2);
  background: #fff;
  width: 975px;
  height: 270px;
  padding: 20px 65px 40px 40px;
  box-shadow: 0 4px 14px 0 rgba(40, 79, 115, 0.1);
  display: grid;
  gap: 30px;
  ${mq.sm.max(css`
    width: 100%;
    height: auto;
  `)}
`
const BottomTitleStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-size: 18px;
  font-weight: 700;
`
const BottomContentStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-size: 16px;
  font-weight: 400;
  line-height: 36px;
`

const ButtonStyle = styled(Button)`
  height: 40px;
`
const StyledTable = styled.div`
  width: 100%;
  height: 100%;
  & table thead tr {
    text-align: left;
  }
`

const TableContentStyle = styled.div(
  () => css`
    height: 58px;
    display: flex;
    align-items: center;
    color: var(--word-color, #3f5170);
    font-size: 16px;
    font-weight: 400;
    ${mq.sm.max(css`
      height: 36px;
    `)}
  `,
)

// const RewardsDetailsList = [
//   {
//     Date: '2023-09-22',
//     Token: 'tatanick.aw',
//     Type: 'Direct referrals',
//     Rewards: 0.004,
//   },
// ]

export default function Rewards() {
  const { address } = useAccountSafely()
  const primary = usePrimary(address!, !address)

  const { data: RewardsDetails, isLoading: rewardsLoading } = useReferralRewards(
    primary.data?.beautifiedName ? primary.data?.beautifiedName.slice(0, -3) : '',
  )
  const { vailableRewards, loading } = useRewardsInfo(
    RewardsDetails?.totalRewards || BigNumber.from(0),
  )
  const RewardsDetailsTableList = useMemo(() => {
    if (!RewardsDetails?.list) return []
    return RewardsDetails?.list?.map(({ referral, reward, timestamp, type }) => [
      <TableContentStyle>{timestamp ? timestampToDateFormat(timestamp) : '--'}</TableContentStyle>,
      <TableContentStyle>{referral}</TableContentStyle>,
      <TableContentStyle>{type}</TableContentStyle>,
      <TableContentStyle style={{ justifyContent: 'end' }}>
        {makeDisplay(BigNumber.from(reward), undefined, 'eth', 18)}
      </TableContentStyle>,
    ])
  }, [RewardsDetails?.list])
  return (
    <>
      {RewardsDetails && !rewardsLoading ? (
        <ContentStyle>
          <HeaderTitles>
            <TitleStyle>Referral Rewards</TitleStyle>
            <SubtitleStyle>
              Apply for AWNS and enter the AWNS of the referrer to get rewards.
            </SubtitleStyle>
          </HeaderTitles>
          <BodyStyle>
            <CenterLeftStyle>
              <ClaimStyle>
                <ContentTitleStyle>Available rewards</ContentTitleStyle>
                <Skeleton loading={loading}>
                  <LeftContentStyle>
                    {makeDisplay(vailableRewards, undefined, 'eth', 18)}
                  </LeftContentStyle>
                </Skeleton>
                <ButtonStyle>Claim</ButtonStyle>
              </ClaimStyle>
              <LeftItemStyle>
                <ContentTitleStyle>Total rewards</ContentTitleStyle>
                <Skeleton loading={rewardsLoading}>
                  <LeftContentStyle>
                    {RewardsDetails.totalRewards
                      ? makeDisplay(RewardsDetails.totalRewards, undefined, 'eth', 18)
                      : '0ETH'}
                  </LeftContentStyle>
                </Skeleton>
              </LeftItemStyle>
              <LeftItemStyle>
                <ContentTitleStyle>Direct referrals</ContentTitleStyle>
                <LeftContentStyle>{RewardsDetails?.countDirect || '0'}</LeftContentStyle>
              </LeftItemStyle>
              <LeftItemStyle>
                <ContentTitleStyle>Indirect referrals</ContentTitleStyle>
                <LeftContentStyle>{RewardsDetails?.countIndirect || '0'}</LeftContentStyle>
              </LeftItemStyle>
              <LeftItemStyle>
                <ContentTitleStyle>Number of lucky draws</ContentTitleStyle>
                <LeftOpenStyle>
                  <LeftContentStyle>0</LeftContentStyle>
                  <ButtonStyle style={{ width: '100px' }}>Open</ButtonStyle>
                </LeftOpenStyle>
              </LeftItemStyle>
            </CenterLeftStyle>
            <CenterRightStyle>
              <BottomTitleStyle style={{ padding: '20px 30px' }}>Rewards details</BottomTitleStyle>
              <StyledTable>
                <Table
                  labels={['Date', 'AWNS', 'Type', 'Rewards']}
                  rows={RewardsDetailsTableList}
                  noneBorder
                  isLoading={rewardsLoading}
                />
              </StyledTable>
            </CenterRightStyle>
          </BodyStyle>
          <BottomStyle>
            <BottomTitleStyle>Terms & Conditions</BottomTitleStyle>
            <BottomContentStyle>
              <>1.Each user will get an invitation code after registering AWNS.</>
              <br />
              <>
                2.Signing up for AWNS with an invitation code entitles the inviter and invitee to a
                10% commission bonus on ETH,
              </>
              <br />

              <>
                3.respectively Whitelisted users will receive 20% commission on their invitation
                code.
              </>
              <br />

              <>4.Invitation code used up to 5 times will get a chance to win a lucky draw.</>
            </BottomContentStyle>
          </BottomStyle>
        </ContentStyle>
      ) : (
        <>
          <LoadingOverlay />
        </>
      )}
    </>
  )
}
