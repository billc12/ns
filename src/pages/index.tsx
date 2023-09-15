import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import Hamburger from '@app/components/@molecules/Hamburger/Hamburger'
import { SearchInput } from '@app/components/@molecules/SearchInput/SearchInput'
import { LeadingHeading } from '@app/components/LeadingHeading'

import ENSFull from '../assets/ENSFull.svg'

// const GradientTitle = styled.h1(
//   ({ theme }) => css`
//     font-size: ${theme.fontSizes.headingTwo};
//     text-align: center;
//     font-weight: 800;
//     background-image: ${theme.colors.gradients.accent};
//     background-repeat: no-repeat;
//     background-size: 110%;
//     /* stylelint-disable-next-line property-no-vendor-prefix */
//     -webkit-background-clip: text;
//     background-clip: text;
//     color: transparent;
//     margin: 0;

//     ${mq.sm.min(css`
//       font-size: ${theme.fontSizes.headingOne};
//     `)}
//   `,
// )

// const SubtitleWrapper = styled.div(
//   ({ theme }) => css`
//     max-width: calc(${theme.space['72']} * 2 - ${theme.space['4']});
//     line-height: 150%;
//     text-align: center;
//     margin-bottom: ${theme.space['3']};
//   `,
// )

const Container = styled.div(
  () => css`
    margin-top: 60px;
    flex-grow: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
  `,
)

const Stack = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-gap: 16;
    gap: 16;
  `,
)

const StyledENS = styled.div(
  ({ theme }) => css`
    height: ${theme.space['8.5']};
  `,
)

const LogoAndLanguage = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
  `,
)

const StyledLeadingHeading = styled(LeadingHeading)(
  () => css`
    ${mq.sm.min(
      css`
        display: none;
      `,
    )}
  `,
)
const BoldTitle = styled(Typography)<{ $size?: number; $fontW?: number }>`
  color: #fff;
  font-size: ${(props) => props.$size || '60px'};
  font-style: normal;
  font-weight: ${(props) => props.$fontW || 400};
  line-height: 67px;
  white-space: nowrap;
`
export default function Page() {
  const { t } = useTranslation('awns_common')

  return (
    <>
      <Head>
        <title>ENS</title>
      </Head>
      <StyledLeadingHeading>
        <LogoAndLanguage>
          <StyledENS as={ENSFull} />
        </LogoAndLanguage>
        <Hamburger />
      </StyledLeadingHeading>
      <Container>
        <Stack>
          <BoldTitle>{t('title')}</BoldTitle>
          <BoldTitle>{t('title_name')}</BoldTitle>
          <BoldTitle $size={24} $fontW={500}>
            {t('business')}
          </BoldTitle>
          {/* <GradientTitle>{t('title')}</GradientTitle>
          <SubtitleWrapper>
            <Typography fontVariant="large" color="grey">
              {t('description')}
            </Typography>
          </SubtitleWrapper> */}
          <SearchInput />
        </Stack>
      </Container>
    </>
  )
}
