import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import TestImg from '@app/assets/TestImage.png'

const AssetsItemStyle = styled.div`
  width: 162px;
  height: 250px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f7fafc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const LeftStyle = styled.div`
  width: 162px;
  height: 162px;
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
    width: 162px;
    height: 162px;

    border-radius: 8px;
  `,
)

const NameStyle = styled(Typography)`
  color: var(--word-color, #3f5170);
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 142.857% */
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

export function Assets({ NftId }: { NftId: string }) {
  return (
    <AssetsItemStyle>
      <LeftStyle>
        <StyledImg src={TestImg.src} />
      </LeftStyle>
      <RightStyle>
        <div style={{ display: 'grid', gap: '8px' }}>
          <NameStyle ellipsis>NftName # {NftId || '0'}</NameStyle>
          <TagsStyle style={{ background: ErcTag('ERC 721') || '#51C7A3' }}>
            {ERCTYPE.ERC721}
          </TagsStyle>
        </div>

        {false && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <AssetsCountStyle>Assets</AssetsCountStyle>
            <NameStyle>$50.22</NameStyle>
          </div>
        )}
      </RightStyle>
    </AssetsItemStyle>
  )
}
