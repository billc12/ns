import type { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { Overrides } from '@ethersproject/contracts/lib/index'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { ETHRegistrarController } from '@myclique/awnsjs/generated/index'

import { PublicENS, Transaction, TransactionDisplayItem } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

type ClaimReferralParams = {
  name: string
  referralReward: BigNumber
  signature: string
  overrides?: Overrides & {
    from?: string
  }
}
type Data = ClaimReferralParams & {
  canClaimReferralRewards: BigNumber
  totalReferralRewards: BigNumber
}

const displayItems = ({
  referralReward,
  canClaimReferralRewards,
}: Data): //   t: TFunction<'translation', undefined>,
TransactionDisplayItem[] => [
  {
    label: 'claim',
    value: `${makeDisplay(referralReward as BigNumber, undefined, 'eth', 18)}`,
  },
  {
    label: 'action',
    value: 'Claim Rewards',
  },
  {
    label: 'remaining',
    value: `${makeDisplay(
      canClaimReferralRewards.sub(referralReward as BigNumber),
      undefined,
      'eth',
      18,
    )}`,
  },
]

const transaction = async (
  signer: JsonRpcSigner,
  ens: PublicENS,
  data: Data,
  contract: ETHRegistrarController,
) => {
  const name = data.name.split('.')[0]
  return contract.populateTransaction.claimReferralReward(name, data.referralReward, data.signature)
}

export default { displayItems, transaction } as Transaction<Data>
