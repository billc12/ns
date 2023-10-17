import styled from 'styled-components'

import { Button, Tooltip } from '@ensdomains/thorin'

import AddRoundSVG from '@app/assets/add-round.svg'
import DelRoundSVG from '@app/assets/del-round.svg'
import ToolTipSvg from '@app/assets/tooltip.svg'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { TInvitationName } from '@app/transaction-flow/input/InvitationName-flow'

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  &.content {
    width: max-content;
    gap: 5px;
  }
`
const ToolTipRound = styled.div`
  padding: 8px 10px;
  border-radius: 6px;
  background: #f8fbff;
  color: #8d8ea5;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
`
const Label = styled.p`
  color: #8d8ea5;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const NameLabel = styled.p`
  color: #3f5170;
  text-align: right;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  max-width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
const SvgBtn = styled.button`
  width: 16px;
  height: 16px;
  cursor: pointer;
`
const InvitationNameLabel = ({ info, setNameCallback }: TInvitationName) => {
  const name = info.invitationName
  const { prepareDataInput } = useTransactionFlow()
  const showInvitationNameInput = prepareDataInput('InvitationName')
  const handleDiscountCode = () => {
    showInvitationNameInput(`discount-code-${name}`, { info, setNameCallback })
  }
  const cleanName = () => {
    setNameCallback({ ...info, invitationName: '' })
  }
  const auctionBtn = name ? <DelRoundSVG /> : <AddRoundSVG />
  const handleAuctionFn = name ? cleanName : handleDiscountCode
  return (
    <Row>
      <Row className="content">
        <Label>Invitation AWNS</Label>
        <Tooltip
          placement="right"
          content={
            <ToolTipRound>
              The beta phase requires an invitation code to register, and you will receive 3
              invitations for successfully registering an AW domain name.
            </ToolTipRound>
          }
          mobilePlacement="right"
          mobileWidth={50}
          width={325}
        >
          <Button
            style={{
              width: 'max-content',
              height: 'max-content',
              padding: 0,
              border: 'none',
              background: 'transparent',
            }}
          >
            <ToolTipSvg />
          </Button>
        </Tooltip>
      </Row>
      <Row className="content">
        <NameLabel>{name}</NameLabel>
        <SvgBtn onClick={handleAuctionFn}>{auctionBtn}</SvgBtn>
      </Row>
    </Row>
  )
}
export default InvitationNameLabel
