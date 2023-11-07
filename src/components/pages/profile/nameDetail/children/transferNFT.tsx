import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import { DogFood } from '@app/components/@molecules/DogFood'
import { BackButton, NextButton } from '@app/components/Awns/Dialog'

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
const Page = ({ onClose }: { onClose: () => void }) => {
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
  const hasErrors = Object.keys(formState.errors || {}).length > 0
  const onSubmit = (data: any) => {
    console.log('onSubmit132', data)
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
        <BackButton onClick={onClose}>cancel</BackButton>
        <NextButton type="submit" disabled={!address || hasErrors}>
          send
        </NextButton>
      </Container>
    </form>
  )
}
export default Page
