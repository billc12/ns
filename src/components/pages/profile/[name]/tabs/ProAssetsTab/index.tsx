import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import { AssetsTab } from './AssetsTab'
import { HistoryTab } from './HistoryTab'
import { NftTab } from './NftTab'

const TabButtonContainer = styled.div(
  ({ theme }) => css`
    height: 40px;
    width: 468px;
    padding: 5px;
    display: flex;
    margin-top: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-gap: ${theme.space['6']};
    border-radius: 6px;
    background: #f2f6fc;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    ${mq.sm.max(css`
      width: auto;
    `)}
  `,
)

const TabButton = styled.button<{ $selected: boolean }>(
  ({ theme, $selected }) => css`
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    border-radius: 4px;
    background: ${$selected ? '#fff' : 'none'};
    font-weight: ${$selected ? 600 : 400};
    color: ${$selected ? '#0049C6' : '#97B7EF'};
    font-size: 14px;
    transition: all 0.15s ease-in-out;
    height: 32px;
    width: 150px;
    cursor: pointer;
    &:hover {
      color: ${$selected ? theme.colors.accentBright : '#0049C6'};
    }
    ${mq.sm.max(css`
      width: 80px;
    `)}
  `,
)

const tabs = ['assets', 'nft', 'history'] as const
type Tab = typeof tabs[number]

export const ProflieAssetsTab = ({ name }: { name: string }) => {
  const { t } = useTranslation('profile')
  const [tab, setTab] = useState<Tab>('assets')

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <TabButtonContainer>
          {tabs.map((tabItem) => (
            <TabButton
              key={tabItem}
              data-testid={`${tabItem}-tab`}
              $selected={tabItem === tab}
              onClick={() => setTab(tabItem)}
            >
              {t(`tabs.assets.${tabItem}.name`)}
            </TabButton>
          ))}
        </TabButtonContainer>
      </div>
      {tab === 'assets' && <AssetsTab name={name} />}
      {tab === 'nft' && <NftTab name={name} />}
      {tab === 'history' && <HistoryTab name={name} />}
    </>
  )
}
