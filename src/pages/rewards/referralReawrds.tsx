import { BigNumber } from '@ethersproject/bignumber'
import router from 'next/router'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { Dropdown, mq } from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import DownChevron from '@app/assets/DownChevron.svg'
import ClaimRewards from '@app/components/Awns/ClaimRewards'
import { AvaNameLabel } from '@app/components/ConnectButton'
import { LoadingOverlay } from '@app/components/LoadingOverlay'
import { Table } from '@app/components/table'
import { useNamesFromAddress } from '@app/hooks/names/useNamesFromAddress/useNamesFromAddress'
import useReferralRewards from '@app/hooks/requst/useReferralRewardsCallback'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { usePrimary } from '@app/hooks/usePrimary'
import { timestampToDateFormat } from '@app/utils'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { makeDisplay } from '@app/utils/currency'
import { shortenAddress } from '@app/utils/utils'

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

const LeftItemStyle = styled.div`
  height: auto;
  width: 100%;
  display: grid;
  gap: 10px;
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
const DropdownStyle = styled(Dropdown)`
  height: 300px;
  overflow: scroll;
  padding: 0;
  & button {
    background: #fff;
    padding: 15px 20px;
  }
  & button:hover {
    background: #f7fafc;
  }
`
const DropdownBtn = styled.div`
  position: relative;
  width: 100%;
  & > button > div {
    color: #3f5170;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 700 !important;
    line-height: normal;
  }
  & > svg {
    position: absolute;
    right: 37px;
    top: 50%;
    transform: translateY(-50%);
  }
`
const limit = 7
export default function Rewards() {
  const breakpoints = useBreakpoint()
  const { address } = useAccountSafely()
  const primary = usePrimary(address!, !address)

  const [rewardsPage, setRewardsPage] = useState(1)
  const {
    data: namesData,
    // isLoading: namesLoading,
    status: namesStatus,
  } = useNamesFromAddress({
    address,
    sort: {
      type: 'expiryDate',
      orderDirection: 'asc',
    },
    page: 1,
    resultsPerPage: 'all',
    search: '',
  })

  const curName = useMemo(() => {
    if (router.router?.query.name) {
      if (namesData?.names.find((i) => i.name === router.router?.query.name)) {
        return router.router.query.name.slice(0, -3) as string
      }
    }
    if (primary.data && primary.data.beautifiedName) {
      return primary.data?.beautifiedName.slice(0, -3)
    }
    if (namesData && namesStatus === 'success' && !namesData?.names.length) {
      return namesData?.names[0].name.slice(0, -3)
    }
    return ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namesData, namesStatus, primary.data, router.router?.query.name])

  const dropdownList = useMemo<DropdownItem[]>(() => {
    const arr = namesData?.names.map((i) => (
      <div key={i.id} style={{ width: '100%' }}>
        <AvaNameLabel
          name={i.name.length > 20 ? shortenAddress(i.name, 20, 10, 10) : i.name}
          onClick={() => router.push(`/rewards?name=${i.name}`)}
          styles={{
            width: '100%',
            border: 'none',
            borderBottom: '1px solid #D4D7E2',
            borderRadius: 0,
          }}
        />
      </div>
    ))
    return arr || []
  }, [namesData?.names])
  const {
    data: RewardsDetails,
    isLoading: rewardsLoading,
    isFetching,
  } = useReferralRewards(curName as string, rewardsPage - 1, limit)
  const RewardsDetailsTableList = useMemo(() => {
    if (!RewardsDetails?.list) return []
    return RewardsDetails?.list?.map(({ registrant, reward, timestamp, type }) => [
      <TableContentStyle>{timestamp ? timestampToDateFormat(timestamp) : '--'}</TableContentStyle>,
      <TableContentStyle
        style={{
          width: breakpoints.sm ? '100px' : 'auto',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >{`${registrant}.aw`}</TableContentStyle>,
      <TableContentStyle>{type}</TableContentStyle>,
      <TableContentStyle style={{ justifyContent: 'end' }}>
        {makeDisplay(BigNumber.from(reward), undefined, 'eth', 18)}
      </TableContentStyle>,
    ])
  }, [RewardsDetails?.list, breakpoints.sm])
  const handleChangePage = (v: number) => {
    setRewardsPage(v)
  }
  const paginationParams = useMemo(() => {
    return {
      currentPage: rewardsPage,
      total: RewardsDetails
        ? (RewardsDetails.countDirect + RewardsDetails.countIndirect) / limit
        : 0,
      onChange: handleChangePage,
    }
  }, [RewardsDetails, rewardsPage])

  if (!curName) {
    return <p>No name available yet</p>
  }
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
              <DropdownStyle width={244} align="left" items={dropdownList}>
                {/* eslint-disable-next-line react/button-has-type */}
                <DropdownBtn>
                  <AvaNameLabel
                    name={`${curName.length > 11 ? shortenAddress(curName, 11, 5, 3) : curName}.aw`}
                    styles={{
                      width: '100%',
                      border: 'none',
                      background: '#F7FAFC',
                      padding: '15px 20px',
                    }}
                    imgSize={50}
                  />
                  <DownChevron />
                </DropdownBtn>
              </DropdownStyle>
              <ClaimRewards _name={curName} />
              <LeftItemStyle>
                <ContentTitleStyle>Direct referrals</ContentTitleStyle>
                <LeftContentStyle>{RewardsDetails?.countDirect || '0'}</LeftContentStyle>
              </LeftItemStyle>
              <LeftItemStyle>
                <ContentTitleStyle>Indirect referrals</ContentTitleStyle>
                <LeftContentStyle>{RewardsDetails?.countIndirect || '0'}</LeftContentStyle>
              </LeftItemStyle>
            </CenterLeftStyle>
            <CenterRightStyle>
              <BottomTitleStyle style={{ padding: '20px 30px' }}>Rewards details</BottomTitleStyle>
              <StyledTable>
                <Table
                  labels={['Date', 'AWNS', 'Type', 'Rewards']}
                  rows={RewardsDetailsTableList}
                  noneBorder
                  isLoading={rewardsLoading || isFetching}
                  isEnablePagination
                  paginationParams={paginationParams}
                />
              </StyledTable>
            </CenterRightStyle>
          </BodyStyle>
          <BottomStyle style={{ display: 'none' }}>
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
