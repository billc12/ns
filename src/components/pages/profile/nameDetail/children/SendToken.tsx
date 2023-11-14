import { AuctionBtn, AuctionTitle } from '../components/nameInfo'

const Page = ({ click, disabled }: { click: () => void; disabled?: boolean }) => {
  return (
    <AuctionBtn style={{ border: 'none' }} onClick={click} disabled={disabled}>
      <AuctionTitle>ERC20</AuctionTitle>
    </AuctionBtn>
  )
}
export default Page
