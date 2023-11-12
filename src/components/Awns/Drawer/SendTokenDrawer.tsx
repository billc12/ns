// import { isAddress } from '@ethersproject/address'
import { isAddress } from '@ethersproject/address'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled, { css } from 'styled-components'

import { Input, Select, Typography, mq } from '@ensdomains/thorin'

import USDTImg from '@app/assets/USDT.png'
import { DogFood } from '@app/components/@molecules/DogFood'
import { NextButton } from '@app/components/Awns/Dialog'
import useGetTokenList from '@app/hooks/requst/useGetTokenList'
import { useBalanceOf } from '@app/hooks/useBalanceOf'
import { useChainId } from '@app/hooks/useChainId'
import { useTokenboundClient } from '@app/hooks/useTokenboundClient'
// import useGetTokenList from '@app/hooks/requst/useGetTokenList'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import isZero from '@app/utils/isZero'

import DrawerModel from '.'

export type SendAddressProps = {
  address: string | undefined
  name: string | undefined
}
type FormData = {
  dogfoodRaw: string
  address: string
}

export type Props = {
  data: SendAddressProps
} & TransactionDialogPassthrough
const Label = styled.p`
  color: #80829f;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  margin-top: 10px;
`
const CodeInput = styled(Input)`
  width: 100%;
  border-radius: 6px;
  background: #fff;
  color: #d4d7e2;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;

  &:focus-within {
    border: 1px solid #97b7ef;
    color: #3f5170;
  }
  &::placeholder {
    color: #d4d7e2;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
  }
`
const Container = styled.div`
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  ${mq.sm.max(css`
    width: 100%;
  `)}
  &>div {
    margin-bottom: 0;
  }
`
const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-top: 50px;
  ${mq.sm.max(css`
    margin-top: 30px;
  `)}
`
const StyledImg = styled.img(
  () => css`
    width: 16px;
    height: 16px;
    border-radius: 50%;
  `,
)

const MaxButtonStyle = styled(Typography)`
  color: #97b7ef;
  line-height: 22px;
  width: 41px;
  height: 22px;
  border-radius: 4px;
  background: var(--light-bg, #f8fbff);
  text-align: center;
  cursor: pointer;
  :hover {
    background: var(--light-bg, #e6e6e6);
  }
`

const Page = ({
  address,
  open,
  onClose,
}: {
  address: string
  open: boolean
  onClose: () => void
}) => {
  const chainId = useChainId()
  const { data: tokenList } = useGetTokenList({ account: address, chain: chainId })
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
  const receiveAddress = watch('address')
  // const [receiveAddress, setReceiveAddress] = useState<string>('')
  const [sendAmount, setSendAmount] = useState<string>('')
  const [senToken, setSenToken] = useState<any>()

  const balance = useBalanceOf(senToken?.address, address, senToken?.decimals || 18)
  const tokenboundClient = useTokenboundClient()

  const SendTokenCallback = async () => {
    if (isZero(senToken)) {
      const ethRes = await tokenboundClient?.transferETH({
        account: address as `0x${string}`,
        amount: Number(sendAmount),
        recipientAddress: receiveAddress as `0x${string}`,
      })
      console.log('senToken=>', ethRes)
    } else {
      const erc20Res = await tokenboundClient?.transferERC20({
        account: address as `0x${string}`,
        amount: Number(sendAmount),
        recipientAddress: receiveAddress as `0x${string}`,
        erc20tokenAddress: senToken?.address as `0x${string}`,
        erc20tokenDecimals: senToken?.decimals || 18,
      })
      console.log('senToken=>', erc20Res)
    }
  }

  const actionBtn = useMemo(() => {
    if (!balance || !sendAmount || !receiveAddress || !isAddress(receiveAddress)) {
      return <NextButton disabled>Send</NextButton>
    }
    if (Number(balance) < Number(sendAmount)) {
      return <NextButton disabled>Insufficient Balance</NextButton>
    }
    return <NextButton type="submit">Send</NextButton>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance, receiveAddress, sendAmount])

  const optionsList = useMemo(() => {
    if (!tokenList || !tokenList?.length) return []
    return tokenList?.map((t) => ({
      value: t,
      label: t.symbol,
      prefix: (
        <div style={{ height: 16, width: 16 }}>
          <StyledImg src={USDTImg.src} />
        </div>
      ),
    })) as any
  }, [tokenList])
  console.log('tokenList123456', tokenList)

  const onSubmit = () => {
    SendTokenCallback()
  }
  return (
    <DrawerModel open={open} onClose={onClose} title="Send Assets">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          <Label>To Account</Label>
          {/* <CodeInput
            hideLabel
            label
            placeholder="Ethereum address(0x) or ENS"
            value={receiveAddress}
            onChange={(e) => setReceiveAddress(e.target.value)}
          /> */}
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Label>Assets</Label>
            {senToken && (
              <Label>
                Balance:{balance || '0.00'} {senToken?.symbol || '--'}
              </Label>
            )}
          </div>
          <Select
            label=""
            autocomplete
            value={senToken}
            options={optionsList}
            placeholder="Select Token"
            onChange={(e) => {
              console.log('e.target.value', e.target.value)
              setSenToken(e.target.value)
              setSendAmount('')
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Label>Amount</Label>
            {!!senToken && !!balance && (
              <MaxButtonStyle
                onClick={() => {
                  setSendAmount(balance)
                }}
              >
                Max
              </MaxButtonStyle>
            )}
          </div>

          <CodeInput
            hideLabel
            label
            placeholder="amount"
            value={sendAmount}
            onChange={(e) => {
              const value = e.target.value as string
              // eslint-disable-next-line no-restricted-globals
              if (!value || !Number.isNaN(Number(value))) {
                setSendAmount(value)
              }
            }}
          />

          <Row>{actionBtn}</Row>
        </Container>
      </form>
    </DrawerModel>
  )
}
export default Page
