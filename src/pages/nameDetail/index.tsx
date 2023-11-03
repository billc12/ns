import { ReactElement } from 'react'
import styled from 'styled-components'

import NameContent from '@app/components/pages/profile/nameDetail/NameContent'

const ContentStyle = styled.div`
  flex-grow: 1;
  width: 100%;
  max-width: 1440px;

  display: flex;
  justify-content: center;
  padding: 0 60px;
`

export default function Page() {
  return <NameContent />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentStyle>{page}</ContentStyle>
}
