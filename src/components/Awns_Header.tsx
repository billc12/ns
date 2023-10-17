import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import GWeiSvg from '@app/assets/GWei.svg'
import STPSvg from '@app/assets/StpLogo.svg'
import StpLogoWhiteSvg from '@app/assets/StpLogo_white.svg'
import useGasPrice from '@app/hooks/useGasPrice'
import { makeDisplay } from '@app/utils/currency'

import { HeaderConnect } from './ConnectButton'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const HeaderLayout = styled(Row)`
  height: 80px;
  padding: 0 50px;
  justify-content: space-between;
`
const HeaderLeft = styled(Row)`
  gap: 12px;
  cursor: pointer;
`
const Line = styled.div`
  width: 2px;
  height: 20px;
  background: #dae4f0;
`
export const InterText = styled(Typography)<{ $textColor?: string; $w?: number }>`
  /* font-family: Inter; */
  font-size: 14px;
  font-style: normal;
  font-weight: ${(props) => props.$w || 400};
  line-height: 20px;
  color: ${(props) => props.$textColor || '#3f5170'};
`
const HeaderNav = styled(Row)`
  gap: 60px;
  flex: 0.8;
`
const GWeiBox = styled(Row)`
  padding: 8px 15px;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #d4d7e2;
  background: #fff;
`
const Page = () => {
  const { gasPrice } = useGasPrice()
  const router = useRouter()
  const isIndex = router.asPath === '/'
  return (
    <HeaderLayout>
      <HeaderLeft onClick={() => router.push('/')}>
        {isIndex ? <StpLogoWhiteSvg /> : <STPSvg />}
        <Line />
        <InterText style={{ fontWeight: 700 }} $textColor={isIndex ? '#fff' : '#3f5170'}>
          AWNS
        </InterText>
      </HeaderLeft>
      <HeaderNav>
        <Link href="/">
          <InterText as="a" $textColor={isIndex ? '#fff' : '#3f5170'} style={{ cursor: 'pointer' }}>
            Explore
          </InterText>
        </Link>
        <Link href="/rewards">
          <InterText as="a" $textColor={isIndex ? '#fff' : '#3f5170'} style={{ cursor: 'pointer' }}>
            Referral rewards
          </InterText>
        </Link>
        <a href="https://www.myclique.io/daos" target="_blank" rel="noreferrer">
          <InterText as="a" $textColor={isIndex ? '#fff' : '#3f5170'} style={{ cursor: 'pointer' }}>
            Clique
          </InterText>
        </a>

        <InterText as="a" $textColor={isIndex ? '#fff' : '#3f5170'}>
          Help
        </InterText>
      </HeaderNav>
      <HeaderLeft>
        <GWeiBox>
          <GWeiSvg />
          <InterText style={{ fontWeight: 500 }}>
            {gasPrice ? makeDisplay(gasPrice, undefined, 'Gwei', 9) : '-- Gwei'}
          </InterText>
        </GWeiBox>
        <HeaderConnect />
      </HeaderLeft>
    </HeaderLayout>
  )
}
export default Page
