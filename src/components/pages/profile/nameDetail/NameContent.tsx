import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import { LoadingOverlay } from '@app/components/LoadingOverlay'
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
  return (
    <>
      {_name && accountAddress ? (
        <ContentStyle>
          <NameInfo accountAddress={accountAddress} _name={_name} />
          <NFTList accountAddress={accountAddress} />
        </ContentStyle>
      ) : (
        <>
          <LoadingOverlay />
        </>
      )}
    </>
  )
}
