import { AuctionBtn, AuctionTitle } from '../components/nameInfo'

const Page = ({ click, disabled }: { click: () => void; disabled?: boolean }) => {
  return (
    <AuctionBtn onClick={() => click()} style={{ border: 'none' }} disabled={disabled}>
      <AuctionTitle>NFT</AuctionTitle>
    </AuctionBtn>
  )
}
export default Page
