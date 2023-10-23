import { ETHRegistrarController } from '@myclique/awnsjs/generated/index'
import { useEffect, useState } from 'react'
import { useSigner } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'

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
