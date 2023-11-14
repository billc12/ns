import { ChainId } from '@app/hooks/useChainId'

const explorers = {
  etherscan: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },

  blockscout: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/tokens/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },

  harmony: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/address/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },

  okex: (link: string, data: string, type: 'transaction' | 'token' | 'address' | 'block') => {
    switch (type) {
      case 'transaction':
        return `${link}/tx/${data}`
      case 'token':
        return `${link}/tokenAddr/${data}`
      default:
        return `${link}/${type}/${data}`
    }
  },
}

export enum DateType {
  YYMM = 'yy-mm',
  YYMMDD = 'yy-mm-dd',
  YYMMDDHHMM = 'yy-mm-dd-hh-mm',
  YYMMDDHHMMSS = 'yy-mm-dd-hh-mm-ss',
}
interface ChainObject {
  [chainId: number]: {
    link: string
    builder: (
      chainName: string,
      data: string,
      type: 'transaction' | 'token' | 'address' | 'block',
    ) => string
  }
}

const chains: ChainObject = {
  [ChainId.MAINNET]: {
    link: 'https://etherscan.io',
    builder: explorers.etherscan,
  },
  [ChainId.GOERLI]: {
    link: 'https://goerli.etherscan.io',
    builder: explorers.etherscan,
  },
}

export function timestampToDateFormat(timestamp: any, type: string, mul?: number) {
  const date = new Date(mul ? timestamp * mul : timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  if (DateType.YYMM === type) {
    return `${year}-${month}`
  }
  if (DateType.YYMMDD === type) {
    return `${year}-${month}-${day}`
  }
  if (DateType.YYMMDDHHMM === type) {
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }
  if (DateType.YYMMDDHHMMSS === type) {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}

export function getEtherscanLink(
  chainId: number,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block',
): string {
  const chain = chains[chainId]
  return chain.builder(chain.link, data, type)
}

export function DateTime(dayNumber?: number) {
  const day = 60 * 60 * 24 * 1000
  return dayNumber ? day * dayNumber : day
}
