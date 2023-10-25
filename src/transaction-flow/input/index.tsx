import dynamic from 'next/dynamic'
import { useContext, useEffect } from 'react'

import DynamicLoadingContext from '@app/components/@molecules/TransactionDialogManager/DynamicLoadingContext'

import TransactionLoader from '../TransactionLoader'
import type { Props as AdvancedEditorProps } from './AdvancedEditor/AdvancedEditor-flow'
import type { Props as BurnFusesProps } from './BurnFuses/BurnFuses-flow'
import type { Props as CreateSubnameProps } from './CreateSubname-flow'
import type { Props as DeleteEmancipatedSubnameWarningProps } from './DeleteEmancipatedSubnameWarning/DeleteEmancipatedSubnameWarning-flow'
import type { Props as DeleteSubnameNotParentWarningProps } from './DeleteSubnameNotParentWarning/DeleteSubnameNotParentWarning-flow'
import type { Props as DiscountCodeProps } from './DiscountCode-flow'
import type { Props as EditResolverProps } from './EditResolver/EditResolver-flow'
import type { Props as ExtendNamesProps } from './ExtendNames/ExtendNames-flow'
import type { Props as InvitationNameProps } from './InvitationName-flow'
import type { Props as ProfileEditorProps } from './ProfileEditor/ProfileEditor-flow'
import type { Props as ReceiveAssetsProps } from './ReceiveAssets-flow'
import type { Props as ResetPrimaryNameProps } from './ResetPrimaryName/ResetPrimaryName-flow'
import type { Props as RevokePermissionsProps } from './RevokePermissions/RevokePermissions-flow'
import type { Props as SelectPrimaryNameProps } from './SelectPrimaryName/SelectPrimaryName-flow'
import type { Props as SetPrimaryNameProps } from './SelectPrimaryName/SetPrimaryName-flow'
import type { Props as SendNFTProps } from './SendNFT-flow'
import type { Props as SendNameProps } from './SendName-flow'
import type { Props as SendTokenProps } from './SendToken-flow'
import type { Props as TransferProfileProps } from './TransferProfile/TransferProfile-flow'
import type { Props as UnknownLabelsProps } from './UnknownLabels/UnknownLabels-flow'

const dynamicHelper = <P,>(name: string) =>
  dynamic<P>(
    () =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackExclude: /\.test.tsx$/ */
        `./${name}-flow`
      ),
    {
      loading: () => {
        /* eslint-disable react-hooks/rules-of-hooks */
        const setLoading = useContext(DynamicLoadingContext)
        useEffect(() => {
          setLoading(true)
          return () => setLoading(false)
        }, [setLoading])
        return <TransactionLoader isComponentLoader />
        /* eslint-enable react-hooks/rules-of-hooks */
      },
    },
  )

const EditResolver = dynamicHelper<EditResolverProps>('EditResolver/EditResolver')
const SelectPrimaryName = dynamicHelper<SelectPrimaryNameProps>(
  'SelectPrimaryName/SelectPrimaryName',
)
const SetPrimaryName = dynamicHelper<SetPrimaryNameProps>('SelectPrimaryName/SetPrimaryName')
const ResetPrimaryName = dynamicHelper<ResetPrimaryNameProps>('ResetPrimaryName/ResetPrimaryName')
const AdvancedEditor = dynamicHelper<AdvancedEditorProps>('AdvancedEditor/AdvancedEditor')
const EditResolveAddress = dynamicHelper<AdvancedEditorProps>('AdvancedEditor/EditResolveAddress')
const ProfileEditor = dynamicHelper<ProfileEditorProps>('ProfileEditor/ProfileEditor')
const CreateSubname = dynamicHelper<CreateSubnameProps>('CreateSubname')
const TransferProfile = dynamicHelper<TransferProfileProps>('TransferProfile/TransferProfile')
const ExtendNames = dynamicHelper<ExtendNamesProps>('ExtendNames/ExtendNames')
const AwnsExtendNames = dynamicHelper<ExtendNamesProps>('ExtendNames/Awns_ExtendNames')
const BurnFuses = dynamicHelper<BurnFusesProps>('BurnFuses/BurnFuses')
const SendName = dynamicHelper<SendNameProps>('SendName')
const SendToken = dynamicHelper<SendTokenProps>('SendToken')
const SendNFT = dynamicHelper<SendNFTProps>('SendNFT')
const ReceiveAssets = dynamicHelper<ReceiveAssetsProps>('ReceiveAssets')
const AwnsSendName = dynamicHelper<SendNameProps>('Awns_SendName')
const RevokePermissions = dynamicHelper<RevokePermissionsProps>(
  'RevokePermissions/RevokePermissions',
)
const UnknownLabels = dynamicHelper<UnknownLabelsProps>('UnknownLabels/UnknownLabels')
const DeleteEmancipatedSubnameWarning = dynamicHelper<DeleteEmancipatedSubnameWarningProps>(
  'DeleteEmancipatedSubnameWarning/DeleteEmancipatedSubnameWarning',
)
const DeleteSubnameNotParentWarning = dynamicHelper<DeleteSubnameNotParentWarningProps>(
  'DeleteSubnameNotParentWarning/DeleteSubnameNotParentWarning',
)
const DiscountCode = dynamicHelper<DiscountCodeProps>('DiscountCode')
const InvitationName = dynamicHelper<InvitationNameProps>('InvitationName')
export const DataInputComponents = {
  EditResolver,
  ProfileEditor,
  AdvancedEditor,
  SelectPrimaryName,
  SetPrimaryName,
  ResetPrimaryName,
  TransferProfile,
  CreateSubname,
  ExtendNames,
  BurnFuses,
  SendName,
  SendToken,
  ReceiveAssets,
  SendNFT,
  RevokePermissions,
  UnknownLabels,
  DeleteEmancipatedSubnameWarning,
  DeleteSubnameNotParentWarning,
  AwnsSendName,
  AwnsExtendNames,
  EditResolveAddress,
  DiscountCode,
  InvitationName,
}

export type DataInputName = keyof typeof DataInputComponents

export type DataInputComponent = typeof DataInputComponents
