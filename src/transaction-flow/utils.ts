import { InternalTransactionFlow } from './types'

export const getSelectedFlowItem = (state: InternalTransactionFlow) => {
  if (!state) return null
  const { selectedKey } = state
  if (!selectedKey) {
    return null
  }
  if (Array.isArray(selectedKey)) {
    return state.items[selectedKey[selectedKey.length - 1]]
  }

  return state.items[selectedKey]
}
