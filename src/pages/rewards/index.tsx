import { ReactElement } from 'react'
import styled from 'styled-components'

import Rewards from './referralReawrds'

const ContentStyle = styled.div`
  flex-grow: 1;
  width: 100%;
  max-width: 975px;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

export default function Page() {
  return <Rewards />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentStyle>{page}</ContentStyle>
}
