import styled from 'styled-components'

import DrawerModel from '.'

type Props = {
  open: boolean
  onClose: () => void
  item: any
}
const ImgRound = styled.div`
  width: max-content;
  height: max-content;
  margin: 0 auto;
  padding: 18px;
  border-radius: 10px;
  background: #f8fbff;
  & > img {
    width: 346px;
    height: 346px;
    border-radius: 8px;
  }
`
const Title = styled.p`
  color: #3f5170;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`
const NftDetailDrawer = ({ open, onClose, item }: Props) => {
  return (
    <DrawerModel onClose={onClose} open={open} title="Assets Details">
      <ImgRound>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image_uri} alt="nft img" />
      </ImgRound>
      <Title>
        {item.name || item.contract_name} - #{item.token_id}
      </Title>
    </DrawerModel>
  )
}
export default NftDetailDrawer
