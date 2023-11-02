import QRCode from 'react-qr-code'
import styled from 'styled-components'

import { CopyButton } from '@app/components/Copy'

import DrawerModel from '.'

const Container = styled.div`
  display: flex;
  max-width: 394px;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`
const Title1 = styled.p`
  color: #3f5170;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 125% */
`
const Title2 = styled.p`
  color: #3f5170;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 2px;
`
const Round = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 26px;
  border-radius: 10px;
  background: #f8fbff;
`
const Page = ({
  open,
  onClose,
  accountAddress,
}: {
  open: boolean
  onClose: () => void
  accountAddress: string
}) => {
  return (
    <DrawerModel onClose={onClose} open={open} title="Receive Assets">
      <Container>
        <Title1>Only send Ethereum network assets to this address</Title1>
        <QRCode
          style={{
            height: '350px',
            width: '350px',
            padding: 18,
            background: '#F8FBFF',
            borderRadius: 10,
          }}
          value={accountAddress?.toString() || ''}
        />
        <Round>
          <Title2 style={{ maxWidth: 264, wordWrap: 'break-word' }}>{accountAddress}</Title2>
          <CopyButton value={accountAddress} />
        </Round>
      </Container>
    </DrawerModel>
  )
}
export default Page
