import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import { DogFood } from '@app/components/@molecules/DogFood'
import { BackButton, NextButton } from '@app/components/Awns/Dialog'
import { useTransferNFT } from '@app/hooks/transfer/useTransferNFT'

type FormData = {
  dogfoodRaw: string
  address: string
}

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 100px 100px;
  align-items: flex-start;
  gap: 5px;
  margin-top: 20px;
  & > div {
    margin: 0;
    padding: 0;

    /* border: 0; */

    & > div {
      gap: 0;
    }
  }
  & > button {
    height: 48px;
  }
`
const Page = ({
  onClose,
  accountAddress,
  item,
}: {
  onClose: () => void
  accountAddress: string
  item: any
}) => {
  const {
    register,
    watch,
    getFieldState,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState,
    trigger,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      address: '',
      dogfoodRaw: '',
    },
  })
  const address = watch('address')
  // const from = '0xA550a11dE495dC0c07e25f2341463abFf85cb20f'
  const { callback: transferNFT, loading } = useTransferNFT({
    account: accountAddress as `0x${string}`,
    recipientAddress: address as any,
    tokenContract: item.contract_address,
    tokenId: item.token_id,
  })
  const hasErrors = Object.keys(formState.errors || {}).length > 0
  const onSubmit = () => {
    transferNFT()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <DogFood
          {...{
            register,
            getFieldState,
            watch,
            setValue,
            getValues,
            setError,
            formState,
            trigger,
          }}
        />
        <BackButton onClick={onClose}>Cancel</BackButton>
        <NextButton type="submit" loading={loading} disabled={!address || hasErrors || loading}>
          Send
        </NextButton>
      </Container>
    </form>
  )
}
export default Page
