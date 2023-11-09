import { TransactionDialogPassthrough } from '../types'

export type SendAddressProps = {
  address: string | undefined
  name: string | undefined
}
export type Props = {
  data: SendAddressProps
} & TransactionDialogPassthrough

const SendNFT = () => {
  return (
    <>
      <div />
    </>
  )
}
export default SendNFT
