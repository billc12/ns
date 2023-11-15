import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { ETHRegistrarController__factory } from '@myclique/awnsjs/generated/factories/ETHRegistrarController__factory'
import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'
import type ConfettiT from 'react-confetti'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useTransaction } from 'wagmi'

import { Typography, mq } from '@ensdomains/thorin'

import UserAvatar from '@app/assets/TestImage.png'
import RegistrSuccess from '@app/assets/registr-success.png'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { InterText } from '@app/components/@molecules/SearchInput/SearchResult'
import { BackButton, NextButton } from '@app/components/Awns/Dialog'
import { Card } from '@app/components/Card'
import useSignName from '@app/hooks/names/useSignName'
import { useGetUserImg } from '@app/hooks/requst/useGetUserImg'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useWindowSize from '@app/hooks/useWindowSize'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { shortenAddress } from '@app/utils/utils'

import { BigPremiumText } from '../PremiumTitle'
import { GrayRoundRow } from './Pricing/Pricing'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 840px;
    padding-bottom: 50px;
    margin: 0 auto;
    text-align: center;
    flex-direction: column;
    gap: ${theme.space['4']};
    /* padding: ${theme.space['4']}; */
    canvas {
      max-width: ${theme.space.full};
    }
    ${mq.sm.max(css`
      width: 100%;
      max-width: 100%;
    `)}
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)
const FullInvoiceBox = styled.div`
  width: 100%;
  border-radius: 10px;
  background: #f7fafc;
  padding: 20px 36px;
  margin-top: 15px;
`
const Confetti = dynamic(() =>
  import('react-confetti').then((mod) => mod.default as typeof ConfettiT),
)

export const useEthInvoice = (
  name: string,
  isMoonpayFlow: boolean,
): { InvoiceFilled?: React.ReactNode; avatarSrc: string } => {
  const { t } = useTranslation('register')
  const { address } = useAccount()
  const keySuffix = `${name}-${address}`
  // const commitKey = `commit-${keySuffix}`
  const registerKey = `register-${keySuffix}`
  const { getLatestTransaction } = useTransactionFlow()

  // const commitTxFlow = getLatestTransaction(commitKey)
  const registerTxFlow = getLatestTransaction(registerKey)

  const { avatarSrc: _avatarSrc } = useGetUserImg(name)

  const registerReceipt = registerTxFlow?.minedData
  const { data } = useTransaction({
    hash: (registerTxFlow?.hash as any) || '',
  })

  const registrationValue = useMemo(() => {
    if (!registerReceipt) return null
    const registrarInterface = ETHRegistrarController__factory.createInterface()
    for (const log of registerReceipt.logs) {
      try {
        const [, , , baseCost, premium] = registrarInterface.decodeEventLog(
          'NameRegistered',
          log.data,
          log.topics,
        ) as [
          name: string,
          labelhash: string,
          owner: string,
          base: BigNumber,
          premium: BigNumber,
          expiry: BigNumber,
        ]
        return baseCost.add(premium)
        // eslint-disable-next-line no-empty
      } catch {}
    }
    return null
  }, [registerReceipt])

  const isLoading = !registerReceipt

  const avatarSrc = useMemo(() => {
    return _avatarSrc || UserAvatar.src
  }, [_avatarSrc])
  const InvoiceFilled = useMemo(() => {
    if (isLoading) return null
    const value = registrationValue || BigNumber.from(0)
    console.log('value', value)

    // const commitGasUsed = BigNumber.from(commitReceipt?.gasUsed || 0)
    const registerGasUsed = BigNumber.from(registerReceipt?.gasUsed || 0)

    // const commitNetFee = commitGasUsed.mul(commitReceipt!.effectiveGasPrice)
    const registerNetFee = registerGasUsed.mul(registerReceipt!.effectiveGasPrice)
    const totalNetFee = registerNetFee || BigNumber.from(0)

    return (
      <Invoice
        totalTitle="Total paid"
        items={[
          { label: 'Registration', value: data?.value },
          { label: 'Gas fee', value: totalNetFee },
          // { label: t('invoice.registration'), value },
          // { label: t('invoice.networkFee'), value: totalNetFee },
        ]}
        totalLabel={t('invoice.totalPaid')}
      />
    )
  }, [isLoading, registrationValue, registerReceipt, data?.value, t])
  console.log('InvoiceFilled', InvoiceFilled)
  if (isMoonpayFlow) return { InvoiceFilled: null, avatarSrc }

  return { InvoiceFilled, avatarSrc }
}

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (toProfile: boolean) => void
  isMoonpayFlow: boolean
}
const CenterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const HeadStyle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  border-bottom: 1px solid #dce6ed;
  flex-direction: column;
