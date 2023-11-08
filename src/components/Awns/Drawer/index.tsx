import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import styled from 'styled-components'

import { Button } from '@ensdomains/thorin'

import CloseSvg from '@app/assets/close.svg'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}
const DrawerStyle = styled(Drawer)`
  width: 600px !important;
  padding: 60px 40px;
  border: 1px solid #d4d7e2;
  background: #fff;
  box-shadow: -10px 0 20px 0 rgba(40, 79, 115, 0.25);
  overflow: scroll;
  z-index: 9998;
  &::-webkit-scrollbar {
    display: none;
  }
`
const Header = styled.div`
  display: grid;
  grid-template-columns: auto 24px;
  align-items: center;
  margin-bottom: 30px;
`
const Title = styled.p`
  color: #3f5170;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`
const CloseBtn = styled(Button)`
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: #fff;
`
const Page = ({ children, onClose, open, title }: Props) => {
  return (
    <DrawerStyle lockBackgroundScroll open={open} onClose={onClose} direction="right">
      <Header>
        <Title>{title}</Title>
        <CloseBtn onClick={onClose}>
          <CloseSvg />
        </CloseBtn>
      </Header>
      {children}
    </DrawerStyle>
  )
}
export default Page
