import { formatFixed } from '@ethersproject/bignumber'
import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { yearsToSeconds } from '@app/utils/utils'

import { Result as SignDataType } from './names/useSignName'

type Params = {
  nameOrNames: string | string[]
  legacy?: boolean
  signData: SignDataType | undefined
  years?: number
}
export const usePrice = ({ nameOrNames, signData: signName, legacy, years = 1 }: Params) => {
  const { ready, getPrice } = useEns()
  // const { data: signName } = useSignName({
  //   ...discountInfo,
  //   name: Array.isArray(nameOrNames) ? nameOrNames[0] : nameOrNames,
  // })

  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]
  const type = legacy ? 'legacy' : 'new'
  const {
    data,
    status,
    isFetched,
    isLoading: loading,
    error,
    isFetchedAfterMount,
    // don't remove this line, it updates the isCachedData state (for some reason) but isn't needed to verify it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching,
  } = useQuery(
    useQueryKeys().getPrice(type, names, [signName?.discountCode || '0', years]),
    async () =>
      getPrice(
        names.map((n) => n.split('.')[0])?.[0],
        signName?.premium!,
        signName?.booker!,
        yearsToSeconds(years),
        signName?.signature! as any,
        signName?.discount!,
        signName?.discountCount! as any,
        signName?.discountCode! as any,
        signName?.discountBinding!,
        signName?.maxDeduct!,
        signName?.minLimit!,
        signName?.timestamp!,
      ).then((d) => d || null),
    {
      enabled: !!(ready && names && names.length > 0 && signName),
    },
  )

  const originalPrice = data?.oBase
  const discountPrice = data?.base
  const base = data?.base
  const premium = data?.premium
  const total = data?.base ? data.base.add(data.premium) : undefined
  const hasPremium = data?.premium.gt(0)
  // const discountRate = 100 - (years - 1) * 5
  // const totalYearlyFee = total?.mul(years).mul(discountRate).div(100)
  const totalYearlyFee = total
  const _discount = Number(formatFixed(BigNumber.from(signName?.discount || '0'), 18)) * 100
  const isHasDiscount = _discount < 100
  const discountedPrice = base
  const isUseDiscount = data ? !data.base.eq(data.oBase) : false
  const oBase = data?.oBase
  return {
    base,
    premium,
    total,
    totalYearlyFee,
    hasPremium,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    loading,
    error,
    isHasDiscount,
    discountedPrice,
    isUseDiscount,
    oBase,
    discountPrice,
    originalPrice,
  }
}
