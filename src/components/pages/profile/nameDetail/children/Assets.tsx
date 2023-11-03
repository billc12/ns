import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import Img1 from '@app/assets/nameDetail/img1.png'

const AssetsItemStyle = styled.div`
  width: 162px;
  height: 250px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f7fafc;
  display: flex;
  flex-direction: column;
`

const LeftStyle = styled.div`
  width: 162px;
  height: 162px;
  padding-right: 0;
`
const RightStyle = styled.div`
  padding-left: 10px;
  padding-top: 8px;
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Assets({ item }: { item: any }) {
  return (
    <AssetsItemStyle>
      <LeftStyle>
        <StyledImg src={item.image_uri || Img1.src} />
      </LeftStyle>
      <RightStyle>
        <NameStyle ellipsis>
          {item.name || item.contract_name} - #{item.token_id}
        </NameStyle>

        <TagsStyle
          style={{
            background: ErcTag(item.erc_type) || '#51C7A3',
          }}
        >
          {item.erc_type === 'erc721' ? ERCTYPE.ERC721 : ERCTYPE.ERC6551}
        </TagsStyle>
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
