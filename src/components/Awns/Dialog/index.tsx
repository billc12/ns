import styled, { css } from 'styled-components'
import { useNetwork } from 'wagmi'

import { Button, Dialog, Typography, mq } from '@ensdomains/thorin'

import UserAvatar from '@app/assets/TestImage.png'
import { useEthInvoice } from '@app/components/pages/profile/[name]/registration/steps/Awns_Complete'
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
  ${mq.sm.max(css`
    width: auto;
    text-align: left;
  `)}
`
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  ${mq.sm.max(css`
    display: grid;
    width: 100%;
    gap: 10px;
  `)}
`
export const BackButton = styled(Button)`
  border: 1px solid #0049c6;
  background: #fff;
  color: #0049c6;
  height: 40px;
  &:hover {
    background: #fff;
  }
`
export const NextButton = styled(Button)`
  height: 40px;
  background: #0049c6;
  color: #fff;
  &:hover {
    background: #0049c6;
  }
  &:disabled:hover {
    background: #e5e5e5;
  }
`

export const DialogStyle = styled(Dialog)`
  min-width: 480px;
  border-radius: 10px;
  border: 1px solid #d4d7e2;
  background: #fff;
  box-shadow: 0 6px 10px 0 rgba(0, 73, 198, 0.1);
  justify-content: center;
  & > div:first-child {
    width: max-content;
    padding: 25px 28px;
    align-items: flex-start;
    justify-content: flex-start;
    ${mq.sm.max(css`
      width: 100%;
    `)}
    & > div:first-child > div {
      color: #3f5170;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
    & > div:nth-child(2) > div {
      color: #3f5170;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
  }

  & > div > button {
    top: 13px;
    right: 13px;
    width: 24px;
    height: 24px;
  }
  ${mq.sm.max(css`
    width: 100%;
  `)}
`
export const ContainerStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const InfoRound = styled.div`
  width: 100%;
  padding: 20px 24px;
  border-radius: 10px;
  background: #f7fafc;
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 24px;
  ${mq.sm.max(css`
    display: grid;
    gap: 10px;
  `)}
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
  flex: 1;
  height: 84px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${mq.sm.max(css`
    gap: 10px;
    text-align: left;
  `)}
`
const FlexRow = styled.div`
  display: flex;
  gap: 10px;
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
  max-width: 90px;
`
export const ContentStyle = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 11px;
`

export const NameInfo = ({ name, expiryDate }: { name: string; expiryDate: Date | undefined }) => {
  const { chain } = useNetwork()
  const { avatarSrc } = useEthInvoice(name, false)
  return (
    <InfoRound>
      <InfoImgRound>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarSrc || UserAvatar.src}
          style={{ width: '100%', height: '100%' }}
          alt="User Avatar"
        />
        <InfoImgText>{name}</InfoImgText>
      </InfoImgRound>
      <InfoRight>
        <FlexRow>
          <InterText style={{ maxWidth: '180px' }} $color="#3F5170" ellipsis>
            {name}
          </InterText>
          <ChainRound>{chain?.name || 'Ethereum'}</ChainRound>
        </FlexRow>

        {expiryDate && (
          <InterText $size="14px" $weight={500} $color="#3F5170">
            Expires at {formatDateString(expiryDate)}
          </InterText>
        )}
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
          <Row style={{ marginTop: 20, width: '100%' }}>
            <BackButton colorStyle="accentSecondary" onClick={() => handleOpen(false)}>
              Cancel
            </BackButton>
            <NextButton onClick={() => okFn()}>{okBtnTitle}</NextButton>
          </Row>
        </ContainerStyle>
      </DialogStyle>
    </>
  )
}

export default ADialog
