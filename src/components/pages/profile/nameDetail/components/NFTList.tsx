import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, Skeleton, mq } from '@ensdomains/thorin'

import DownShowicon from '@app/assets/DownShowicon.svg'
import UpDisplayicon from '@app/assets/UpDisplayicon.svg'
import { useNameErc721Assets } from '@app/hooks/useNameDetails'

import { Assets } from '../children/Assets'
import { Traits } from '../children/Traits'

const CenterRightStyle = styled.div`
  border-radius: 10px;
  border: 1px solid #d4d7e2;
  background: #fff;
  box-shadow: 0 4px 14px 0 rgba(40, 79, 115, 0.1);
  width: 750px;
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: start;

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
  padding-bottom: 12px;
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
  background: #fff;
  color: #80829f;

  &:hover {
    transform: translateY(0);
  }
  &.select {
    background: #0049c6;
    color: #fff;
  }
`
const ListCenter = styled.div`
  width: 100%;
  height: calc(100% - 84px);
  overflow: scroll;
  overflow-x: hidden;
  padding: 24px;
  &::-webkit-scrollbar {
    display: none;
  }
`
const ButtonGroup = styled.div`
  display: flex;
  width: max-content;
  height: max-content;
  border-radius: 8px;
  border: 1px solid var(--line, #d4d7e2);
  background: #fff;
`
const GameList = ({ accountAddress }: { accountAddress: string }) => {
  const [isPackUp, setIsPackUp] = useState<boolean>(false)
  const [isShowAll, setIsShowAll] = useState<boolean>(false)
  const { nftId, loading: NftLoading } = useNameErc721Assets(accountAddress)
  const nftList = useMemo(() => {
    if (!isPackUp) {
      if (nftId.length > 4) {
        return nftId.slice(0, 4)
      }
    }
    return nftId
  }, [isPackUp, nftId])
  return (
    <>
      <TabTitleStyle>
        {/* <SubTitleStyle>Account ({nftId.length})</SubTitleStyle> */}
        <SubTitleStyle>Account ({2})</SubTitleStyle>
        <SubButtonStyle
          onClick={() => {
            setIsShowAll(!isShowAll)
          }}
        >
          {isShowAll ? 'Collapse' : 'Show All'}
          {isShowAll ? <DownShowicon /> : <UpDisplayicon />}
        </SubButtonStyle>
      </TabTitleStyle>
      <AssetsStyle>
        <>
          <Assets NftId="test1" />
          <Assets NftId="test1" />
        </>
      </AssetsStyle>
      <TabTitleStyle style={{ marginTop: 24 }}>
        <SubTitleStyle>Gaming ({nftId.length + 4})</SubTitleStyle>
        <SubButtonStyle
          onClick={() => {
            setIsPackUp(!isPackUp)
          }}
        >
          {isPackUp ? 'Collapse' : 'Show All'}

          {isPackUp ? <DownShowicon /> : <UpDisplayicon />}
        </SubButtonStyle>
      </TabTitleStyle>
      <TraitsStyle>
        {nftList?.map((item) => (
          <Skeleton loading={NftLoading} key={item}>
            <Assets NftId={item} />
          </Skeleton>
        ))}
        <Traits />
      </TraitsStyle>
    </>
  )
}
// enum Tab {
//   Gaming:''
// }
const Page = ({ accountAddress }: { accountAddress: string }) => {
  // const
  return (
    <CenterRightStyle>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '1px solid #D4D7E2',
          padding: '16px 0',
        }}
      >
        <ButtonGroup>
          <PaginationBtn className="select">Gaming Center</PaginationBtn>
          <PaginationBtn>Actions</PaginationBtn>
        </ButtonGroup>
      </div>
      <ListCenter>
        <GameList accountAddress={accountAddress} />
      </ListCenter>
    </CenterRightStyle>
  )
}
export default Page
