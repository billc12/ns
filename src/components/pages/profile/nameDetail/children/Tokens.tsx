import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import USDTImg from '@app/assets/USDT.png'
import { IResultItem } from '@app/hooks/requst/useGetTokenList'
import { useBalanceOf } from '@app/hooks/useBalanceOf'

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
const Item = ({ item, accountAddress }: { item: any; accountAddress: string }) => {
  const balance = useBalanceOf(item.address, accountAddress, item.decimals || 18)
  return (
    <AssetsItemStyle>
      <LeftStyle>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.logoUrl || USDTImg.src} alt="eth" />
        <div style={{ display: 'grid', gap: '12px' }}>
          <NameStyle>{item.name}</NameStyle>
          <ContentTextStyle>{item.symbol}</ContentTextStyle>
        </div>
      </LeftStyle>
      <RightStyle>
        <NameStyle style={{ textAlign: 'right' }}>
          {balance} {item.symbol}
        </NameStyle>
        <ContentTextStyle style={{ textAlign: 'right' }}>${item.price} USD</ContentTextStyle>
      </RightStyle>
    </AssetsItemStyle>
  )
}
export function Tokens({
  accountAddress,
  tokenList,
}: {
  accountAddress: string
  tokenList: IResultItem[] | undefined
}) {
  // const { data: tokenList } = useGetTokenList({ account: accountAddress, chain: 5 })

  return (
    <>
      {tokenList &&
        tokenList?.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Item key={`${item.address}-${index}`} item={item} accountAddress={accountAddress} />
        ))}
    </>
  )
}
