import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

import { useEthPrice } from '@app/hooks/useEthPrice'
import { CurrencyDisplay } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

type Props = {
  eth?: BigNumber
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: number
  currency: CurrencyDisplay
}

export const CurrencyText = ({ eth, bufferPercentage = 100, currency = 'eth' }: Props) => {
  const { data: ethPrice, loading } = useEthPrice()
  // if (currency === 'eth' && eth) {
  //   return <>{makeDisplay(eth, 18, 'eth')}</>
  // }
  if (!eth) return null

  if (currency === 'eth') {
    return <>{makeDisplay(eth.mul(bufferPercentage).div(100), 5, 'eth')}</>
  }
  if (loading || !ethPrice) return null

  return <>{makeDisplay(eth.mul(ethPrice).div(1e8), 2, currency, 18)}</>
}
