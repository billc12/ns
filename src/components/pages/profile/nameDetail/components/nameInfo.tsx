import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Dropdown, mq } from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import AssetsIcon from '@app/assets/AssetsIcon.svg'
import ListWhiteIcon from '@app/assets/List-white.svg'
import OmitIcon from '@app/assets/OmitIcon.svg'
import SwordIcon from '@app/assets/SwordIcon.svg'
import TestImg from '@app/assets/TestImage.png'
import Icon1 from '@app/assets/nameDetail/icon1.svg'
import Icon3 from '@app/assets/nameDetail/icon3.svg'
import Icon4 from '@app/assets/nameDetail/icon4.svg'
import InformationDrawer from '@app/components/Awns/Drawer/Information'
import { CopyButton } from '@app/components/Copy'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProfileActions } from '@app/hooks/useProfileActions'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { shouldShowExtendWarning } from '@app/utils/abilities/shouldShowExtendWarning'
import { shortenAddress } from '@app/utils/utils'

import { useEthInvoice } from '../../[name]/registration/steps/Awns_Complete'
import ReceiveBtn from '../children/Receive'
import SendNFTBtn from '../children/SendNFT'
import SendTokenBtn from '../children/SendToken'
import TokenInfo from '../children/TokenInfo'

const CenterLeftStyle = styled.div`
  border-radius: 10px;
  border: 1px solid var(--line, #d4d7e2);
  background: #fff;
  box-shadow: 0 4px 14px 0 rgba(40, 79, 115, 0.1);
  width: 430px;
  height: 700px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 10px;
  ${mq.sm.max(css`
    width: 100%;
    height: auto;
  `)}
`
const HeaderStyle = styled.div`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  display: flex;
  height: 32px;
`
const OmitButtonStyle = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 6px;
  border: 1px solid #97b7ef;
  background: #f8fbff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
const NameStyle = styled.div`
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 24px;
  font-weight: 700;
`
const TabIconStyle = styled.div`
  width: 58px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 6px;
  border: 1px solid var(--button-line, #97b7ef);
  background: var(--light-bg, #f8fbff);
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 0 4px;
  cursor: pointer;
`

const ListWhiteStyled = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 4px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  & svg > path {
    fill: #97b7ef;
  }
  &.select {
    background: #97b7ef;
    & svg > path {
      fill: #fff;
    }
  }
`

const ProFileStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`
const StyledImg = styled.img(
  () => css`
    width: 112px;
    height: 112px;
    border-radius: 8px;
  `,
)

const AddressStyle = styled.div`
  width: 180px;
  height: 32px;
  border-radius: 6px;
  background: #f8fbff;
  color: #3f5170;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`

const AssetsItemStyle = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 18px;
  font-weight: 700;
`

const AddressBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
`
export const AuctionTitle = styled.p`
  color: #3f5170;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 125% */
`
export const AuctionBtn = styled(Button)`
  width: 123px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #d4d7e2;
  background: #fff;
  padding: 0;
`
const ActionDropdownStyle = styled(Dropdown)`
  border-radius: 8px;
  border: 1px solid var(--button-line, #97b7ef);
  background: #fff;
  color: #3f5170;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  & button:hover {
    background: #f8fbff !important;
  }
`
const Round = styled.div`
  display: flex;
  flex: 1;
  border-radius: 10px;
  background: #f8fbff;
  padding: 8px 20px 13px;
  gap: 7px;
  flex-direction: column;
`
const RoundTitle1 = styled.p`
  color: #3f5170;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`
