// import { isAddress } from '@ethersproject/address'
import { TokenboundClient } from '@tokenbound/sdk'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useSigner } from 'wagmi'

import { Dialog, Input, Select, Typography, mq } from '@ensdomains/thorin'

import placeholder from '@app/assets/placeholder.png'
import { BackButton, NextButton } from '@app/components/Awns/Dialog'
import { useChainId } from '@app/hooks/useChainId'
// import useGetTokenList from '@app/hooks/requst/useGetTokenList'
import { useNameErc20Assets } from '@app/hooks/useNameDetails'

import { TransactionDialogPassthrough } from '../types'

export type SendAddressProps = {
  address: string | undefined
  name: string | undefined
}
export type Props = {
  data: SendAddressProps
} & TransactionDialogPassthrough
const Label = styled.p`
  color: #3f5170;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150.5%;
  margin-bottom: 8px;
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
`
const Container = styled.div`
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${mq.sm.max(css`
    width: 100%;
  `)}
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
    width: 20px;
    height: 20px;
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

const SendToken = ({ data: { address, name }, onDismiss }: Props) => {
  console.log('address=>', address, name)
  const signer = useSigner()

  const { tokenBalance, tokenSymbol, tokenName, contractAddress, decimals } =
    useNameErc20Assets(address)

  const [receiveAddress, setReceiveAddress] = useState<string>('')
  const [sendAmount, setSendAmount] = useState<string>('')
  const [senToken, setSenToken] = useState<string>('')
  const chainId = useChainId()

  const BalanceNum = useMemo(() => {
    return tokenBalance && Number(tokenBalance?.slice(0, -3))
  }, [tokenBalance])
  const tokenboundClient = new TokenboundClient({
    signer: signer.data,
    chainId,
    implementationAddress: '0x2d25602551487c3f3354dd80d76d54383a243358',
    registryAddress: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
  })

  // const { data: tokenList } = useGetTokenList({
  //   name: name || '',
  // })

  // const network = useMemo(() => {
  //   if (senToken) {
  //     return tokenList?.find((v) => v.id === senToken)
  //   }
  //   return ''
  // }, [senToken, tokenList])

  // console.log('tokenList=>', name, tokenList)
  // const tokenBoundAccount = tokenboundClient.getAccount({
  //   tokenContract,
  //   tokenId,
  // })

  const SendTokenCallback = async () => {
    const params = {
      address,
      amount: Number(sendAmount),
      recipientAddress: receiveAddress,
      erc20tokenAddress: contractAddress,
      erc20tokenDecimals: decimals,
    }
    console.log('transferData=>', params)

    tokenboundClient.executeCall({
      account: address as any,
      to: '0xF2da7b9CDb35Dc7c8e875DE0241b02376825CF86',
      value: BigInt(100000000000),
      data: '0x',
    })

    // const ress = await tokenboundClient?.transferETH({
    //   account: address as `0x${string}`,
    //   amount: Number(sendAmount),
    //   recipientAddress: receiveAddress as `0x${string}`,
    // })

    // const ress = await tokenboundClient?.transferERC20({
    //   account: address as `0x${string}`,
    //   amount: Number(sendAmount),
    //   recipientAddress: receiveAddress as `0x${string}`,
    //   erc20tokenAddress: contractAddress as `0x${string}`,
    //   erc20tokenDecimals: decimals || 18,
    // })
    // console.log('🚀 ~ file: SendToken-flow.tsx:138 ~ SendTokenCallback ~ res:', ress)

    console.log(1)
    onDismiss()
  }

  return (
    <>
      <Dialog.Heading title="Send Assets" />
      <Container>
        <Label>Receive Address</Label>
        <CodeInput
          hideLabel
          label
          placeholder="to Address"
          value={receiveAddress}
          onChange={(e) => setReceiveAddress(e.target.value)}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Label>Select Token</Label>
          {senToken && (
            <Label>
              {/* balance:{network?.amount || '--'} {network?.symbol || '--'} */}
              Balance:{BalanceNum || '0.00'} {tokenSymbol || '--'}
            </Label>
          )}
        </div>

        <Select
          label=""
          autocomplete
          value={senToken}
          options={[
            {
              value: contractAddress,
              label: tokenName,
              prefix: (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                  <StyledImg src={placeholder.src} />
                </div>
              ),
            },
          ]}
          placeholder="Select Token"
          onChange={(e) => {
            setSenToken(e.target.value)
            console.log('checkToken=>', e.target.value)
          }}
        />
        {/* <Select
          label=""
          autocomplete
          value={senToken}
          options={
            tokenList
              ? tokenList?.map((item) => {
                  return {
                    value: item.id,
                    label: item.symbol,
                    prefix: (
                      <div
                        key={item.id}
                        style={{ height: '100%', display: 'flex', alignItems: 'center' }}
                      >
                        <StyledImg src={item.logo_url} />
                      </div>
                    ),
                  }
                })
              : []
          }
          placeholder="Select Token"
          onChange={(e) => {
            setSenToken(e.target.value)
            console.log('checkToken=>', e.target.value)
          }}
        /> */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Label>Send Amount</Label>
          {!!BalanceNum && (
            <MaxButtonStyle
              onClick={() => {
                setSendAmount(BalanceNum?.toString())
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
            // const balance = network?.amount
            const balance = BalanceNum
            if (!value || !Number.isNaN(value)) {
              if (balance && Number(value) >= Number(balance)) {
                setSendAmount(BalanceNum.toString())
              } else {
                setSendAmount(value)
              }
            }
          }}
        />

        <Row>
          <BackButton onClick={onDismiss}>Close</BackButton>
          <NextButton
            // disabled={!BalanceNum || !sendAmount || !receiveAddress || !isAddress(receiveAddress)}
            onClick={() => SendTokenCallback()}
          >
            Send
          </NextButton>
        </Row>
      </Container>
    </>
  )
}
export default SendToken
