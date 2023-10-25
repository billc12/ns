import QRCode from 'react-qr-code'
import styled from 'styled-components'

import { Dialog, Typography } from '@ensdomains/thorin'

import CodeYellowIcon from '@app/assets/code_yellow.svg'
import { CopyButton } from '@app/components/Copy'

import { TransactionDialogPassthrough } from '../types'

const QRcodeStyle = styled.div`
  width: 100%;
  background: rgba(255, 186, 10, 0.18);
  border-radius: 8px;
  padding: 20px;
  overflow: hidden;
`

const QRcodeText = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #9f8644;
`

const QRcodeWhite = styled.div`
  height: 139px;
  width: 100%;
  background: #fff;
  border-radius: 6px;
  padding: 14px 17px;
  display: grid;
  gap: 10px;
  margin-top: 15px;
`

const AddressStyle = styled.div`
  max-width: 194px;
  height: auto;
  font-size: 16px;
  font-weight: 600;
  line-height: 23px;
  > div {
    display: inline-block;
    svg {
      margin-left: 6px;
    }
  }
`

type Data = {
  address: string | undefined
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

export default function ReceiveAssets({ data: { address } }: Props) {
  console.log('address=>', address)
  return (
    <>
      <Dialog.Heading title="Receive Assets" />

      <QRcodeStyle
        style={{
          height: 220,
          width: '380px',
          transition: 'all 0.5s',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <QRcodeText>Other Token</QRcodeText>
          <QRcodeText
            style={{
              display: 'flex',
              gap: '12px',
              lineHeight: '16px !important',
              fontSize: '14px !important',
            }}
          >
            Show receive address QRcode
            <CodeYellowIcon />
          </QRcodeText>
        </div>
        <QRcodeWhite>
          <Typography
            style={{
              lineHeight: '16px',
              fontSize: '14px',
              color: '#8D8EA5',
            }}
          >
            Only send Ethereum network assets to this address
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <AddressStyle
              style={{
                overflowWrap: 'break-word',
              }}
            >
              {address || '--'}
              <CopyButton value={address || ''} />
            </AddressStyle>

            <QRCode
              style={{
                height: '70px',
                width: '70px',
              }}
              value={address?.toString() || ''}
            />
          </div>
        </QRcodeWhite>
      </QRcodeStyle>
    </>
  )
}
