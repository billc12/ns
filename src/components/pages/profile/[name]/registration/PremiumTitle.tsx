import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import useSignName from '@app/hooks/names/useSignName'
import { useNameDetails } from '@app/hooks/useNameDetails'

const Row = styled.div`
  display: flex;
  flex-direction: row;
`
const PremiumText = styled.div`
  text-align: right;
  font-feature-settings: 'clig' off, 'liga' off;

  /* text-shadow: 0px 1px 1px #9f7c00; */

  font-style: normal;
  line-height: normal;
  background: linear-gradient(90deg, #ffc700 0%, #ffdd29 46%, #e49700 80.13%);
  background-clip: text;

  /* stylelint-disable property-no-vendor-prefix */
  -webkit-background-clip: text;
  /* stylelint-enable property-no-vendor-prefix */

  -webkit-text-fill-color: transparent;
`
const HeadName = styled(Row)`
  width: 100%;
  justify-content: space-between;
  padding: 23px 30px;
  border-bottom: 1px solid #dce6ed;
`
export const BigPremiumText = styled(PremiumText)`
  font-size: 24px;
  font-weight: 800;
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
const PremiumTitle = ({ nameDetails }: { nameDetails: ReturnType<typeof useNameDetails> }) => {
  const { beautifiedName, registrationStatus, normalisedName } = nameDetails
  const { data } = useSignName(normalisedName)
  const isPremium = !!data?.isPremium
  return (
    <HeadName>
      {isPremium ? (
        <BigPremiumText>{beautifiedName}</BigPremiumText>
      ) : (
        <InterText>{beautifiedName}</InterText>
      )}

      {registrationStatus && (
        <InterText $color="#21C331" $size="16px">
          Available for registration
        </InterText>
      )}
    </HeadName>
  )
}
export default PremiumTitle
