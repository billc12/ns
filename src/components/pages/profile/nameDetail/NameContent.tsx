import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, Skeleton, mq } from '@ensdomains/thorin'

import DownShowicon from '@app/assets/DownShowicon.svg'
import UpDisplayicon from '@app/assets/UpDisplayicon.svg'
import { LoadingOverlay } from '@app/components/LoadingOverlay'
import useGetNftAddress from '@app/hooks/useGetNftAddress'
import { useNameErc721Assets } from '@app/hooks/useNameDetails'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'

import { Assets } from './children/Assets'
import { Traits } from './children/Traits'
import NameInfo from './components/nameInfo'

const ContentStyle = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  gap: 20px;
  ${mq.sm.max(css`
    display: grid;
    width: 100%;
  `)}
`

const CenterRightStyle = styled.div`
  border-radius: 10px;
  border: 1px solid #d4d7e2;
  background: #fff;
  box-shadow: 0 4px 14px 0 rgba(40, 79, 115, 0.1);
  width: 750px;
  height: 800px;
  display: flex;
  padding: 24px;
  gap: 20px;
  flex-direction: column;
  justify-content: start;
  /* overflow-y: auto; */
  &::-webkit-scrollbar {
    display: none;
  }
  ${mq.sm.max(css`
    width: 100%;
    height: auto;
    min-height: 300px;
  `)}
`
const SubButtonStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
`

const SubTitleStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 14px;
  font-weight: 600;
`
const TabTitleStyle = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const AssetsStyle = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  transition: all 1s;
`
const TraitsStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
  column-gap: 15px;
  transition: all 1s;
`

const PaginationBtn = styled(Button)`
  display: flex;
  width: 206px;
  height: 36px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #0049c6;
`
const ListCenter = styled.div`
  width: 100%;
  height: calc(100% - 84px);
  overflow: scroll;
  overflow-x: hidden;
`
export default function NameContent() {
  const router = useRouterWithHistory()
  const _name = router.query.name as string
  //   const breakpoints = useBreakpoint()
  const [isShowAll, setIsShowAll] = useState<boolean>(false)
  const [isPackUp, setIsPackUp] = useState<boolean>(true)

  const { accountAddress } = useGetNftAddress(_name)
  // const { address } = useAccountSafely()
  const { nftId, loading: NftLoading } = useNameErc721Assets(accountAddress)
  const nftList = useMemo(() => {
    if (!isShowAll) {
      if (nftId.length > 4) {
        return nftId.slice(0, 4)
      }
    }
    return nftId
  }, [isShowAll, nftId])
  console.log('nftList', nftList)

  return (
    <>
      {_name && accountAddress ? (
        <ContentStyle>
          <NameInfo accountAddress={accountAddress} _name={_name} />
          <CenterRightStyle>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottom: '1px solid #D4D7E2',
                paddingBottom: '24px',
              }}
            >
              <PaginationBtn>Knapsack</PaginationBtn>
              <PaginationBtn
                style={{
                  background: '#fff',
                  color: '#80829F',
                  border: '1px solid #D4D7E2',
                  borderLeft: 'none',
                }}
              >
                Actions
              </PaginationBtn>
            </div>
            <ListCenter>
              <TabTitleStyle>
                <SubTitleStyle>Account ({nftId.length})</SubTitleStyle>
                <SubButtonStyle
                  onClick={() => {
                    setIsShowAll(!isShowAll)
                  }}
                >
                  Show All
                  {isShowAll ? <DownShowicon /> : <UpDisplayicon />}
                </SubButtonStyle>
              </TabTitleStyle>
              <AssetsStyle>
                <>
                  {nftList?.map((item) => (
                    <Skeleton loading={NftLoading} key={item}>
                      <Assets NftId={item} />
                    </Skeleton>
                  ))}
                </>
              </AssetsStyle>
              <TabTitleStyle style={{ marginTop: 10 }}>
                <SubTitleStyle style={{ marginBottom: 10 }}>Gaming (4)</SubTitleStyle>
                <SubButtonStyle
                  onClick={() => {
                    setIsPackUp(!isPackUp)
                  }}
                >
                  Pack Up
                  {isPackUp ? <DownShowicon /> : <UpDisplayicon />}
                </SubButtonStyle>
              </TabTitleStyle>
              <TraitsStyle
                style={{
                  height: isPackUp ? 'auto' : 0,
                  overflow: isPackUp ? 'unset' : 'hidden',
                }}
              >
                <Traits />
                <Traits />
                <Traits />
                <Traits />
              </TraitsStyle>
            </ListCenter>
          </CenterRightStyle>
        </ContentStyle>
      ) : (
        <>
          <LoadingOverlay />
        </>
      )}
    </>
  )
}
