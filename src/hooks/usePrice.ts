import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { yearsToSeconds } from '@app/utils/utils'

import useSignName from './names/useSignName'

export const usePrice = (nameOrNames: string | string[], years = 1, legacy?: boolean) => {
  const { ready, getPrice } = useEns()
  const { data: signName } = useSignName(nameOrNames.toString(), '')

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
    useQueryKeys().getPrice(type, names, [signName?.discountCode || '']),
    async () =>
      getPrice(
        names.map((n) => n.split('.')[0])?.[0],
        yearsToSeconds(1),
        signName?.signature || '0x',
        signName?.discountRate!,
        signName?.discountCount!,
        signName?.discountCode!,
        signName?.timestamp!,
      ).then((d) => d || null),
    {
      enabled: !!(ready && names && names.length > 0 && signName),
    },
  )

  const base = data?.base
  const premium = data?.premium
  const total = data?.base ? data.base.add(data.premium) : undefined
  const hasPremium = data?.premium.gt(0)
  const discountRate = 100 - (years - 1) * 5
  const totalYearlyFee = total?.mul(years).mul(discountRate).div(100)

  return {
    base,
    premium,
    total,
    totalYearlyFee,
    hasPremium,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
    loading,
    error,
  }
}
