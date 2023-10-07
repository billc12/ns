import { useQuery } from 'wagmi'

import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

type ResultItemType = {
  owner: {
    id: string
  }
  preOwner: {
    id: string
  }
  eventTime: number
  transactionID: string
}
type ResultType = {
  wrappedTransfers: ResultItemType[]
}
const query = `
query getTransfers($name: String!) {
  wrappedTransfers(first:10, where:{domain_:{labelName: $name}}){
    owner{
      id
    }
    preOwner{
      id
    }
    eventTime
    transactionID
  }
}

`
const useGetTransfers = (name: string) => {
  const { gqlInstance, ready } = useEns()
  const { data: result } = useQuery(
    useQueryKeys().getTransfers(name),
    async () => {
      try {
        const response = await gqlInstance.client.request<ResultType>(query, {
          name: name.split('.')[0],
        })
        return response?.wrappedTransfers
      } catch (err) {
        console.error(err)
      }
    },
    { enabled: !!name && ready },
  )
  return { result }
}
export default useGetTransfers
