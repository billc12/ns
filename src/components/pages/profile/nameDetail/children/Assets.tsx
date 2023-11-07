import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import Img1 from '@app/assets/nameDetail/img1.png'
import { ShowErrImg } from '@app/components/showErrImg'

const AssetsItemStyle = styled.div`
  position: relative;
  width: 162px;
  height: 250px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f7fafc;
  display: flex;
  flex-direction: column;
`

const LeftStyle = styled.div`
  padding-right: 0;
  & > img,
  & {
    width: 162px;
    height: 162px;
  }
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
const StyledImg = styled(ShowErrImg)`
  width: 162px;
  height: 162px;
  border-radius: 8px;
`

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
export enum ERCTYPE {
  ERC6551 = 'ERC 6551',
  ERC721 = 'ERC 721',
  ERC1155 = 'ERC 1155',
}

function ErcTag(tag: string) {
  if (tag === 'erc6551') {
    return '#51C7A3'
  }
  if (tag === 'erc721') {
    return '#497DE3'
  }
  if (tag === 'erc1155') {
    return '#F4AE44'
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Assets({ item, onClick }: { item: any; onClick?: () => void }) {
  return (
    <AssetsItemStyle onClick={onClick}>
      {Number(item.amount) > 1 && <RoundOrange>{item.amount}</RoundOrange>}
      <LeftStyle>
        <StyledImg url={item.image_uri} defaultUrl={Img1.src} />
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
          {item.erc_type === 'erc721'
            ? ERCTYPE.ERC721
            : item.erc_type === 'erc1155'
            ? ERCTYPE.ERC1155
            : ERCTYPE.ERC6551}
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
