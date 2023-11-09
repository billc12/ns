import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useEns } from '@app/utils/EnsProvider'
import { erc20ContractAddress, erc721ContractAddress } from '@app/utils/constants'
import { makeDisplay } from '@app/utils/currency'
import { formatFullExpiry } from '@app/utils/utils'

import { useBasicName } from './useBasicName'
import { useErc20Contract, useErc721Contract } from './useContract'
import useDNSOwner from './useDNSOwner'
import { useGetABI } from './useGetABI'
import { useProfile } from './useProfile'

export type Profile = NonNullable<ReturnType<typeof useProfile>['profile']>
export type DetailedProfileRecords = Profile['records'] & {
  abi?: { data: string; contentType?: number }
}
export type DetailedProfile = Omit<Profile, 'records'> & {
  records: DetailedProfileRecords
}

export const useNameDetails = (name: string, skipGraph = false) => {
  const { t } = useTranslation('profile')
  const { ready } = useEns()

  const {
    isValid,
    normalisedName,
    isLoading: basicLoading,
    isCachedData: basicIsCachedData,
    registrationStatus,
    expiryDate,
    gracePeriodEndDate,
    ...basicName
  } = useBasicName(name, { normalised: false, skipGraph })

  const {
    profile: baseProfile,
    loading: profileLoading,
    status,
    isCachedData: profileIsCachedData,
  } = useProfile(normalisedName, {
    skip: !normalisedName || normalisedName === '[root]',
    skipGraph,
  })

  const { abi, loading: abiLoading } = useGetABI(
    normalisedName,
    !normalisedName || normalisedName === '[root]',
  )

  const profile: DetailedProfile | undefined = useMemo(() => {
    if (!baseProfile) return undefined
    return {
      ...baseProfile,
      records: {
        ...baseProfile.records,
        ...(abi ? { abi } : {}),
      },
    }
  }, [abi, baseProfile])

  const {
    dnsOwner,
    isLoading: dnsOwnerLoading,
    isCachedData: dnsOwnerIsCachedData,
  } = useDNSOwner(normalisedName, isValid)

  const error: string | ReactNode | null = useMemo(() => {
    if (isValid === false) {
      return t('errors.invalidName')
    }
    if (registrationStatus === 'unsupportedTLD') {
      return t('errors.unsupportedTLD')
    }
    if (profile && !profile.isMigrated && typeof profile.isMigrated === 'boolean') {
      return (
        <>
          {t('errors.migrationNotAvailable')}
          <a href={`https://legacy.ens.domains/name/${normalisedName}`}>
            {t('errors.migrationNotAvailableLink')}
          </a>
        </>
      )
    }
    if (profile && profile.message) {
      return profile.message
    }
    if (registrationStatus === 'invalid') {
      return t('errors.invalidName')
    }
    if (registrationStatus === 'gracePeriod') {
      return `${t('errors.expiringSoon', { date: formatFullExpiry(gracePeriodEndDate) })}`
    }
    if (
      // bypass unknown error for root name
      normalisedName !== '[root]' &&
      !profile &&
      !profileLoading &&
      !abiLoading &&
      ready &&
      status !== 'idle' &&
      status !== 'loading'
    ) {
      return t('errors.networkError.message', { ns: 'common' })
    }
    return null
  }, [
    gracePeriodEndDate,
    normalisedName,
    profile,
    profileLoading,
    abiLoading,
    ready,
    registrationStatus,
    status,
    t,
    isValid,
  ])

  const errorTitle = useMemo(() => {
    if (registrationStatus === 'gracePeriod') {
      return t('errors.hasExpired', { name })
    }
    if (
      normalisedName !== '[root]' &&
      !profile &&
      !profileLoading &&
      !abiLoading &&
      ready &&
      status !== 'idle' &&
      status !== 'loading'
    ) {
      return t('errors.networkError.title', { ns: 'common' })
    }
  }, [
    registrationStatus,
    name,
    t,
    profile,
    profileLoading,
    abiLoading,
    ready,
    status,
    normalisedName,
  ])

  const isLoading = !ready || profileLoading || abiLoading || basicLoading || dnsOwnerLoading

  return {
    error,
    errorTitle,
    normalisedName,
    isValid,
    profile,
    isLoading,
    dnsOwner,
    basicIsCachedData: basicIsCachedData || dnsOwnerIsCachedData,
    profileIsCachedData,
    registrationStatus,
    gracePeriodEndDate,
    expiryDate,
    ...basicName,
  }
}

export const useNameErc20Assets = (address: string | undefined) => {
  const contractAddress = erc20ContractAddress
  const contract = useErc20Contract()
  const [tokenBalance, setTokenBalance] = useState<string>()
  const [tokenSymbol, setTokenSymbol] = useState<string>()
  const [tokenName, setTokenName] = useState<string>()
  const [decimals, setDecimals] = useState<number>()
  useEffect(() => {
    if (!address || !contract) {
      return
    }
    ;(async () => {
      try {
        const [balanceRes, decimalsRes, symbolRes, nameRes] = await Promise.all([
          contract.balanceOf(address),
          contract.decimals(),
          contract.symbol(),
          contract?.name(),
        ])

        console.log(
          'balanceRes=>',
          symbolRes,
          decimalsRes,
          makeDisplay(balanceRes, undefined, `eth`, decimalsRes),
        )
        setTokenBalance(makeDisplay(balanceRes, undefined, 'eth', decimalsRes))
        setTokenSymbol(symbolRes)
        setTokenName(nameRes)
        setDecimals(decimalsRes)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [address, contract])

  return {
    tokenBalance,
    tokenSymbol,
    tokenName,
    contractAddress,
    decimals: decimals || 18,
  }
}

export const useNameErc721Assets = (address: string | undefined) => {
  // const [contractAddress, setContractAddress] = useState<`0x${string}`>(
  //   '0x8F116BEFAf0a26E1B9e4Dd29F85EA1f48a7a0Ff2',
  // )
  const contract = useErc721Contract(erc721ContractAddress)
  const [nftId, setNftId] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>()
  useEffect(() => {
    if (!address || !contract) {
      return
    }
    ;(async () => {
      setLoading(true)
      try {
        const ownerIdRes = await contract.tokenIdsByOwner(address)
        if (ownerIdRes.length) {
          setNftId(ownerIdRes.map((item) => item.toString()))
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error(error)
      }
    })()
  }, [address, contract])
  return {
    loading,
    nftId,
    // contractAddress: erc721ContractAddress,
  }
}
