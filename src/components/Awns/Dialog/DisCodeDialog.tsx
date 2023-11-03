import styled from 'styled-components'

import { DialogStyle } from '.'
import { CodeInput } from '../DisCodeLabel'

interface Props {
  code: string
  discount: string
  date: string
  type: string
  open: boolean
  close: () => void
}
const Round = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 380px;
  height: 141px;
  border-radius: 10px;
  background: #f7fafc;
  padding: 20px 24px;
`
const LabelStyle = styled.div`
  display: flex;
  justify-content: space-between;
`
const LabelTitle = styled.p`
  color: #80829f;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const ContentTitle = styled.p`
  color: #3f5170;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`

const Label = ({ title, content }: { title: string; content: string }) => {
  return (
    <LabelStyle>
      <LabelTitle>{title}</LabelTitle>
      <ContentTitle>{content}</ContentTitle>
    </LabelStyle>
  )
}
const Page = ({ code, date, discount, type, open, close }: Props) => {
  return (
    <DialogStyle title="Discount Code" open={open} onDismiss={close} variant="closable">
      <CodeInput value={code} label="" disabled readOnly />
      <Round>
        <Label title="Discount" content={discount} />
        <Label title="Availability date" content={date} />
        <Label title="Type" content={type} />
      </Round>
    </DialogStyle>
  )
}

export default Page