const RoundTitle2 = styled.p`
  color: #3f5170;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
`
const ActionDropdown = ({ name }: { name: string }) => {
  const { address } = useAccount()
  const nameDetails = useNameDetails(name)
  const { profile, ownerData, wrapperData, expiryDate } = nameDetails
  const abilities = useAbilities(name)
  const profileActions = useProfileActions({
    address,
    name,
    profile,
    abilities: abilities.data,
    ownerData,
    wrapperData,
    expiryDate,
  })
  const [isOpen, setIsOpen] = useState(false)
  const { prepareDataInput } = useTransactionFlow()
  const showSendNameInput = prepareDataInput('AwnsSendName')
  const handleSend = () => {
    showSendNameInput(`send-name-${name}`, {
      name,
    })
  }
  const showSetPrimaryNameInput = prepareDataInput('SetPrimaryName')
  const handleSelectPrimaryName = () => {
    if (address && name) {
      showSetPrimaryNameInput(`edit-resolve-address-${name}`, { address, name })
    }
  }
  const showExtendNamesInput = prepareDataInput('AwnsExtendNames')
  const handleExtend = () => {
    showExtendNamesInput(`extend-names-${name}`, {
      names: [name],
      isSelf: shouldShowExtendWarning(abilities.data),
    })
  }
  const dropdownItems = useMemo<DropdownItem[]>(() => {
    console.log('profileActions.canSetMainName', abilities.data, name)

    const items = [] as DropdownItem[]
    if (profileActions.canSetMainName) {
      items.push({
        label: 'Set as main address',
        onClick: () => handleSelectPrimaryName(),
        color: 'text',
      })
    }
    if (abilities.data.canExtend) {
      items.push({
        label: 'Extend',
        onClick: handleExtend,
        color: 'text',
      })
    }
    if (abilities.data.canSend) {
      items.push({
        label: 'Transfer',
        onClick: handleSend,
        color: 'text',
      })
    }
    items.push({
      label: 'Information',
      onClick: () => setIsOpen(true),
      color: 'text',
    })
    return items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abilities.data, name, profileActions.canSetMainName])

  return (
    <>
      <ActionDropdownStyle align="left" items={dropdownItems} label="Account" width="182px">
        <OmitButtonStyle>
          <OmitIcon />
        </OmitButtonStyle>
      </ActionDropdownStyle>
      <InformationDrawer open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
const NameTokenCard = ({
  avatarSrc,
  accountAddress,
  name,
}: {
  avatarSrc: string
  accountAddress: string
  name: string
}) => {
  return (
    <ProFileStyle>
      <AddressBox>
        <StyledImg src={avatarSrc || TestImg.src} />
        <AddressStyle>
          {shortenAddress(accountAddress)}
          <CopyButton value={accountAddress} />
        </AddressStyle>
      </AddressBox>
      <div
        style={{
          display: 'flex',
          gap: 32,
        }}
      >
        <AssetsItemStyle>
          <AssetsIcon />
          $100.00
        </AssetsItemStyle>
        <AssetsItemStyle>
          <Icon1 />
          12
        </AssetsItemStyle>
        <AssetsItemStyle>
          <SwordIcon />4
        </AssetsItemStyle>
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        <ReceiveBtn accountAddress={accountAddress} />
        <Dropdown
          shortThrow
          align="left"
          items={[
            <div>
              <SendTokenBtn accountAddress={accountAddress} _name={name} />
            </div>,
            <div>
              <SendNFTBtn accountAddress={accountAddress} _name={name} />
            </div>,
          ]}
        >
          <AuctionBtn prefix={<Icon3 />}>
            <AuctionTitle>Send</AuctionTitle>
          </AuctionBtn>
        </Dropdown>
        <AuctionBtn prefix={<Icon4 />}>
          <AuctionTitle>Connect</AuctionTitle>
        </AuctionBtn>
      </div>

      <div>
        <TokenInfo accountAddress={accountAddress} />
      </div>
    </ProFileStyle>
  )
}
const NameInfoCard = ({ avatarSrc }: { avatarSrc: string }) => {
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img style={{ width: 382, height: 382, borderRadius: 8 }} src={avatarSrc} alt="default img" />
      <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
        <Round>
          <RoundTitle1>Head Armor</RoundTitle1>
          <RoundTitle2>Linen Hood</RoundTitle2>
        </Round>
        <Round>
          <RoundTitle1>Foot Armor</RoundTitle1>
          <RoundTitle2>Shoes</RoundTitle2>
        </Round>
      </div>
    </div>
  )
}
enum Tabs {
  Token = 'Token',
  NameInfo = 'NameInfo',
}
const Page = ({ accountAddress, _name }: { accountAddress: string; _name: string }) => {
  const { avatarSrc = TestImg.src } = useEthInvoice(_name, false)
  const [curTab, setCurTab] = useState(Tabs.Token)
  return (
    <CenterLeftStyle>
      <HeaderStyle>
        <ActionDropdown name={_name} />
        <NameStyle>{_name || '--'}</NameStyle>

        <TabIconStyle>
          <ListWhiteStyled
            onClick={() => setCurTab(Tabs.Token)}
            className={curTab === Tabs.Token ? 'select' : ''}
          >
            <ListWhiteIcon />
          </ListWhiteStyled>
          <ListWhiteStyled
            onClick={() => setCurTab(Tabs.NameInfo)}
            className={curTab === Tabs.NameInfo ? 'select' : ''}
          >
            <SwordIcon />
          </ListWhiteStyled>
        </TabIconStyle>
      </HeaderStyle>
      {curTab === Tabs.Token && (
        <NameTokenCard name={_name} accountAddress={accountAddress} avatarSrc={avatarSrc} />
      )}
      {curTab === Tabs.NameInfo && <NameInfoCard avatarSrc={avatarSrc} />}
    </CenterLeftStyle>
  )
}

export default Page
