import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import ArrowRightSvg from '@app/assets/ArrowRightIcon.svg'
import TestImg from '@app/assets/testImage.png'
import BaseLink from '@app/components/@atoms/BaseLink'
import { ReturnedName } from '@app/hooks/names/useNamesFromAddress/useNamesFromAddress'

const AddressItemStyle = styled.div(
  () => css`
    height: 124px;
    width: 100%;
    border-bottom: 1px solid #dce6ed;
    padding: 20px 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)
const StyledImg = styled.img(
  () => css`
    width: 84px;
    height: 84px;
    border-radius: 8px;
  `,
)

const AddressNameStyle = styled(Typography)(
  () => css`
    color: var(--word-color, #3f5170);
    font-size: 20px;
    font-weight: 600;
    display: flex;
    gap: 10px;
  `,
)
const AddressContent = styled.div(
  () => css`
    height: 84px;
    width: auto;
    display: grid;
    align-content: space-between;
  `,
)
const AddressTimeStyle = styled.div(
  () => css`
    color: var(--word-color, #3f5170);
    font-size: 14px;
    font-weight: 500;
  `,
)
const NetworkTagStyle = styled.div(
  () => css`
    display: inline-flex;
    padding: 4px 12px;
    border-radius: 20px;
    background: #7187d4;
    color: #fff;
    font-size: 14px;
    line-height: 17px;
    font-weight: 600;
  `,
)

const ManageButton = styled(Button)(
  () => css`
    width: 111px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--line, #d4d7e2);
    background: #fff;
    color: var(--word-color, #3f5170);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  `,
)

const ArrowRightIcon = styled.svg(
  () => css`
    height: auto !important;
    width: auto !important;
  `,
)

export const AddressItem = ({ AddressRow }: { AddressRow: ReturnedName }) => {
  return (
    <>
      <AddressItemStyle>
        <div style={{ display: 'flex', gap: 20 }}>
          <StyledImg src={TestImg.src} />
          <AddressContent>
            <AddressNameStyle>
              {AddressRow.name}
              <NetworkTagStyle>Ethereum</NetworkTagStyle>
            </AddressNameStyle>
            <AddressTimeStyle>{AddressRow.expiryDate?.toString()}</AddressTimeStyle>
          </AddressContent>
        </div>
        <BaseLink href={`/profile/${AddressRow.name}`}>
          <ManageButton colorStyle="background" suffix={<ArrowRightIcon as={ArrowRightSvg} />}>
            Manage
          </ManageButton>
        </BaseLink>
      </AddressItemStyle>
    </>
  )
}
