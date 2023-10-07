import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { ETHRegistrarController__factory } from '@myclique/awnsjs/generated/factories/ETHRegistrarController__factory'
import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useState } from 'react'
import type ConfettiT from 'react-confetti'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Typography, mq } from '@ensdomains/thorin'

import UserAvatar from '@app/assets/TestImage.png'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { InterText } from '@app/components/@molecules/SearchInput/SearchResult'
import { Card } from '@app/components/Card'
import useSignName from '@app/hooks/names/useSignName'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useWindowSize from '@app/hooks/useWindowSize'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { BigPremiumText } from '../PremiumTitle'

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

    ${mq.sm.min(css`
      /* padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']}; */
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

const Confetti = dynamic(() =>
  import('react-confetti').then((mod) => mod.default as typeof ConfettiT),
)

export const useEthInvoice = (
  name: string,
  isMoonpayFlow: boolean,
): { InvoiceFilled?: React.ReactNode; avatarSrc?: string } => {
  const { t } = useTranslation('register')
  const { address } = useAccount()
  const keySuffix = `${name}-${address}`
  const commitKey = `commit-${keySuffix}`
  const registerKey = `register-${keySuffix}`
  const { getLatestTransaction } = useTransactionFlow()

  const commitTxFlow = getLatestTransaction(commitKey)
  const registerTxFlow = getLatestTransaction(registerKey)

  const [avatarSrc, setAvatarSrc] = useState<string | undefined>()

  const commitReceipt = commitTxFlow?.minedData
  const registerReceipt = registerTxFlow?.minedData

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

  const isLoading = !commitReceipt || !registerReceipt

  useEffect(() => {
    const storage = localStorage.getItem(`avatar-src-${name}`)
    if (storage) setAvatarSrc(storage)
  }, [name])

  const InvoiceFilled = useMemo(() => {
    if (isLoading) return null
    const value = registrationValue || BigNumber.from(0)

    const commitGasUsed = BigNumber.from(commitReceipt?.gasUsed || 0)
    const registerGasUsed = BigNumber.from(registerReceipt?.gasUsed || 0)

    const commitNetFee = commitGasUsed.mul(commitReceipt!.effectiveGasPrice)
    const registerNetFee = registerGasUsed.mul(registerReceipt!.effectiveGasPrice)
    const totalNetFee = registerNetFee ? commitNetFee?.add(registerNetFee) : BigNumber.from(0)

    return (
      <Invoice
        items={[
          { label: t('invoice.registration'), value },
          { label: t('invoice.networkFee'), value: totalNetFee },
        ]}
        totalLabel={t('invoice.totalPaid')}
      />
    )
  }, [isLoading, registrationValue, commitReceipt, registerReceipt, t])

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
  height: 80px;
  border-bottom: 1px solid #dce6ed;
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
const Complete = ({ nameDetails, callback, isMoonpayFlow }: Props) => {
  const { normalisedName: name, beautifiedName } = nameDetails
  const { t } = useTranslation('register')
  const { width, height } = useWindowSize()
  console.log('beautifiedName', beautifiedName)
  console.log('isMoonpayFlow', isMoonpayFlow)
  const { avatarSrc } = useEthInvoice(name, false)
  const { data } = useSignName(name)

  return (
    <StyledCard>
      <HeadStyle>
        <HeadTitle>{`Congratulations! Here's your AWNS`}</HeadTitle>
      </HeadStyle>
      <CenterBox>
        {data?.isPremium ? (
          <BigPremiumText>{name}</BigPremiumText>
        ) : (
          <InterText $color="#3F5170" $size="16px" $weight={500}>
            {name}
          </InterText>
        )}
      </CenterBox>
      <Round>
        <UserImg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc || UserAvatar.src}
            style={{ width: '100%', height: '100%' }}
            alt="UserAvatar"
          />
        </UserImg>
        <PositionImg>
          <HeadTitle $color="#fff">{name}</HeadTitle>
        </PositionImg>
      </Round>
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
      <ButtonContainer>
        <MobileFullWidth>
          <Button colorStyle="accentSecondary" onClick={() => callback(false)}>
            {t('steps.complete.registerAnother')}
          </Button>
        </MobileFullWidth>
        <MobileFullWidth>
          <Button data-testid="view-name" onClick={() => callback(true)}>
            {t('steps.complete.viewName')}
          </Button>
        </MobileFullWidth>
      </ButtonContainer>
    </StyledCard>
  )
}

export default Complete
