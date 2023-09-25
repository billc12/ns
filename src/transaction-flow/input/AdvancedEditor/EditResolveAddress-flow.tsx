import { useMemo } from 'react'

import {
  AuctionButton,
  CancelButton,
  ContainerStyle,
  ContentStyle,
  NameInfo,
  Row,
} from '@app/components/Awns/Dialog'
import LabelInput from '@app/components/Awns/LabelInput'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

type AddressRecord = {
  key: string
  coin: string
  addr: string
}
type Data = {
  name: string
}
export type Props = {
  data?: Data
  onDismiss?: () => void
} & TransactionDialogPassthrough
const EditResolveAddress = ({ data, onDismiss }: Props) => {
  const nameDetails = useNameDetails(data?.name || '')
  const { normalisedName, expiryDate, profile } = nameDetails
  const addressArr = useMemo(() => {
    const address: AddressRecord[] = (profile?.records?.coinTypes as any[]) || []
    return address.filter(({ addr }) => addr)
  }, [profile?.records?.coinTypes])
  const submitHandle = () => {}

  return (
    <ContainerStyle>
      <NameInfo name={normalisedName} expiryDate={expiryDate} />
      <ContentStyle>
        {addressArr.map(({ addr }) => (
          <LabelInput
            value={addr}
            label="To address / domain"
            onChange={() => console.log('eeee')}
          />
        ))}
      </ContentStyle>
      <Row style={{ marginTop: 20 }}>
        <CancelButton colorStyle="accentSecondary" onClick={onDismiss}>
          Cancel
        </CancelButton>
        <AuctionButton onClick={submitHandle}>Save</AuctionButton>
      </Row>
    </ContainerStyle>
  )
}
export default EditResolveAddress
