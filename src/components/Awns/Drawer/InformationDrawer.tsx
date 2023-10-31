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
const InformationDrawer = ({ open, onClose, accountAddress, name }: Props) => {
  const nameData = useNameDetails(name)
  const { data: registrationData } = useRegistrationDate(name)
  const { tokenContract } = useGetNftAddress(name)

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
            type: 'text',
            value: '234567' || '',
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
    </DrawerModel>
  )
}
export default InformationDrawer
