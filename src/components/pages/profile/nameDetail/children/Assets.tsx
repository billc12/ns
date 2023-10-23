import styled, { css } from 'styled-components'

import TestImg from '@app/assets/TestImage.png'

const AssetsItemStyle = styled.div`
  width: 346px;
  height: 134px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f7fafc;
  display: flex;
`

const LeftStyle = styled.div`
  padding: 7px;
  padding-right: 0;
`
const RightStyle = styled.div`
  padding: 18px 0 18px 25px;
  display: grid;
  gap: 22px;
`
const StyledImg = styled.img(
  () => css`
    width: 120px;
    height: 120px;
    border-radius: 8px;
  `,
)

const NameStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 18px;
  font-weight: 700;
`

const TagsStyle = styled.div`
  width: 100px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 4px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
`

const AssetsCountStyle = styled.div`
  color: var(--tile-grey, #80829f);
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
`

export enum ERCTYPE {
  ERC6551 = 'ERC 6551',
  ERC721 = 'ERC 721',
  ERC1155 = 'ERC 1155',
}

function ErcTag(tag: string) {
  if (ERCTYPE.ERC1155 === tag) {
    return '#51C7A3'
  }
  if (ERCTYPE.ERC721 === tag) {
    return '#497DE3'
  }
  if (ERCTYPE.ERC1155 === tag) {
    return '#F4AE44'
  }
}

export function Assets() {
  return (
    <AssetsItemStyle>
      <LeftStyle>
        <StyledImg src={TestImg.src} />
      </LeftStyle>
      <RightStyle>
        <div style={{ display: 'grid', gap: '8px' }}>
          <NameStyle>Bag # rows</NameStyle>
          <TagsStyle style={{ background: ErcTag('ERCTYPE') || '#51C7A3' }}>
            {ERCTYPE.ERC1155}
          </TagsStyle>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <AssetsCountStyle>Assets</AssetsCountStyle>
          <NameStyle>$50.22</NameStyle>
        </div>
      </RightStyle>
    </AssetsItemStyle>
  )
}
