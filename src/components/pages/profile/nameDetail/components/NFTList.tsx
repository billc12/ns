import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useChainId } from 'wagmi'

import { Button, Skeleton, mq } from '@ensdomains/thorin'

import DownShowicon from '@app/assets/DownShowicon.svg'
import UpDisplayicon from '@app/assets/UpDisplayicon.svg'
import Img6 from '@app/assets/nameDetail/img6.png'
import NftDetailDrawer from '@app/components/Awns/Drawer/NftDetailDrawer'
import { EmptyData } from '@app/components/EmptyData'
import { useGetUserAllNFT } from '@app/hooks/requst/useGetUserNFT'
import { useSBTIsDeployList } from '@app/hooks/useCheckAccountDeployment'

// import { useNameErc721Assets } from '@app/hooks/useNameDetails'
import { Assets } from '../children/Assets'

// import { Traits } from '../children/Traits'

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
const AuctionItem = styled.div`
  display: grid;
  grid-template-columns: 60px auto 150px;
  gap: 20px;
  border-radius: 10px;
  background: #f8fbff;
  padding: 10px;
  align-items: center;
  & .top {
    align-self: flex-start;
  }
`
const AuctionTitle1 = styled.p`
  color: #80829f;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const AuctionTitle2 = styled.p`
  color: #3f5170;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const GameList = ({ accountAddress }: { accountAddress: string }) => {
  const chainId = useChainId()
  // const { address } = useAccount()
  // const { data: nftData, loading: NftLoading } = useGetUserNFT({ name: 'apr.aw' })

  const { data: _allNftList, isLoading: NftLoading } = useGetUserAllNFT({
    account: accountAddress,
    chainId,
  })

  const nftData = useMemo(() => {
    if (!_allNftList || !_allNftList.length) return []
    return _allNftList.map((t) => t.assets).flat(1)
  }, [_allNftList])

  const [isPackUp, setIsPackUp] = useState<boolean>(false)
  const [isShowAll, setIsShowAll] = useState<boolean>(false)

  const nftList = useMemo(() => {
    if (!isPackUp) {
      if (nftData?.length && nftData?.length > 4) {
        return nftData?.slice(0, 4)
      }
    }
    return nftData
  }, [isPackUp, nftData])
  const contractAddressList = nftData?.map((i) => i.contract_address as string)
  const tokenIdList = nftData?.map((i) => i.token_id as string)
  const deploymentMap = useSBTIsDeployList(contractAddressList, tokenIdList)
  const erc6551List = useMemo(() => {
    if (!deploymentMap) return []
    const allList = nftData
      .filter((t, i) => deploymentMap[i])
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .map((i) => ({ ...i, erc_type: 'erc6551' }))
    if (!isShowAll) {
      if (allList?.length && allList?.length > 4) {
        return allList?.slice(0, 4)
      }
    }
    return allList
    // eslint-disable-next-line array-callback-return
  }, [deploymentMap, isShowAll, nftData])
  console.log('nftData123465', deploymentMap, nftData)
  const [drawerInfo, setDrawerInfo] = useState({
    open: false,
    item: {},
  })
  const handleDrawerOpen = (item: any) => {
    setDrawerInfo({
      open: true,
      item,
    })
  }
  const handleDrawerClose = () => {
    setDrawerInfo({
      open: false,
      item: {},
    })
  }
  return (
    <>
      {nftData && !!nftData.length && (
        <>
          <TabTitleStyle>
            {/* <SubTitleStyle>Account ({nftId.length})</SubTitleStyle> */}
            <SubTitleStyle>Account ({erc6551List.length})</SubTitleStyle>
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
            {erc6551List?.map((item, index) => (
              <Assets
                item={item}
                // eslint-disable-next-line react/no-array-index-key
                key={`${item.token_id} - ${index} - ${item.erc_type}`}
                onClick={() => handleDrawerOpen(item)}
              />
            ))}
          </AssetsStyle>
          <TabTitleStyle style={{ marginTop: 24 }}>
            <SubTitleStyle>Gaming ({nftData?.length || 0})</SubTitleStyle>
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
            {nftList?.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton loading={NftLoading} key={`${item.token_id} - ${index} - ${item.erc_type}`}>
                <Assets
                  item={item}
                  onClick={() => item.erc_type !== 'erc1155' && handleDrawerOpen(item)}
                />
              </Skeleton>
            ))}
            {/* <Traits /> */}
          </TraitsStyle>
          <NftDetailDrawer
            {...drawerInfo}
            onClose={handleDrawerClose}
            accountAddress={accountAddress}
          />
        </>
      )}
      {!nftData.length && <EmptyData />}
    </>
  )
}
const AuctionsList = () => {
  const list = [1, 2, 3]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {list.map((i) => (
        <AuctionItem key={i}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={Img6.src} alt="auction img" />
          <div>
            <AuctionTitle1>Ancient forest</AuctionTitle1>
            <AuctionTitle2>
              You converted the resources to 10 <span style={{ color: '#21C331' }}>XCOIN</span>
            </AuctionTitle2>
          </div>
          <AuctionTitle1 className="top">10/30 7:38:59 PM</AuctionTitle1>
        </AuctionItem>
      ))}
    </div>
  )
}
enum Tab {
  Gaming = 'Gaming Center',
  Actions = 'Actions',
}
const Page = ({ accountAddress }: { accountAddress: string }) => {
  const [curTab, setCurTab] = useState(Tab.Gaming)
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
          <PaginationBtn
            className={curTab === Tab.Gaming ? 'select' : ''}
            onClick={() => setCurTab(Tab.Gaming)}
          >
            Gaming Center
          </PaginationBtn>
          <PaginationBtn
            className={curTab === Tab.Actions ? 'select' : ''}
            onClick={() => setCurTab(Tab.Actions)}
            disabled
          >
            Actions
          </PaginationBtn>
        </ButtonGroup>
      </div>
      <ListCenter>
        {curTab === Tab.Gaming && <GameList accountAddress={accountAddress} />}
        {curTab === Tab.Actions && <AuctionsList />}
      </ListCenter>
    </CenterRightStyle>
  )
}
export default Page
