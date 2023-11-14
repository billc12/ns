import { isAddress } from '@ethersproject/address'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useQueryClient } from 'wagmi'

import { Dialog, Typography } from '@ensdomains/thorin'

import { BackButton, ContentStyle, NameInfo, NextButton, Row } from '@app/components/Awns/Dialog'
import LabelInput from '@app/components/Awns/LabelInput'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

export type AddressRecord = {
  key: string
  coin: string
  addr: string
}
type Data = {
  name: string
}
type RecordItem = {
  key: string
  value: string
}

type RecordOptions = {
  coinTypes?: RecordItem[]
}
const InterText = styled(Typography)<{ $size?: string; $color?: string; $weight?: number }>`
  width: max-content;
  height: max-content;
  color: ${(props) => props.$color || '#fff'};
  font-size: ${(props) => props.$size || '20px'};
  font-style: normal;
  font-weight: ${(props) => props.$weight || 600};
  line-height: normal;
`
export type Props = {
  data?: Data
  onDismiss?: () => void
} & TransactionDialogPassthrough
const EditResolveAddress = ({ data, onDismiss, dispatch }: Props) => {
  const nameDetails = useNameDetails(data?.name || '')
  const { normalisedName, expiryDate, profile } = nameDetails
  const _addressArr = useMemo(() => {
    const address: AddressRecord[] = (profile?.records?.coinTypes as any[]) || []
    // filter is ETH
    return address.filter(({ addr, coin }) => addr && coin === 'ETH')
  }, [profile?.records?.coinTypes])
  const [addrArr, setAddrArr] = useState([..._addressArr])
  const changeHandle = (item: AddressRecord) => {
    const arr = [...addrArr]
    const index = arr.findIndex((i) => i.key === item.key)
    arr.splice(index, 1, item)
    setAddrArr(arr)
  }
  const { t } = useTranslation('profile')
  const queryClient = useQueryClient()
  const queryKeyGenerator = useQueryKeys().dogfood
  const [errArr, setErrArr] = useState(Array.from({ length: addrArr.length }))
  const verifyInput = async (value: string) => {
    if (!value?.includes('.') && value?.length !== 42) {
      return t('errors.addressLength')
    }
    if (!value?.includes('.') && !isAddress(value)) {
      return t('errors.invalidAddress')
    }
    if (value?.includes('.')) {
      try {
        const result = await queryClient.getQueryData(queryKeyGenerator(value.toLowerCase()))
        if (result) {
          return undefined
        }
        // eslint-disable-next-line no-empty
      } catch (e) {
        console.error('validation error: ', e)
      }
      return 'AWNS Name has no address record'
    }
  }
  useEffect(() => {
    addrArr.forEach(async (j, i) => {
      const result = await verifyInput(j.addr)
      const _err = Array.from({ length: addrArr.length })
      if (result) {
        _err.splice(i, 1, result)
      } else {
        _err.splice(i, 1, undefined)
      }
      setErrArr(_err)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addrArr])
  const isVerify = useMemo(() => errArr.some((i) => i), [errArr])
  const records = useMemo(() => {
    const coinTypes = addrArr.map(({ key, addr }) => ({ key, value: addr }))
    return {
      coinTypes,
    } as RecordOptions
  }, [addrArr])
  const submitHandle = useCallback(() => {
    if (isVerify) return null
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('updateProfile', {
          name: data?.name || '',
          resolver: profile!.resolverAddress!,
          records,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }, [data?.name, dispatch, isVerify, profile, records])
  return (
    <>
      <Dialog.Heading title="Set Address AWNS" />
      <NameInfo name={normalisedName} expiryDate={expiryDate} />
      <ContentStyle>
        {addrArr.map((item, i) => (
          <div key={`${item.key}-${item.addr}`}>
            <LabelInput
              value={item.addr}
              label="Connected Address"
              onChange={(addr) => changeHandle({ ...item, addr })}
            />
            <InterText style={{ marginTop: 10 }} $size="12px" $color="rgb(197,47,27)">
              {errArr[i]}
            </InterText>
          </div>
        ))}
      </ContentStyle>

      <Row style={{ marginTop: 20, width: '100%' }}>
        <BackButton onClick={onDismiss}>Cancel</BackButton>
        <NextButton onClick={submitHandle} disabled={isVerify}>
          Save
        </NextButton>
      </Row>
    </>
  )
}
export default EditResolveAddress
