import { EthAddress } from '@app/types'

export const emptyAddress = '0x0000000000000000000000000000000000000000'

export const networkName = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1': 'mainnet',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '5': 'goerli',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '4': 'rinkeby',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '3': 'ropsten',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1337': 'local',
}

export const SUPPORT_NETWORK_CHAIN_IDS = process.env.NEXT_PUBLIC_SUPPORT_NETWORK_CHAIN_IDS?.split(
  ',',
).map((v) => Number(v)) || [1]

export const ENV_NAME = process.env.NEXT_PUBLIC_ENV_NAME
interface ResolverAddresses {
  [key: string]: EthAddress[]
}

// Ordered by recency
export const RESOLVER_ADDRESSES: ResolverAddresses = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1': [
    '0xcDF8b8c6b2EfFB31C49eC3463922745bd3a7f153',
    // '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
    // '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    // '0xdaaf96c344f63131acadd0ea35170e7892d3dfba',
    // '0x226159d592e2b063810a10ebf6dcbada94ed68b8',
    // '0x1da022710df5002339274aadee8d58218e9d6ab5',
  ],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '5': [
    '0x82E7c62a8AaFe16675cd78Dc6c31e950548B6A85',
    // '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750',
    // '0x342cf18D3e41DE491aa1a3067574C849AdA6a2Ad',
    // '0x19c2d5D0f035563344dBB7bE5fD09c8dad62b001',
    // '0x2800Ec5BAB9CE9226d19E0ad5BC607e3cfC4347E',
    // '0x121304143ea8101e69335f309e2062d299a234b5',
    // '0xff77b96d6bafcec0d684bb528b22e0ab09c70663',
    // '0x6e1b40ed2d626b97a43d2c12e48a6de49a03c7a4',
    // '0xc1ea41786094d1fbe5aded033b5370d51f7a3f96',
    // '0xbbe3fd189d18c8b73ba54e9dd01f89e6b3ee71f0',
    // '0x4B1488B7a6B320d2D721406204aBc3eeAa9AD329',
  ],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '11155111': [
    '0x7c4686a888b1379602e0801Cc9e3cA92CE5001ee',
    // '0x0CeEC524b2807841739D3B5E161F5bf1430FFA48',
  ],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1337': [
    '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF',
    '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750', // This is fill in resolver. Not actual contract address
    '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB',
  ],
}

export const NAMEWRAPPER_AWARE_RESOLVERS: ResolverAddresses = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1': ['0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63'],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '5': [
    '0x58f9Aa6fac4B10EEE280941B64F0E8BCB07A81C7',
    // '0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750',
    // '0x342cf18D3e41DE491aa1a3067574C849AdA6a2Ad',
    // '0x19c2d5D0f035563344dBB7bE5fD09c8dad62b001',
  ],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '11155111': ['0xc83DF738787589D9d31C4736aB10009827b2B954'],
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1337': ['0x0E801D84Fa97b50751Dbf25036d067dCf18858bF'],
}

export const RESOLVER_INTERFACE_IDS = {
  addrInterfaceId: '0x3b3b57de',
  txtInterfaceId: '0x59d1d43c',
  contentHashInterfaceId: '0xbc1c58d1',
}

export const GRACE_PERIOD = 90 * 24 * 60 * 60 * 1000

export const MOONPAY_WORKER_URL: { [key: number]: string } = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  1: 'https://moonpay-worker.ens-cf.workers.dev',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  5: 'https://moonpay-worker-goerli.ens-cf.workers.dev',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  1337: 'https://moonpay-goerli.ens-cf.workers.dev',
}

export const FAUCET_WORKER_URL = 'https://ens-faucet.ens-cf.workers.dev'

export const WC_PROJECT_ID = '9b14144d470af1e03ab9d88aaa127332'

// 102% of price as buffer for fluctuations
export const CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE = 100

export const erc721ContractAddress = '0xA88621fa6294cE857f9744f56781B160e13Ba38B'
// 11155111: '0x8F116BEFAf0a26E1B9e4Dd29F85EA1f48a7a0Ff2'

export const erc20ContractAddress = '0x1b29eaE4be4811bB314237cC63FCDec23EF3fc27'
// 11155111: '0xcFC0398D38B6F19AB110B98EE97e5689936cAff0'
