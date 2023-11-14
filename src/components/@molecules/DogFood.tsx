import { isAddress } from '@ethersproject/address'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQuery, useQueryClient } from 'wagmi'
import { Input ,mq} from '@ensdomains/thorin'
import { Spacer } from '@app/components/@atoms/Spacer'
import { useEns } from '@app/utils/EnsProvider'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback';
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { DisplayItems } from './TransactionDialogManager/DisplayItems'


const InnerContainer = styled.div `
    width: 100%;
    border-radius: 10px;
    border: 1px solid  #D4D7E2;
    background: #FFF;
    padding:14px 16px;
    margin-bottom:100px;
    & div:last-child{
      &>div{
        border:none;
      }

    }
    ${mq.sm.max(css`
      margin-bottom:0;
    `)}
  `
const AddressInput = styled(Input)`
border:none;
`
export const DogFood = (
    {
      register,
      watch,
      formState,
      setValue,
      disabled,
      validations,
      label,
      hideLabel,
      trigger
    // eslint-disable-next-line prettier/prettier
    }: Pick<ReturnType<typeof useForm<any>>, 'register' | 'watch' | 'formState' | 'setValue' | 'trigger'>
    & { label?: string, validations?: any, disabled?: boolean, hideLabel?: boolean },
) => {
  const { t } = useTranslation('profile')
  const { getAddr, ready } = useEns()
  const queryClient = useQueryClient()

  const inputWatch: string | undefined = watch('dogfoodRaw')

  // Throttle the change of the input
  const [ethNameInput, setEthNameInput] = useState('')
  const throttledSetEthNameInput = useDebouncedCallback(setEthNameInput, 500)
  useEffect(() => {
      throttledSetEthNameInput((inputWatch || '').toLocaleLowerCase().trim())
  }, [inputWatch, throttledSetEthNameInput])

  const queryKeyGenerator = useQueryKeys().dogfood

  // Attempt to get address of AWNS name
  const { data: ethNameAddress } = useQuery(
     queryKeyGenerator(ethNameInput),
    async () => {
      try {
      const result = await getAddr(ethNameInput, '60')
      return (result as any)?.addr || ''
      } catch (e) {
        return ''
      }
    },
    { enabled: !!ethNameInput?.includes('.') && ready },
  )

  // Update react value of address
  const finalValue = inputWatch?.includes('.') ? ethNameAddress : inputWatch
  useEffect(() => {
    setValue('address', finalValue)
    if (finalValue) trigger('dogfoodRaw')
  }, [finalValue, setValue, trigger])

  const errorMessage = formState.errors.dogfoodRaw?.message

  return (
    <InnerContainer>
      <AddressInput
        data-testid="dogfood"
        disabled={disabled}
        label={label}
        hideLabel={hideLabel}
        placeholder={t('details.sendName.inputPlaceholder')}
        {...register('dogfoodRaw', {
          validate: {
            length: (value) =>
              !disabled && !value?.trim().includes('.') && value?.trim().length !== 42
                ? t('errors.addressLength')
                : undefined,
            isAddress: (value) =>
              !disabled && !value?.includes('.') && !isAddress(value.trim())
                ? t('errors.invalidAddress')
                : undefined,
            hasAddressRecord: async (value) => {
              if(value?.includes('.')) {
                try {
                  const result = await queryClient.getQueryData(queryKeyGenerator(value.toLowerCase().trim()))
                  if (result) { return undefined }
                // eslint-disable-next-line no-empty
                } catch (e){
                  console.error('validation error: ', e)
                }
                return 'AWNS Name has no address record'
                }
              },
            ...validations
          },
        })}
        error={errorMessage}
        onClickAction={() => setValue('dogfoodRaw', '')}
      />
      {!errorMessage && finalValue && !disabled && (
        <>
         <Spacer $height='2' />
          <DisplayItems displayItems={[
            { label: 'address', value: finalValue, type: 'address' },
          ]} />
        </>
      )}
    </InnerContainer>
  )
}
