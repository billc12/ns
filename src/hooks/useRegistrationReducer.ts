import { childFuseObj } from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import {
  RegistrationReducerAction,
  RegistrationReducerData,
  RegistrationReducerDataItem,
  SelectedItemProperties,
} from '@app/components/pages/profile/[name]/registration/types'
import { useLocalStorageReducer } from '@app/hooks/useLocalStorage'
import { emptyAddress } from '@app/utils/constants'

import { useChainId } from './useChainId'

export const randomSecret = () => {
  // the first 4 bytes of the namehash of enslabs.eth
  const platformSource = '9923eb94'
  // v3
  const version = '00000003'
  const bytes = Buffer.allocUnsafe(24)
  return `0x${platformSource}${version}${window.crypto.getRandomValues(bytes).toString('hex')}`
}

const defaultData: RegistrationReducerDataItem = {
  stepIndex: 0,
  queue: ['pricing', 'info', 'transactions', 'confirm', 'complete'],
  years: 1,
  reverseRecord: false,
  records: [],
  clearRecords: false,
  resolver: '',
  permissions: childFuseObj,
  secret: '',
  started: false,
  address: '',
  name: '',
  isMoonpayFlow: false,
  externalTransactionId: '',
  chainId: 1,
  discount: '1000000000000000000',
  discountCode: '0',
  discountCount: 0,
  referral: '',
  timestamp: 0,
  signature: '',
  premium: false,
  booker: emptyAddress,
  discountBinding: emptyAddress,
}

const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

const makeDefaultData = (selected: SelectedItemProperties): RegistrationReducerDataItem => ({
  stepIndex: 0,
  queue: ['pricing', 'info', 'transactions', 'confirm', 'complete'],
  years: 1,
  reverseRecord: false,
  records: [],
  resolver: '',
  permissions: childFuseObj,
  secret: randomSecret(),
  started: false,
  isMoonpayFlow: false,
  externalTransactionId: '',
  discount: '1000000000000000000',
  discountCode: '0',
  discountCount: 0,
  referral: '',
  timestamp: 0,
  signature: '',
  premium: false,
  booker: emptyAddress,
  discountBinding: emptyAddress,
  ...selected,
})

export const getSelectedIndex = (
  state: RegistrationReducerData,
  selected: SelectedItemProperties,
) =>
  state.items.findIndex(
    (x) =>
      x.address === selected.address && x.name === selected.name && x.chainId === selected.chainId,
  )

/* eslint-disable no-param-reassign */
const reducer = (state: RegistrationReducerData, action: RegistrationReducerAction) => {
  let selectedItemInx = getSelectedIndex(state, action.selected)

  if (!isBrowser) return

  if (selectedItemInx === -1) {
    selectedItemInx = state.items.push(makeDefaultData(action.selected)) - 1
  }

  const item = state.items[selectedItemInx]

  switch (action.name) {
    case 'clearItem': {
      state.items.splice(selectedItemInx, 1)
      break
    }
    case 'resetItem': {
      state.items[selectedItemInx] = makeDefaultData(action.selected)
      break
    }
    case 'resetSecret': {
      item.secret = randomSecret()
      break
    }
    case 'setQueue': {
      item.queue = action.payload
      break
    }
    case 'decreaseStep': {
      if (item.queue[item.stepIndex - 1] === 'profile') {
        item.stepIndex -= 2
      } else {
        item.stepIndex -= 1
      }
      break
    }
    case 'increaseStep': {
      if (item.queue[item.stepIndex + 1] === 'profile') {
        item.stepIndex += 2
      } else if (
        item.queue[item.stepIndex + 1] === 'transactions' ||
        item.queue[item.stepIndex + 1] === 'confirm'
      ) {
        item.stepIndex = item.queue.length - 1
      } else {
        item.stepIndex += 1
      }

      break
    }
    case 'lastStep': {
      const index = item.queue.findIndex((t) => t === 'complete')
      item.stepIndex = index
      break
    }
    case 'setPricingData': {
      item.years = action.payload.years
      item.reverseRecord = action.payload.reverseRecord
      item.discount = action.payload.discount
      item.discountCode = action.payload.discountCode
      item.discountCount = action.payload.discountCount
      item.referral = action.payload.referral
      item.signature = action.payload.signature
      item.timestamp = action.payload.timestamp
      item.booker = action.payload.booker
      item.premium = action.payload.premium
      break
    }
    case 'setTransactionsData': {
      item.secret = action.payload.secret
      item.started = action.payload.started
      break
    }
    case 'setStarted': {
      item.started = true
      break
    }
    case 'setProfileData': {
      if (action.payload.records) item.records = action.payload.records
      if (action.payload.permissions) item.permissions = action.payload.permissions
      if (action.payload.resolver) item.resolver = action.payload.resolver
      break
    }
    case 'setExternalTransactionId': {
      item.isMoonpayFlow = true
      item.externalTransactionId = action.externalTransactionId
      break
    }
    case 'moonpayTransactionCompleted': {
      item.externalTransactionId = ''
      item.stepIndex = item.queue.findIndex((step) => step === 'complete')
      break
    }
    // no default
  }
}
/* eslint-enable no-param-reassign */

const useRegistrationReducer = ({
  address,
  name,
}: {
  address: string | undefined
  name: string
}) => {
  const chainId = useChainId()
  const selected = { address: address!, name, chainId } as const
  const [state, dispatch] = useLocalStorageReducer<
    RegistrationReducerData,
    RegistrationReducerAction
  >('registration-status', reducer, { items: [] })

  let item = defaultData
  if (isBrowser) {
    const itemIndex = getSelectedIndex(state, selected)
    item = itemIndex === -1 ? makeDefaultData(selected) : state.items[itemIndex]
  }

  return { state, dispatch, item, selected }
}

export default useRegistrationReducer
