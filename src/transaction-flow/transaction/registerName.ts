import type { JsonRpcSigner } from '@ethersproject/providers'
import { BaseRegistrationParams } from '@myclique/awnsjs/utils/registerHelpers'
import type { TFunction } from 'react-i18next'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { calculateValueWithBuffer, secondsToYears } from '@app/utils/utils'

type Data = BaseRegistrationParams & { name: string; signature: string }

const displayItems = (
  { name, duration }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.registerName'),
  },
  {
    label: 'duration',
    value: t(secondsToYears(duration) > 1 ? 'unit.years_other' : 'unit.years_one', {
      count: secondsToYears(duration),
    }),
  },
]

const transaction = async (signer: JsonRpcSigner, ens: PublicENS, data: Data) => {
  const price = await ens.getPrice(
    data.name.split('.')[0],
    data.premium,
    data.booker,
    data.duration,
    data.signature,
    data?.discount as string,
    data?.discountCount as number,
    data?.discountCode as string,
    data?.discountBinding,
    data?.maxDeduct as string,
    data?.minLimit as string,
    data?.timestamp as number,
  )

  const value = price!.base.add(price!.premium)
  const valueWithBuffer = calculateValueWithBuffer(value)
  return ens.registerName.populateTransaction(data.name, {
    signer,
    ...data,
    value: valueWithBuffer,
  })
}

export default { displayItems, transaction } as Transaction<Data>
