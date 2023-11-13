import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import { LoadingOverlay } from '@app/components/LoadingOverlay'
import { useGetUserAllNFT } from '@app/hooks/requst/useGetUserNFT'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useChainId } from '@app/hooks/useChainId'
import useGetNftAddress from '@app/hooks/useGetNftAddress'
import { useGetNftOwner } from '@app/hooks/useGetNftOwner'
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
  const { accountAddress, tokenContract, tokenId } = useGetNftAddress(_name)
  const chainId = useChainId()
  const { owner } = useGetNftOwner(tokenId || '', tokenContract || '')
  const { address } = useAccountSafely()
  const nameOwner = useMemo(() => address === owner, [address, owner])

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
            nameOwner={nameOwner}
          />
          <NFTList
            nameOwner={nameOwner}
            accountAddress={accountAddress}
            nftData={nftData}
            NftLoading={NftLoading}
          />
        </ContentStyle>
      ) : (
        <>
          <LoadingOverlay />
        </>
      )}
    </>
  )
}
