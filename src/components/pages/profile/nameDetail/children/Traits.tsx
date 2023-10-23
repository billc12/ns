import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import TestImg from '@app/assets/TestImage.png'
import CheckIcon from '@app/assets/check-whiteIcon.svg'

const TraitsItemStyle = styled.div`
  width: 164px;
  height: 250px;
  border-radius: 10px;
  background: #f7fafc;
  overflow: hidden;
`

const TopStyle = styled.div`
  width: 162px;
  height: 162px;
  display: flex;
  justify-content: end;
  align-items: end;
  padding: 6px;
  background-image: url(${TestImg.src});
  background-size: 162px 162px;
`
const ContentStyle = styled.div`
  padding: 8px 6px 11px 9px;
  display: grid;
  gap: 8px;
`

const NameStyle = styled(Typography)`
  color: var(--word-color, #3f5170);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`

const TagsStyle = styled.div`
  width: 80px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid #fff;
  background: var(--green, #21c331);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px 7px 12px;
  color: #fff;
  font-family: Inter;
  font-size: 14px;
  font-weight: 700;
`

const SubTitleStyle = styled(Typography)`
  color: var(--tile-grey, #80829f);
  font-family: Inter;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
`

const TypeStyle = styled(Typography)`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
`

export function Traits() {
  return (
    <TraitsItemStyle>
      <TopStyle>
        <TagsStyle>
          Wear
          <CheckIcon />
        </TagsStyle>
      </TopStyle>
      <ContentStyle>
        <NameStyle ellipsis>Hajksdkjqhwjkd laksjdklasjkl</NameStyle>
        <div>
          <SubTitleStyle>Chest Armor</SubTitleStyle>
          <TypeStyle>Ring Mail</TypeStyle>
        </div>
      </ContentStyle>
    </TraitsItemStyle>
  )
}
