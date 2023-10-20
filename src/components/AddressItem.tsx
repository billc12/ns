import styled, { css } from 'styled-components'
import { useNetwork } from 'wagmi'

import { Button, Typography, mq } from '@ensdomains/thorin'

import ArrowRightSvg from '@app/assets/ArrowRightIcon.svg'
import TestImg from '@app/assets/TestImage.png'
import BaseLink from '@app/components/@atoms/BaseLink'
import { ReturnedName } from '@app/hooks/names/useNamesFromAddress/useNamesFromAddress'
import { formatFullExpiry } from '@app/utils/utils'

import { useEthInvoice } from './pages/profile/[name]/registration/steps/Awns_Complete'

const AddressItemStyle = styled.div(
  () => css`
    height: auto;
    min-height: 124px;
    width: 100%;
    border-bottom: 1px solid #dce6ed;
    padding: 20px 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${mq.sm.max(css`
      padding: 10px;
    `)}
  `,
)

const ContentStyle = styled.div`
  display: flex;
  gap: 20px;
  ${mq.sm.max(css`
    gap: 10px;
  `)}
`

const StyledImg = styled.img(
  () => css`
    width: 84px;
    height: 84px;
    border-radius: 8px;
  `,
)

const AddressNameStyle = styled(Typography)(
  () => css`
    display: flex;
    gap: 10px;
    ${mq.sm.max(css`
      display: grid;
      gap: 6px;
    `)}
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
    ${mq.sm.max(css`
      font-size: 13px;
      padding-top: 5px;
    `)}
  `,
)
const NetworkTagStyle = styled.div(
  () => css`
    max-width: 90px;
    padding: 4px 12px;
    border-radius: 20px;
    background: #7187d4;
    color: #fff;
    font-size: 14px;
    line-height: 17px;
    font-weight: 600;
    text-align: center;
    height: 25px;
    ${mq.sm.max(css`
      font-size: 13px;
      padding: 3px 5px;
      max-width: 80px;
    `)}
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
    ${mq.sm.max(css`
      width: auto;
      height: 36px;
      padding: 0 5px;
      gap: 5px;
      font-size: 13px;
    `)}
  `,
)

const ArrowRightIcon = styled.svg(
  () => css`
    height: auto !important;
    width: auto !important;
  `,
)

export const AddressItem = ({ AddressRow }: { AddressRow: ReturnedName }) => {
  const { chain } = useNetwork()
  const { avatarSrc } = useEthInvoice(AddressRow.name, false)
  return (
    <>
      <AddressItemStyle>
        <ContentStyle>
          <StyledImg src={avatarSrc || TestImg.src} />
          <AddressContent>
            <AddressNameStyle>
              <Typography
                style={{
                  width: 'auto',
                  maxWidth: '350px',
                  color: ' var(--word-color, #3f5170)',
                  fontSize: '20px',
                  fontWeight: '600',
                }}
                ellipsis
              >
                {AddressRow.name}
              </Typography>

              <NetworkTagStyle>{chain?.name || 'Ethereum'} </NetworkTagStyle>
            </AddressNameStyle>
            <AddressTimeStyle>
              {/* {AddressRow.expiryDate?.toString()} */}
              {AddressRow?.expiryDate ? formatFullExpiry(AddressRow?.expiryDate) : '--'}
            </AddressTimeStyle>
          </AddressContent>
        </ContentStyle>
        <BaseLink href={`/profile/${AddressRow.name}`}>
          <ManageButton colorStyle="background" suffix={<ArrowRightIcon as={ArrowRightSvg} />}>
            Manage
          </ManageButton>
        </BaseLink>
      </AddressItemStyle>
    </>
  )
}
