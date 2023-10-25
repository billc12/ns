import { isAddress } from '@ethersproject/address'
import { TokenboundClient } from '@tokenbound/sdk'

import { Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  fromAddress: string
  toAddress: string
  symbol: string
  chainId: number
  amount: number
  decimals: number
  contractAddress: string
  signer?: any
}

const displayItems = ({
  amount,
  fromAddress,
  toAddress,
  symbol,
}: Data): TransactionDisplayItem[] => [
  {
    label: 'from',
    value: `${fromAddress}`,
  },
  {
    label: 'action',
    value: 'Send Token',
  },
  {
    label: 'to',
    value: `${toAddress}`,
  },
  {
    label: 'amount',
    value: `${amount} ${symbol}`,
  },
]

const transaction = async ({
  signer,
  chainId,
  contractAddress,
  fromAddress,
  amount,
  toAddress,
  decimals,
}: Data) => {
  const tokenboundClient = new TokenboundClient({
    signer,
    chainId,
    implementationAddress: '0x2d25602551487c3f3354dd80d76d54383a243358',
    registryAddress: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
  })

  if (isAddress(contractAddress)) {
    return tokenboundClient?.transferETH({
      account: fromAddress as `0x${string}`,
      amount,
      recipientAddress: toAddress as `0x${string}`,
    })
  }
  return tokenboundClient?.transferERC20({
    account: fromAddress as `0x${string}`,
    amount,
    recipientAddress: toAddress as `0x${string}`,
    erc20tokenAddress: contractAddress as `0x${string}`,
    erc20tokenDecimals: decimals,
  })
}

export default { displayItems, transaction } as unknown as Transaction<Data>
