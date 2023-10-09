import TimeIcon from '@app/assets/TimeIcon.svg'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { shouldShowExtendWarning } from '@app/utils/abilities/shouldShowExtendWarning'

import { ButtonStyle } from './StyleComponent'

const Extend = ({ name }: { name: string }) => {
  const key = `extend-names-${name}`
  const { prepareDataInput, getLatestTransaction, resumeTransactionFlow } = useTransactionFlow()
  const abilities = useAbilities(name)
  const transactionStage = getLatestTransaction(key)?.stage
  const loading = !!(transactionStage && transactionStage === 'sent')
  const showExtendNamesInput = prepareDataInput('AwnsExtendNames')
  const handleExtend = () => {
    if (loading) {
      resumeTransactionFlow(key)
    }
    showExtendNamesInput(key, {
      names: [name],
      isSelf: shouldShowExtendWarning(abilities.data),
    })
  }
  return (
    <ButtonStyle
      // $loading={loading}
      onClick={handleExtend}
      colorStyle="background"
      prefix={<TimeIcon />}
      // loading={loading}
    >
      Extend
    </ButtonStyle>
  )
}
export default Extend
