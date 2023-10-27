import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import TestImg from '@app/assets/TestImage.png'
import CheckIcon from '@app/assets/check-whiteIcon.svg'
import Img2 from '@app/assets/nameDetail/img2.png'
import Img3 from '@app/assets/nameDetail/img3.png'
import Img4 from '@app/assets/nameDetail/img4.png'
import Img5 from '@app/assets/nameDetail/img5.png'

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
  padding-left: 10px;
  padding-top: 8px;
  padding-bottom: 15px;
  display: grid;
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
  position: absolute;
  right: 6px;
  bottom: 6px;
`

const SubTitleStyle = styled(Typography)`
  color: var(--tile-grey, #80829f);
  font-family: Inter;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
`

const TypeStyle = styled(Typography)`
  width: max-content;
  height: max-content;
  padding: 5px 18px;
  flex-shrink: 0;
  border-radius: 4px;
  background: #497de3;
  color: #fff;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: center;
`
const RoundGold = styled.div`
  position: absolute;
  bottom: 47px;
  right: 37px;
  width: 30px;
  height: 30px;
  background: url(${Img5.src});
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  line-height: 28px;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.9px;
`
const RoundOrange = styled.div`
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 6px;
  background: #f4ae44;
  color: #fff;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  line-height: 30px;
  position: absolute;
  left: 15px;
  top: 15px;
`
const AmountRoundGold = (v: number) => {
  return <RoundGold>{v}x</RoundGold>
}
export function Traits() {
  return (
    <>
      <TraitsItemStyle>
        {/* <TopStyle> */}
        <div style={{ width: 162, height: 162, background: '#000', position: 'relative' }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
          <img
            src={Img2.src}
            alt="default img"
            style={{
              width: 75,
              height: 75,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          />
          <TagsStyle>
            Wear
            <CheckIcon />
          </TagsStyle>
          {AmountRoundGold(4)}
        </div>

        {/* </TopStyle> */}
        <ContentStyle>
          <NameStyle ellipsis>Aspiration of God</NameStyle>
          <div>
            <SubTitleStyle>Amulet</SubTitleStyle>
            <TypeStyle>ERC 721</TypeStyle>
          </div>
        </ContentStyle>
      </TraitsItemStyle>
      <TraitsItemStyle>
        {/* <TopStyle> */}
        <div style={{ width: 162, height: 162, background: '#000', position: 'relative' }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
          <img
            src={Img2.src}
            alt="default img"
            style={{
              width: 75,
              height: 75,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          />
          <TagsStyle>
            Wear
            <CheckIcon />
          </TagsStyle>
          {AmountRoundGold(2)}
        </div>

        {/* </TopStyle> */}
        <ContentStyle>
          <NameStyle ellipsis>Aspiration of God</NameStyle>
          <div>
            <SubTitleStyle>Amulet</SubTitleStyle>
            <TypeStyle>ERC 721</TypeStyle>
          </div>
        </ContentStyle>
      </TraitsItemStyle>
      <TraitsItemStyle>
        {/* <TopStyle> */}
        <div style={{ width: 162, height: 162, background: '#000', position: 'relative' }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
          <img
            src={Img3.src}
            alt="default img"
            style={{
              width: 75,
              height: 75,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          />
          <TagsStyle>
            Wear
            <CheckIcon />
          </TagsStyle>
        </div>

        {/* </TopStyle> */}
        <ContentStyle>
          <NameStyle ellipsis>The Immortal Pendant</NameStyle>
          <div>
            <SubTitleStyle>Ornament</SubTitleStyle>
            <TypeStyle>ERC 721</TypeStyle>
          </div>
        </ContentStyle>
      </TraitsItemStyle>
      <TraitsItemStyle>
        {/* <TopStyle> */}
        <div style={{ width: 162, height: 162, background: '#000', position: 'relative' }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
          <img
            src={Img4.src}
            alt="default img"
            style={{
              width: 75,
              height: 75,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          />
          <TagsStyle>
            Wear
            <CheckIcon />
          </TagsStyle>
          <RoundOrange>x2</RoundOrange>
        </div>

        {/* </TopStyle> */}
        <ContentStyle>
          <NameStyle ellipsis>The Cursed Staff</NameStyle>
          <div>
            <SubTitleStyle>Ornament</SubTitleStyle>
            <TypeStyle style={{ background: '#F4AE44' }}>ERC 1155</TypeStyle>
          </div>
        </ContentStyle>
      </TraitsItemStyle>
    </>
  )
}
export function Traits2() {
  return (
    <TraitsItemStyle>
      <TopStyle>
        {/* <TagsStyle>
          Wear
          <CheckIcon />
        </TagsStyle> */}
      </TopStyle>
      <ContentStyle
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <NameStyle ellipsis>Kubz #3789</NameStyle>
        <div>
          <TypeStyle>ERC 721</TypeStyle>
        </div>
      </ContentStyle>
    </TraitsItemStyle>
  )
}
