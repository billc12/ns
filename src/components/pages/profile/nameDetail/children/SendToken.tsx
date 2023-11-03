import { AuctionBtn, AuctionTitle } from '../components/nameInfo'

const Page = ({ click }: { click: () => void }) => {
  return (
    <AuctionBtn style={{ border: 'none' }} onClick={click}>
      <AuctionTitle>Fungible Token</AuctionTitle>
    </AuctionBtn>
  )
}
export default Page
