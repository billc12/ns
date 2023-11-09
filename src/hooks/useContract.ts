import { ERC20, ERC721, ETHRegistrarController } from '@myclique/awnsjs/generated/index'
import { useEffect, useState } from 'react'
import { useSigner } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { erc20ContractAddress, erc721ContractAddress } from '@app/utils/constants'

export const useEthRegistrarControllerContract = () => {
  const [contract, setContract] = useState<ETHRegistrarController>()
  const ens = useEns()
  const signer = useSigner()

  useEffect(() => {
    const func = async () => {
      const ethRegistrarController = await ens.contracts?.getEthRegistrarController()
      if (signer.data) {
        const controller = ethRegistrarController?.connect(signer.data)
        setContract(controller)
        return
      }
      setContract(ethRegistrarController)
    }
    func()
  }, [ens.contracts, signer.data])

  return contract
}

export const useErc20Contract = (contractAddress?: string) => {
  const contractsAddress = contractAddress || erc20ContractAddress
  const [contract, setContract] = useState<ERC20>()
  const ens = useEns()
  const signer = useSigner()

  useEffect(() => {
    const func = async () => {
      const Erc20Controller = await ens.contracts?.getEth20Controller(undefined, contractsAddress)
      if (signer.data) {
        const controller = Erc20Controller?.connect(signer.data)
        setContract(controller)
        return
      }
      setContract(Erc20Controller)
    }
    func()
  }, [contractsAddress, ens.contracts, signer.data])
  return contract
}

export const useErc721Contract = () => {
  const [contract, setContract] = useState<ERC721>()
  const ens = useEns()
  const signer = useSigner()

  useEffect(() => {
    const func = async () => {
      const Erc721Controller = await ens.contracts?.getEth721Controller(
        undefined,
        erc721ContractAddress,
      )
      if (signer.data) {
        const controller = Erc721Controller?.connect(signer.data)
        setContract(controller)
        return
      }
      setContract(Erc721Controller)
    }
    func()
  }, [ens.contracts, signer.data])
  return contract
}
