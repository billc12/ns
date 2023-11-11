import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Input, Skeleton, mq } from '@ensdomains/thorin'

import { useBasicName } from '@app/hooks/useBasicName'

export type TInvitationName = {
  setNameCallback: (v: string) => void
  name: string
}
export type Props = TInvitationName

const CodeInput = styled(Input)`
  width: 100%;
  border-radius: 6px;
  background: #fff;
  color: #d4d7e2;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  &:focus-within {
    border: 1px solid #97b7ef;
    color: #3f5170;
  }
`
const Container = styled.div`
  width: 179px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${mq.sm.max(css`
    width: 100%;
  `)}
  &>div:first-child {
    height: 32px;
  }
`

const ErrTip = styled.p`
  color: #f00;

  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150.5%;
`
const InvitationName = ({ setNameCallback, name }: Props) => {
  const [nameInp, setNameInp] = useState(name ? `${name}.aw` : '')
  const { registrationStatus, isLoading } = useBasicName(`${nameInp.trim().split('.')[0]}.aw`)
  const isUse = registrationStatus === 'registered'
  const saveName = () => {
    if (isUse || !nameInp) {
      setNameCallback(nameInp.split('.')[0])
    }
  }
  return (
    <>
      <Container>
        <CodeInput
          hideLabel
          label
          placeholder="Enter AWNS"
          value={nameInp}
          onChange={(e) => setNameInp(e.target.value)}
          onBlur={saveName}
        />
      </Container>
      {nameInp && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            width: '100%',
            gridColumn: '1/3',
            marginTop: 5,
          }}
        >
          <Skeleton loading={isLoading} style={{ minWidth: 220, height: 20 }}>
            {!isUse && registrationStatus && <ErrTip>The AWNS name is invalid</ErrTip>}
          </Skeleton>
        </div>
      )}
    </>
  )
}
export default InvitationName
