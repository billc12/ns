// import { isAddress } from '@ethersproject/address'
import { isAddress } from '@ethersproject/address'
import { TokenboundClient } from '@tokenbound/sdk'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useBalance, useSigner } from 'wagmi'

import { Input, Select, Typography, mq } from '@ensdomains/thorin'

import ETHImg from '@app/assets/ETH-img.png'
import USDTImg from '@app/assets/USDT.png'
import { NextButton } from '@app/components/Awns/Dialog'
import { useChainId } from '@app/hooks/useChainId'
// import useGetTokenList from '@app/hooks/requst/useGetTokenList'
import { useNameErc20Assets } from '@app/hooks/useNameDetails'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { makeDisplay } from '@app/utils/currency'
import isZero from '@app/utils/isZero'

import DrawerModel from '.'

export type SendAddressProps = {
  address: string | undefined
  name: string | undefined
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
  const signer = useSigner()

  const { tokenBalance, tokenSymbol, tokenName, contractAddress, decimals } =
    useNameErc20Assets(address)
  const { data: balance } = useBalance({ address: address as `0x${string}` | undefined })

  const [receiveAddress, setReceiveAddress] = useState<string>('')
  const [sendAmount, setSendAmount] = useState<string>('')
  const [senToken, setSenToken] = useState<string>('')
  const chainId = useChainId()

  const checkToken: { tokenBalance: number; tokenSymbol: string | undefined } | undefined =
    useMemo(() => {
      if (contractAddress && contractAddress === senToken) {
        return {
          tokenBalance: Number(tokenBalance?.slice(0, -3)),
          tokenSymbol,
        }
      }
      if (senToken && isZero(senToken)) {
        return {
          tokenBalance: Number(
            makeDisplay(balance?.value!, undefined, 'eth', balance?.decimals).slice(0, -3),
          ),
          tokenSymbol: balance?.symbol,
        }
      }
      return undefined
    }, [
      balance?.decimals,
      balance?.symbol,
      balance?.value,
      contractAddress,
      senToken,
      tokenBalance,
      tokenSymbol,
    ])

  const tokenboundClient = new TokenboundClient({
    signer: signer.data,
    chainId,
    implementationAddress: '0x2d25602551487c3f3354dd80d76d54383a243358',
    registryAddress: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
  })

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
        erc20tokenAddress: contractAddress as `0x${string}`,
        erc20tokenDecimals: decimals,
      })
      console.log('senToken=>', erc20Res)
    }
  }

  return (
    <DrawerModel open={open} onClose={onClose} title="Send Assets">
      <Container>
        <Label>To Account</Label>
        <CodeInput
          hideLabel
          label
          placeholder="Ethereum address(0x) or ENS"
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
          <Label>Assets</Label>
          {senToken && (
            <Label>
              Balance:{checkToken?.tokenBalance || '0.00'} {checkToken?.tokenSymbol || '--'}
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
                <div style={{ height: 16, width: 16 }}>
                  <StyledImg src={USDTImg.src} />
                </div>
              ),
            },
            {
              value: '0x0000000000000000000000000000000000000000',
              label: 'SepoliaETH',
              prefix: (
                <div style={{ height: 16, width: 16 }}>
                  <StyledImg src={ETHImg.src} />
                </div>
              ),
            },
          ]}
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
          {!!senToken && checkToken && (
            <MaxButtonStyle
              onClick={() => {
                setSendAmount(checkToken.tokenBalance.toString())
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
            if (!value || !isNaN(Number(value))) {
              if (checkToken?.tokenBalance && Number(value) >= Number(checkToken.tokenBalance)) {
                setSendAmount(checkToken.tokenBalance.toString())
              } else {
                setSendAmount(value)
              }
            }
          }}
        />

        <Row>
          <NextButton
            disabled={
              !checkToken?.tokenBalance ||
              !sendAmount ||
              !receiveAddress ||
              !isAddress(receiveAddress)
            }
            onClick={() => SendTokenCallback()}
          >
            Send
          </NextButton>
        </Row>
      </Container>
    </DrawerModel>
  )
}
export default Page