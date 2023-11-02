import { useState } from 'react'

import Icon2 from '@app/assets/nameDetail/icon2.svg'
import ReceiveDrawer from '@app/components/Awns/Drawer/ReceiveDrawer'

import { AuctionBtn, AuctionTitle } from '../components/nameInfo'

const Page = ({ accountAddress }: { accountAddress: string }) => {
  const [open, setOpen] = useState(false)
  const handelOpen = (o: boolean) => {
    setOpen(o)
  }
  return (
    <>
      <AuctionBtn prefix={<Icon2 />} onClick={() => handelOpen(true)}>
        <AuctionTitle>Receive</AuctionTitle>
      </AuctionBtn>
      <ReceiveDrawer
        onClose={() => handelOpen(false)}
        open={open}
        accountAddress={accountAddress}
      />
    </>
  )
}
export default Page
