import type { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { fetchedGetSignName } from '@app/hooks/names/useSignName'
import { HelperProps, PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

import { calculateValueWithBuffer, secondsToYears } from '../../utils/utils'

type Data = {
  names: string[]
  duration: number
  rentPrice: BigNumber
  isSelf?: boolean
}

const toSingleDecimal = (duration: number) => parseFloat(secondsToYears(duration).toFixed(1))

const displayItems = (
  { names, rentPrice, duration }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: names.length > 1 ? `${names.length} names` : names[0],
    type: names.length > 1 ? undefined : 'name',
  },
  {
    label: 'action',
    value: t('transaction.extendNames.actionValue', { ns: 'transactionFlow' }),
  },
  {
    label: 'duration',
    value: t('unit.years', { count: toSingleDecimal(duration) }),
  },
  {
    label: 'cost',
    value: t('transaction.extendNames.costValue', {
      ns: 'transactionFlow',
      value: makeDisplay(calculateValueWithBuffer(rentPrice), 5, 'eth'),
    }),
  },
]

const helper = (data: Data, t: TFunction<'translation', undefined>): HelperProps | undefined => {
  if (data.isSelf) return
  return {
    type: 'warning',
    children: t('transaction.extendNames.warning', { ns: 'transactionFlow' }),
  }
}

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const { names, duration } = data
  const labels = names.map((name) => {
    const parts = name.split('.')
    if (parts.length > 2) throw new Error('Currently only supports 1st level names')
    if (parts[1] !== 'aw') throw new Error('Currently only supports .aw names')
    return parts[0]
  })

  const signName = await fetchedGetSignName(names.toString())

  const price = await ens.getPrice(labels, duration, signName || '0x', false)
  if (!price) throw new Error('No price found')

  const priceWithBuffer = calculateValueWithBuffer(price.base)
  return ens.renewNames.populateTransaction(names, {
    duration,
    value: priceWithBuffer,
    signature: signName || '0x',
    signer,
  })
}
export default { transaction, displayItems, helper } as Transaction<Data>
