import { ReactElement } from 'react'
import styled from 'styled-components'

import MyNames from '@app/components/pages/my/names/MyNames'

const ContentStyle = styled.div`
  flex-grow: 1;
  width: 100%;
  max-width: 1440px;

  display: flex;
  justify-content: center;
  align-items: start;
`

export default function Page() {
  return <MyNames />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentStyle>{page}</ContentStyle>
}
