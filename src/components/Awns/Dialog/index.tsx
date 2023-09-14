import Image from 'next/image'
// import { useState } from 'react'
import styled from 'styled-components'

import { Button, Dialog, Typography } from '@ensdomains/thorin'

import UserAvatar from '@app/assets/TestImage.png'
// eslint-disable-next-line import/no-cycle
import { formatDateString } from '@app/components/pages/profile/[name]/tabs/ProfileTab'
import { useNameDetails } from '@app/hooks/useNameDetails'

const InterText = styled(Typography)<{ $size?: string; $color?: string; $weight?: number }>`
  width: max-content;
  height: max-content;
  color: ${(props) => props.$color || '#fff'};
  font-size: ${(props) => props.$size || '20px'};
  font-style: normal;
  font-weight: ${(props) => props.$weight || 600};
  line-height: normal;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`
const CancelButton = styled(Button)`
  width: 200px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #0049c6;
  color: #0049c6;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`
const AuctionButton = styled(Button)`
  width: 200px;
  height: 40px;
  border-radius: 8px;
  background: #0049c6;
`
const DialogStyle = styled(Dialog)`
  width: 480px;

  /* height: 488px; */

  border-radius: 10px;
  border: 1px solid #d4d7e2;
  background: #fff;
  box-shadow: 0 6px 10px 0 rgba(0, 73, 198, 0.1);
  & > div:first-child {
    padding: 25px 28px;
    align-items: flex-start;
    justify-content: flex-start;
    & > div:first-child > div {
      color: #3f5170;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
  }

  & button {
    top: inherit;
    & svg {
      width: 20px;
      height: 20px;
    }
  }
`
const ContainerStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const InfoRound = styled(Row)`
  width: 100%;
  padding: 20px 24px;
  border-radius: 10px;
  background: #f7fafc;
  align-items: center;
`
const InfoImgRound = styled.div`
  position: relative;
  width: 84px;
  height: 84px;
  border-radius: 8px;
  overflow: hidden;
`
const InfoImgText = styled(Typography)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 10px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`
const InfoRight = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const ChainRound = styled.div`
  padding: 4px 12px;
  border-radius: 20px;
  background: #7187d4;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  color: #fff;
`
const ContentStyle = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 11px;
`

const NameInfo = ({ name, expiryDate }: { name: string; expiryDate: Date | undefined }) => {
  return (
    <InfoRound>
      <InfoImgRound>
        <Image src={UserAvatar} style={{ width: '100%', height: '100%' }} />
        <InfoImgText>{name}</InfoImgText>
      </InfoImgRound>
      <InfoRight>
        <Row style={{ width: '100%' }}>
          <InterText $color="#3F5170" ellipsis>
            {name}
          </InterText>
          <ChainRound>Ethereum</ChainRound>
        </Row>
        <InterText $size="14px" $weight={500} $color="#3F5170">
          Expires {expiryDate ? formatDateString(expiryDate) : '--'}
        </InterText>
      </InfoRight>
    </InfoRound>
  )
}

const ADialog = ({
  title,
  okFn,
  okBtnTitle,
  children,
  open,
  handleOpen,
  nameDetails,
}: {
  open: boolean
  children: React.ReactNode
  title: string
  okFn: () => void
  okBtnTitle: string
  handleOpen: (open: boolean) => void
  nameDetails: ReturnType<typeof useNameDetails>
}) => {
  return (
    <>
      <DialogStyle title={title} open={open} variant="closable" onDismiss={() => handleOpen(false)}>
        <ContainerStyle>
          <NameInfo name={nameDetails.normalisedName} expiryDate={nameDetails.expiryDate} />
          <ContentStyle>{children}</ContentStyle>
          <Row style={{ marginTop: 20 }}>
            <CancelButton colorStyle="accentSecondary" onClick={() => handleOpen(false)}>
              Cancel
            </CancelButton>
            <AuctionButton onClick={() => okFn()}>{okBtnTitle}</AuctionButton>
          </Row>
        </ContainerStyle>
      </DialogStyle>
    </>
  )
}

export default ADialog
