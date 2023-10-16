// import { useRouter } from 'next/router'
// import { ReactNode, useCallback, useEffect, useRef } from 'react'
// import useTransition, { TransitionState } from 'react-transition-state'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Button, mq } from '@ensdomains/thorin'

import { Table } from '@app/components/table'

// import { Button, Spinner, Toast, Typography, mq } from '@ensdomains/thorin'

// import { useBreakpoint } from '@app/utils/BreakpointProvider'

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
  ${mq.sm.max(css`
    width: 100%;
    height: auto;
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
  height: auto;
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

const RewardsDetailsList = [
  {
    Date: '2023-09-22',
    Token: 'tatanick.aw',
    Type: 'Direct referrals',
    Rewards: 0.004,
  },
]

export default function Reawrds() {
  //   const breakpoints = useBreakpoint()
  const RewardsDetailsTableList = useMemo(() => {
    return RewardsDetailsList.map(({ Date, Token, Type, Rewards }) => [
      <TableContentStyle>{Date}</TableContentStyle>,
      <TableContentStyle>{Token}</TableContentStyle>,
      <TableContentStyle>{Type}</TableContentStyle>,
      <TableContentStyle style={{ justifyContent: 'end' }}>{Rewards}ETH</TableContentStyle>,
    ])
  }, [])

  return (
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
            <LeftContentStyle>0.04ETH</LeftContentStyle>
            <ButtonStyle>Claim</ButtonStyle>
          </ClaimStyle>
          <LeftItemStyle>
            <ContentTitleStyle>Total rewards</ContentTitleStyle>
            <LeftContentStyle>0.04ETH</LeftContentStyle>
          </LeftItemStyle>
          <LeftItemStyle>
            <ContentTitleStyle>Direct referrals</ContentTitleStyle>
            <LeftContentStyle>23</LeftContentStyle>
          </LeftItemStyle>
          <LeftItemStyle>
            <ContentTitleStyle>Indirect referrals</ContentTitleStyle>
            <LeftContentStyle>100</LeftContentStyle>
          </LeftItemStyle>
          <LeftItemStyle>
            <ContentTitleStyle>Number of lucky draws</ContentTitleStyle>
            <LeftOpenStyle>
              <LeftContentStyle>5</LeftContentStyle>
              <ButtonStyle style={{ width: '100px' }}>Open</ButtonStyle>
            </LeftOpenStyle>
          </LeftItemStyle>
        </CenterLeftStyle>
        <CenterRightStyle>
          <BottomTitleStyle style={{ padding: '20px 30px' }}>Rewards details</BottomTitleStyle>
          <StyledTable>
            <Table
              labels={['Date', 'Token', 'Type', 'Rewards']}
              rows={RewardsDetailsTableList}
              noneBorder
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
            2.Signing up for AWNS with an invitation code entitles the inviter and invitee to a 10%
            commission bonus on ETH,
          </>
          <br />

          <>
            3.respectively Whitelisted users will receive 20% commission on their invitation code.
          </>
          <br />

          <>4.Invitation code used up to 5 times will get a chance to win a lucky draw.</>
        </BottomContentStyle>
      </BottomStyle>
    </ContentStyle>
  )
}
