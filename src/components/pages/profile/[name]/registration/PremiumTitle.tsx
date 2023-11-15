import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import PremiumSvg from '@app/assets/premium-icon.svg'
import useSignName from '@app/hooks/names/useSignName'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { shortenAddress } from '@app/utils/utils'

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
  align-items: center;
`
export const BigPremiumText = styled(PremiumText)`
  font-size: 24px;
  font-weight: 800;
  text-align: left;
  max-width: 70%;
  word-wrap: break-word;
  ${mq.sm.max(css`
    font-size: 18px;
    max-width: 60vw;
    word-wrap: break-word;
  `)}
`
const InterText = styled(Typography)<{ $size?: string; $color?: string; $weight?: number }>`
  width: max-content;
  height: max-content;
  color: ${(props) => props.$color || '#3F5170'};
  font-size: ${(props) => props.$size || '24px'};
  font-style: normal;
  font-weight: ${(props) => props.$weight || 600};
  line-height: normal;
  max-width: 70%;
  word-wrap: break-word;
`
const PremiumTitle = ({ nameDetails }: { nameDetails: ReturnType<typeof useNameDetails> }) => {
  const { beautifiedName, registrationStatus, normalisedName } = nameDetails
  const { data } = useSignName({ name: normalisedName })
  const isPremium = !!data?.premium
  const shortName = useMemo(() => {
    return beautifiedName.length > 40 ? shortenAddress(beautifiedName, 40, 15, 15) : beautifiedName
  }, [beautifiedName])
  return (
    <HeadName>
      {isPremium ? (
        <div style={{ display: 'flex', flex: 1, gap: 8 }}>
          <PremiumSvg />
          <BigPremiumText>{shortName}</BigPremiumText>
        </div>
      ) : (
        <InterText>{shortName}</InterText>
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
