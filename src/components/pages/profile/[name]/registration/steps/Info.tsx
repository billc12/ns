import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Heading, Typography, mq } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { InterText } from '@app/components/Awns_Header'
import { Card } from '@app/components/Card'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { useNameDetails } from '@app/hooks/useNameDetails'

import FullInvoice from '../FullInvoice'
import LineProgress from '../LineProgress'
import PremiumTitle from '../PremiumTitle'
import { RegistrationReducerDataItem } from '../types'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 840px;
    margin: 0 auto;
    flex-direction: column;
    gap: 10px;
    /* padding: ${theme.space['4']}; */

    ${mq.sm.min(css`
      /* padding: ${theme.space['6']} ${theme.space['18']}; */
      gap: 40px;
    `)}
  `,
)

const InfoItems = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};

    ${mq.sm.min(css`
      flex-direction: row;
      align-items: stretch;
    `)}
  `,
)

const InfoItem = styled.div(
  ({ theme }) => css`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};

    padding: ${theme.space['4']};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    text-align: center;

    & > div:first-of-type {
      width: ${theme.space['10']};
      height: ${theme.space['10']};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${theme.fontSizes.extraLarge};
      font-weight: ${theme.fontWeights.bold};
      color: ${theme.colors.backgroundPrimary};
      background: ${theme.colors.accentPrimary};
      border-radius: ${theme.radii.full};
    }

    & > div:last-of-type {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    gap: ${theme.space['2']};
  `,
)
const ButtonBox = styled(MobileFullWidth)(
  () => css`
    & > div,
    & {
      width: 260px;
      ${mq.sm.min(css`
        min-width: 260px;
      `)}
    }
  `,
)
const ProfileButton = styled.button(
  () => css`
    cursor: pointer;
  `,
)
const FullInvoiceBox = styled.div`
  width: 500px;
  border-radius: 10px;
  background: #f7fafc;
  padding: 30px;
`
const infoItemArr = Array.from({ length: 3 }, (_, i) => `steps.info.ethItems.${i}`)

type Props = {
  registrationData: RegistrationReducerDataItem
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (data: { back: boolean }) => void
  onProfileClick: () => void
}

const Info = ({ registrationData, nameDetails, callback, onProfileClick }: Props) => {
  const { t } = useTranslation('register')
  const { normalisedName, priceData } = nameDetails
  const estimate = useEstimateFullRegistration({
    name: normalisedName,
    registrationData,
    price: priceData,
  })
  const show = false
  return (
    <StyledCard>
      <PremiumTitle isPremium nameDetails={nameDetails} />
      <LineProgress curSelect={1} />
      <InterText $textColor="#000" $w={500}>
        Complete a transaction to begin the timer
      </InterText>
      <FullInvoiceBox>
        <FullInvoice {...estimate} />
      </FullInvoiceBox>

      {show && !registrationData.queue.includes('profile') && (
        <ProfileButton data-testid="setup-profile-button" onClick={onProfileClick}>
          <Typography weight="bold" color="accent">
            {t('steps.info.setupProfile')}
          </Typography>
        </ProfileButton>
      )}
      <ButtonContainer>
        <ButtonBox>
          <Button colorStyle="accentSecondary" onClick={() => callback({ back: true })}>
            {t('action.back', { ns: 'common' })}
          </Button>
        </ButtonBox>
        <ButtonBox>
          <Button data-testid="next-button" onClick={() => callback({ back: false })}>
            {t('action.begin', { ns: 'common' })}
          </Button>
        </ButtonBox>
      </ButtonContainer>
    </StyledCard>
  )
  return (
    <StyledCard>
      <PremiumTitle isPremium nameDetails={nameDetails} />
      <LineProgress curSelect={1} />
      <Heading>{t('steps.info.heading')}</Heading>
      <Typography>{t('steps.info.subheading')}</Typography>
      <InfoItems>
        {infoItemArr.map((item, inx) => (
          <InfoItem key={item}>
            <Typography>{inx + 1}</Typography>
            <Typography>{t(item)}</Typography>
          </InfoItem>
        ))}
      </InfoItems>
      <FullInvoice {...estimate} />
      {show && !registrationData.queue.includes('profile') && (
        <ProfileButton data-testid="setup-profile-button" onClick={onProfileClick}>
          <Typography weight="bold" color="accent">
            {t('steps.info.setupProfile')}
          </Typography>
        </ProfileButton>
      )}
      <ButtonContainer>
        <MobileFullWidth>
          <Button colorStyle="accentSecondary" onClick={() => callback({ back: true })}>
            {t('action.back', { ns: 'common' })}
          </Button>
        </MobileFullWidth>
        <MobileFullWidth>
          <Button data-testid="next-button" onClick={() => callback({ back: false })}>
            {t('action.begin', { ns: 'common' })}
          </Button>
        </MobileFullWidth>
      </ButtonContainer>
    </StyledCard>
  )
}

export default Info