`
const HeadTitle = styled(Typography)<{ $color?: string }>`
  color: ${(props) => props.$color || '#3f5170'};
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`
const Round = styled(CenterBox)`
  width: 380px;
  height: 380px;
  border-radius: 10px;
  background: #f7fafc;
  position: relative;
`
const UserImg = styled.div`
  width: 350px;
  height: 350px;
`
const PositionImg = styled.div`
  position: absolute;
  left: 50%;
  top: 37px;
  transform: translateX(-50%);
`
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 10px;
  & .btn {
    grid-column: 2;
  }
  ${mq.sm.max(css`
    display: flex;
    flex-direction: column;
  `)}
`
const Complete = ({ nameDetails, callback, isMoonpayFlow }: Props) => {
  const { normalisedName: name, beautifiedName } = nameDetails
  const { t } = useTranslation('register')
  const { width, height } = useWindowSize()
  console.log('beautifiedName', beautifiedName)
  console.log('isMoonpayFlow', isMoonpayFlow)
  const { avatarSrc, InvoiceFilled } = useEthInvoice(name, false)
  const { data } = useSignName({ name })

  return (
    <StyledCard>
      <HeadStyle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={RegistrSuccess.src} alt="registr success img" />
        <HeadTitle style={{ marginTop: 10 }}>Congrats to your new AWNS!</HeadTitle>
        <HeadTitle>Start traversing in AW</HeadTitle>
        <MobileFullWidth style={{ marginTop: 20 }}>
          <BackButton onClick={() => callback(false)}>Register Another</BackButton>
        </MobileFullWidth>
      </HeadStyle>
      <Container>
        <Round>
          <UserImg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc || UserAvatar.src}
              style={{ width: '100%', height: '100%', borderRadius: 8, pointerEvents: 'none' }}
              alt="UserAvatar"
            />
          </UserImg>
          <PositionImg>
            <HeadTitle $color="#fff">
              {name.length > 30 ? shortenAddress(name, 30, 10, 10) : name}
            </HeadTitle>
          </PositionImg>
        </Round>
        <div>
          <GrayRoundRow $p="20px 36px">
            <InterText $color="#8D8EA5" $size="16px" $weight={500}>
              Name
            </InterText>
            {data?.premium ? (
              <BigPremiumText>
                {name.length > 30 ? shortenAddress(name, 30, 10, 10) : name}
              </BigPremiumText>
            ) : (
              <InterText $color="#3F5170" $size="18px" $weight={600}>
                {name.length > 30 ? shortenAddress(name, 30, 10, 10) : name}
              </InterText>
            )}
          </GrayRoundRow>
          <FullInvoiceBox>{InvoiceFilled}</FullInvoiceBox>
        </div>
        <ButtonContainer className="btn">
          <NextButton data-testid="view-name" onClick={() => callback(true)}>
            {t('steps.complete.viewName')}
          </NextButton>
        </ButtonContainer>
      </Container>
      <Confetti
        width={width}
        height={height}
        recycle={false}
        colors={[
          '#49B393',
          '#5298FF',
          '#5854D6',
          '#5AC8FA',
          '#AF52DE',
          '#D55555',
          '#FF2D55',
          '#FF9500',
          '#FFCC00',
        ]}
        pieceWidth={{ min: 10, max: 20 }}
        pieceHeight={{ min: 20, max: 50 }}
        pieceShape="Square"
        gravity={0.25}
        initialVelocityY={20}
      />
      {/* <NFTContainer>
        <NFTTemplate backgroundImage={avatarSrc} isNormalised name={name} />
      </NFTContainer> */}
      {/* <TitleContainer>
        <Title>{t('steps.complete.heading')}</Title>
        <Typography style={{ display: 'inline' }} fontVariant="headingThree" weight="bold">
          {t('steps.complete.subheading')}
          <SubtitleWithGradient>{nameWithColourEmojis}</SubtitleWithGradient>
        </Typography>
      </TitleContainer> */}
      {/* <Typography>{t('steps.complete.description')}</Typography> */}
      {/* {InvoiceFilled} */}
    </StyledCard>
  )
}

export default Complete
