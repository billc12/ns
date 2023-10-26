// import Icon3 from '@app/assets/nameDetail/icon3.svg'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { AuctionBtn, AuctionTitle } from '../components/nameInfo'

const Page = ({ accountAddress, _name }: { accountAddress: string; _name: string }) => {
  const { prepareDataInput } = useTransactionFlow()

  const showSendNFTInput = prepareDataInput('SendNFT')

  const handleSendNFT = () => {
    showSendNFTInput(`send-NFT-${accountAddress}`, {
      address: accountAddress,
      name: _name,
    })
  }
  return (
    <AuctionBtn onClick={() => handleSendNFT()} style={{ border: 'none' }}>
      <AuctionTitle>NFT</AuctionTitle>
    </AuctionBtn>
  )
}
export default Page
