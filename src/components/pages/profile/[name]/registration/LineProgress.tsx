import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

const Center = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
`
const InterText = styled(Typography)<{ $size?: string; $color?: string; $weight?: number }>`
  width: max-content;
  height: max-content;
  color: ${(props) => props.$color || '#3F5170'};
  font-size: ${(props) => props.$size || '24px'};
  font-style: normal;
  font-weight: ${(props) => props.$weight || 600};
  line-height: normal;
  white-space: pre-wrap;
`
const RoundBox = styled(Center)<{ $select: boolean }>`
  width: 30px;
  height: 30px;
  background: ${(props) => (props.$select ? '#0049C6' : '#fff')};
  border: 1px solid #0049c6;
  border-radius: 50%;
`
const Line = styled.div`
  width: 234px;
  height: 1px;
  border: 1px dashed #0049c6;
`
const Round = ({ num, isSelect }: { num: number; isSelect: boolean }) => {
  return (
    <RoundBox $select={isSelect}>
      <InterText $size="16px" $weight={500} $color={isSelect ? '#fff' : '#0049C6'}>
        {num}
      </InterText>
    </RoundBox>
  )
}

const LENGTH = 3
const LineProgress = ({ curSelect }: { curSelect: number }) => {
  const progressArr = Array.from({ length: LENGTH }, (item, index) =>
    index + 1 !== LENGTH ? (
      <>
        <Round key={`Round-${index}`} num={index + 1} isSelect={curSelect >= index + 1} />
        <Line key={`line-${index}`} />
      </>
    ) : (
      <Round key={`Round-${index}`} num={index + 1} isSelect={curSelect >= index + 1} />
    ),
  )
  return <Center>{progressArr}</Center>
}
export default LineProgress
