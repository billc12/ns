import Icon2 from '@app/assets/nameDetail/icon2.svg'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { AuctionBtn, AuctionTitle } from '../components/nameInfo'

const Page = ({ accountAddress }: { accountAddress: string }) => {
  const { prepareDataInput } = useTransactionFlow()
  const showReceiveInput = prepareDataInput('ReceiveAssets')
  const handleReceive = () => {
    showReceiveInput(`receive-token`, {
      address: accountAddress,
    })
  }
  return (
    <AuctionBtn prefix={<Icon2 />} onClick={() => handleReceive()}>
      <AuctionTitle>Receive</AuctionTitle>
    </AuctionBtn>
  )
}
export default Page
