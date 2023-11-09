import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import USDTImg from '@app/assets/USDT.png'
import useGetTokenList from '@app/hooks/requst/useGetTokenList'
import { useChainId } from '@app/hooks/useChainId'

// import { makeDisplay } from '@app/utils/currency'

const AssetsItemStyle = styled.div`
  width: 100%;
  height: 80px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f7fafc;
  display: flex;
  padding: 15px 20px;
  justify-content: space-between;
`

const LeftStyle = styled.div`
  display: flex;
  gap: 17px;
`
const NameStyle = styled(Typography)`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
`

const ContentTextStyle = styled(Typography)`
  color: var(--tile-grey, #80829f);
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
`

const RightStyle = styled.div`
  display: grid;
  gap: 12px;
`

export function Tokens({ accountAddress }: { accountAddress: string }) {
  const chainId = useChainId()
  const { data: tokenList } = useGetTokenList({ account: accountAddress, chain: chainId })

  return (
    <>
      {tokenList?.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <AssetsItemStyle key={`${item.id}-${index}`}>
          <LeftStyle>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.logo_url || USDTImg.src} alt="eth" />
            <div style={{ display: 'grid', gap: '12px' }}>
              <NameStyle>{item.name}</NameStyle>
              <ContentTextStyle>{item.symbol}</ContentTextStyle>
            </div>
          </LeftStyle>
          <RightStyle>
            <NameStyle style={{ textAlign: 'right' }}>
              {item.amount} {item.symbol}
            </NameStyle>
            <ContentTextStyle style={{ textAlign: 'right' }}>${item.price} USD</ContentTextStyle>
          </RightStyle>
        </AssetsItemStyle>
      ))}
    </>
  )
}
