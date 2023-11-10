import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import { LoadingOverlay } from '@app/components/LoadingOverlay'
import { useGetUserAllNFT } from '@app/hooks/requst/useGetUserNFT'
import { useChainId } from '@app/hooks/useChainId'
import useGetNftAddress from '@app/hooks/useGetNftAddress'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'

import NFTList from './components/NFTList'
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

export default function NameContent() {
  const router = useRouterWithHistory()
  const _name = router.query.name as string
  const { accountAddress } = useGetNftAddress(_name)
  const chainId = useChainId()

  const { data: nftData, isLoading: NftLoading } = useGetUserAllNFT({
    account: accountAddress || '',
    chainId,
  })

  return (
    <>
      {_name && accountAddress ? (
        <ContentStyle>
          <NameInfo
            accountAddress={accountAddress}
            _name={_name}
            nftDataLenght={nftData?.length || 0}
          />
          <NFTList accountAddress={accountAddress} nftData={nftData} NftLoading={NftLoading} />
        </ContentStyle>
      ) : (
        <>
          <LoadingOverlay />
        </>
      )}
    </>
  )
}
