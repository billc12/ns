import { isAddress } from '@ethersproject/address'
import styled from 'styled-components'

import { CopyButton } from '@app/components/Copy'
import { shortenAddress } from '@app/utils/utils'

const LabelItem = styled.div<{ $copy?: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: ${({ $copy }) => ($copy ? 'auto auto 14px' : ' auto auto')};
  padding: 12px 36px;
  border-radius: 10px;
  background: #f7fafc;
`
const LabelTitle = styled.p`
  color: #8d8ea5;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`
const LabelValue = styled.p`
  color: #3f5170;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-align: right;
`
export const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
type Props = {
  title: string
  content: string
  isCopy?: boolean
}
const AttributeLabel = ({ title, content, isCopy }: Props) => {
  return (
    <LabelItem $copy={!!isCopy}>
      <LabelTitle>{title}</LabelTitle>
      <LabelValue>{isAddress(content) ? shortenAddress(content) : content}</LabelValue>
      {isCopy && <CopyButton value={content} />}
    </LabelItem>
  )
}
export default AttributeLabel
