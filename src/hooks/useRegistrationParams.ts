import { ChildFuses } from '@myclique/awnsjs'
import { BaseRegistrationParams } from '@myclique/awnsjs/utils/registerHelpers'
import { useMemo } from 'react'

import { profileRecordsToRecordOptions } from '@app/components/pages/profile/[name]/registration/steps/Profile/profileRecordUtils'
import { RegistrationReducerDataItem } from '@app/components/pages/profile/[name]/registration/types'
import { yearsToSeconds } from '@app/utils/utils'

type Props = {
  name: string
  owner: string
  registrationData: Pick<
    RegistrationReducerDataItem,
    | 'years'
    | 'resolver'
    | 'secret'
    | 'records'
    | 'clearRecords'
    | 'permissions'
    | 'reverseRecord'
    | 'discount'
    | 'discountCode'
    | 'discountCount'
    | 'timestamp'
    | 'referral'
    | 'signature'
    | 'booker'
    | 'premium'
    | 'discountBinding'
    | 'maxDeduct'
    | 'minLimit'
  >
}

const useRegistrationParams = ({ name, owner, registrationData }: Props) => {
  const registrationParams: BaseRegistrationParams & { name: string; signature: string } = useMemo(
    () => ({
      name,
      owner,
      duration: yearsToSeconds(registrationData.years),
      resolverAddress: registrationData.resolver,
      secret: registrationData.secret,
      records: profileRecordsToRecordOptions(
        registrationData.records,
        registrationData.clearRecords,
      ),
      fuses: {
        named: registrationData.permissions
          ? (Object.keys(registrationData.permissions).filter(
              (key) => !!registrationData.permissions?.[key as ChildFuses['fuse']],
            ) as ChildFuses['fuse'][])
          : [],
        unnamed: [],
      },
      reverseRecord: registrationData.reverseRecord,
      discount: registrationData.discount,
      discountCode: registrationData.discountCode,
      discountCount: registrationData.discountCount,
      referral: registrationData.referral,
      timestamp: registrationData.timestamp,
      signature: registrationData.signature,
      booker: registrationData.booker,
      premium: registrationData.premium,
      discountBinding: registrationData.discountBinding,
      maxDeduct: registrationData.maxDeduct,
      minLimit: registrationData.minLimit,
    }),
    [owner, name, registrationData],
  )

  return registrationParams
}

export default useRegistrationParams
