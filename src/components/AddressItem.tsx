import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import TestImg from '@app/assets/TestImage.png'
import { ReturnedName } from '@app/hooks/names/useNamesFromAddress/useNamesFromAddress'

import BaseLink from './@atoms/BaseLink'

const AddressItemStyle = styled.div(
  () => css`
    width: 212px;
    height: 250px;
    border-radius: 10px;
    border: 1px solid var(--line, #d4d7e2);
    background: var(--light-bg, #f8fbff);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    ${mq.sm.max(css`
      padding: 10px;
      width: 168px;
      height: 200px;
    `)}
  `,
)

const BottomStyle = styled.div`
  height: 40px;
  width: 100%;
  bottom: 0;
  left: 0;
  position: absolute;
  display: flex;
  align-items: center;
  padding: 10px 40px 10px 15px;
  border-radius: 0 0 10px 10px;
  background: var(--light-bg, #f8fbff);
`

export const AddressItem = ({ AddressRow }: { AddressRow: ReturnedName }) => {
  console.log('AddressRow=>', AddressRow)

  return (
    <>
      <BaseLink href={`/profile/${AddressRow.name}`}>
        <AddressItemStyle
          style={{
            background: `url(${TestImg.src})`,
            backgroundSize: '100% 100%',
          }}
          onClick={() => {
            console.log(1)
          }}
        >
          <BottomStyle>
            <Typography ellipsis>{AddressRow.name || '--'}</Typography>
          </BottomStyle>
        </AddressItemStyle>
      </BaseLink>
    </>
  )
}
