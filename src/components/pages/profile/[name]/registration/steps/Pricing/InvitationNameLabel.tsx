import styled from 'styled-components'

import { Button, Tooltip } from '@ensdomains/thorin'

import ToolTipSvg from '@app/assets/tooltip.svg'
import { TInvitationName } from '@app/transaction-flow/input/InvitationName-flow'

import InvitationName from './InvitationName'

const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  &.content {
    width: max-content;
    gap: 5px;
  }
  &.round {
    display: grid;
    grid-template-columns: 130px auto;
    margin-top: 16px;
    padding: 15px 20px;
    background: #f7fafc;
    align-items: center;
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

const InvitationNameLabel = ({ name, setNameCallback }: TInvitationName) => {
  return (
    <Row className="round">
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
      <InvitationName name={name} setNameCallback={setNameCallback} />
    </Row>
  )
}
export default InvitationNameLabel
