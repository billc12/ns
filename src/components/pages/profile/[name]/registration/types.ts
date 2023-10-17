import { ChildFuses } from '@myclique/awnsjs'

import { ProfileRecord } from '@app/constants/profileRecordOptions'

import { DisInfo } from './steps/Pricing/DiscountCodeLabel'

export type RegistrationStep =
  | 'pricing'
  | 'profile'
  | 'info'
  | 'transactions'
  | 'confirm'
  | 'complete'

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export enum PaymentMethod {
  ethereum = 'ethereum',
  moonpay = 'moonpay',
}
type DiscountCode = DisInfo & { referral: string }
export type RegistrationStepData = {
  pricing: {
    years: number
    reverseRecord: boolean
    paymentMethodChoice: PaymentMethod | ''
  } & DiscountCode
  profile: {
    records: ProfileRecord[]
    clearRecords?: boolean
    resolver?: string
    permissions?: ChildFuses['current']
  }
  info: {}
  transactions: {
    secret: string
    started: boolean
  }
  confirm: {}
  complete: {}
}

export type BackObj = { back: boolean }

export type RegistrationData = Prettify<UnionToIntersection<RegistrationStepData[RegistrationStep]>>

export type SelectedItemProperties = { address: string; name: string; chainId: number }

export type RegistrationReducerDataItem = Prettify<
  Omit<RegistrationData, 'paymentMethodChoice'> & {
    stepIndex: number
    queue: RegistrationStep[]
    isMoonpayFlow: boolean
    externalTransactionId: string
  } & SelectedItemProperties
>

export type RegistrationReducerData = {
  items: RegistrationReducerDataItem[]
}

export type RegistrationReducerAction =
  | {
      name: 'increaseStep'
      selected: SelectedItemProperties
    }
  | {
      name: 'decreaseStep'
      selected: SelectedItemProperties
    }
  | {
      name: 'setQueue'
      selected: SelectedItemProperties
      payload: RegistrationStep[]
    }
  | {
      name: 'setPricingData'
      selected: SelectedItemProperties
      payload: Omit<RegistrationStepData['pricing'], 'paymentMethodChoice'>
    }
  | {
      name: 'setProfileData'
      selected: SelectedItemProperties
      payload: RegistrationStepData['profile']
    }
  | {
      name: 'setTransactionsData'
      selected: SelectedItemProperties
      payload: RegistrationStepData['transactions']
    }
  | {
      name: 'clearItem'
      selected: SelectedItemProperties
    }
  | {
      name: 'setStarted'
      selected: SelectedItemProperties
    }
  | {
      name: 'resetItem'
      selected: SelectedItemProperties
    }
  | {
      name: 'resetSecret'
      selected: SelectedItemProperties
    }
  | {
      name: 'setExternalTransactionId'
      selected: SelectedItemProperties
      externalTransactionId: string
    }
  | {
      name: 'moonpayTransactionCompleted'
      selected: SelectedItemProperties
    }

export type MoonpayTransactionStatus = 'pending' | 'completed' | 'failed' | 'waitingAuthorization'
export const MAX_YEAR = 5
export const YEAR_DISCOUNT = [0.0, 0.05, 0.1, 0.15, 0.2]
