import Icon3 from '@app/assets/nameDetail/icon3.svg'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { AuctionBtn, AuctionTitle } from '../components/nameInfo'

const Page = ({ accountAddress, _name }: { accountAddress: string; _name: string }) => {
  const { prepareDataInput } = useTransactionFlow()
  const showSendTokenInput = prepareDataInput('SendToken')
  const handleSendToken = () => {
    showSendTokenInput(`send-token-${accountAddress}`, {
      address: accountAddress,
      name: _name,
    })
  }
  return (
    <AuctionBtn prefix={<Icon3 />} onClick={() => handleSendToken()}>
      <AuctionTitle>Send</AuctionTitle>
    </AuctionBtn>
  )
}
export default Page
