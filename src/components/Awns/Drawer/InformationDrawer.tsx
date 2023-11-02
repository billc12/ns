import styled from 'styled-components'

import AttributeLabel, { LabelContainer } from '@app/components/AttributeLabel'
import useGetNftAddress from '@app/hooks/useGetNftAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useRegistrationDate from '@app/hooks/useRegistrationData'

import DrawerModel from '.'

type Props = {
  open: boolean
  onClose: () => void
  accountAddress: string
  name: string
}
const Title = styled.p`
  color: #8d8ea5;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const ContentTitle = styled.p`
  color: #3f5170;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
`
const InformationDrawer = ({ open, onClose, accountAddress, name }: Props) => {
  const nameData = useNameDetails(name)
  const { data: registrationData } = useRegistrationDate(name)
  const { tokenContract, tokenId } = useGetNftAddress(name)
  return (
    <DrawerModel onClose={onClose} open={open} title="Information">
      <LabelContainer>
        <AttributeLabel
          title="ERC6551 Account Address"
          content={{ type: 'address', value: accountAddress }}
          isCopy
        />
        <AttributeLabel
          title="Address"
          content={{ type: 'address', value: nameData.profile?.address || '' }}
          isCopy
        />
        <AttributeLabel
          title="Owner"
          content={{ type: 'address', value: nameData.ownerData?.owner || '' }}
          isCopy
        />
        <AttributeLabel
          title="Registration Date"
          content={{
            type: 'text',
            value: registrationData?.registrationDate.toUTCString() || '',
          }}
        />
        <AttributeLabel
          title="Expiration Date"
          content={{
            type: 'text',
            value: nameData?.expiryDate?.toUTCString() || '',
          }}
        />
        <AttributeLabel
          title="Chain"
          content={{
            type: 'text',
            value: 'Ethereum',
          }}
        />
        <AttributeLabel
          isCopy
          title="Contract Address"
          content={{
            type: 'address',
            value: tokenContract || '',
          }}
        />
        <AttributeLabel
          isCopy
          title="Token ID"
          content={{
            type: 'address',
            value: tokenId || '',
          }}
        />
        <AttributeLabel
          title="Collection"
          content={{
            type: 'text',
            value: 'Loot (for Adventurers)',
          }}
        />
      </LabelContainer>
      <div style={{ marginTop: 15 }}>
        <Title>About</Title>
        <ContentTitle style={{ marginTop: 10 }}>
          Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other
          functionality are intentionally omitted for others to interpret. Feel free to use Loot in
          any way you want.
        </ContentTitle>
      </div>
    </DrawerModel>
  )
}
export default InformationDrawer
