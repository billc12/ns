import { AuctionBtn, AuctionTitle } from '../components/nameInfo'

const Page = ({ click }: { click: () => void }) => {
  return (
    <AuctionBtn onClick={() => click()} style={{ border: 'none' }}>
      <AuctionTitle>NFT</AuctionTitle>
    </AuctionBtn>
  )
}
export default Page
