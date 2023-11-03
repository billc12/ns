import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import TestImg from '@app/assets/TestImage.png'
import { ReturnedName } from '@app/hooks/names/useNamesFromAddress/useNamesFromAddress'

import BaseLink from './@atoms/BaseLink'
import { useEthInvoice } from './pages/profile/[name]/registration/steps/Awns_Complete'

const BottomStyle = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 40px 10px 15px;
  border-radius: 0 0 10px 10px;
  background: #f8fbff;
`
const RoundImg = styled.img`
  width: 210px;
  height: 210px;
`
const Container = styled.div`
  height: max-content;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #d4d7e2;
  background: #f8fbff;
`
export const AddressItem = ({ AddressRow }: { AddressRow: ReturnedName }) => {
  console.log('AddressRow=>', AddressRow)
  const { avatarSrc } = useEthInvoice(AddressRow.name, false)
  return (
    <>
      <BaseLink href={`/profile/${AddressRow.name}`}>
        <Container>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <RoundImg src={avatarSrc || TestImg.src} alt="default img" />
          <BottomStyle>
            <Typography ellipsis>{AddressRow.name || '--'}</Typography>
          </BottomStyle>
        </Container>
      </BaseLink>
    </>
  )
}
