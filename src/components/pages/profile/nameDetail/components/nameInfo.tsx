import router from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Dropdown, Tooltip, Typography, mq } from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import AssetsIcon from '@app/assets/AssetsIcon.svg'
import ListWhiteIcon from '@app/assets/List-white.svg'
import OmitIcon from '@app/assets/OmitIcon.svg'
import SwordIcon from '@app/assets/SwordIcon.svg'
import TestImg from '@app/assets/TestImage.png'
import WonderHighIcon from '@app/assets/Wonder-High.svg'
import WonderWarningIcon from '@app/assets/Wonder-Warning.svg'
import Icon1 from '@app/assets/nameDetail/icon1.svg'
import Icon3 from '@app/assets/nameDetail/icon3.svg'
import Icon4 from '@app/assets/nameDetail/icon4.svg'
import InformationDrawer from '@app/components/Awns/Drawer/InformationDrawer'
import SendNFTDrawer from '@app/components/Awns/Drawer/SendNFTDrawer'
import SendTokenDrawer from '@app/components/Awns/Drawer/SendTokenDrawer'
import { CopyButton } from '@app/components/Copy'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import useGetTokenList from '@app/hooks/requst/useGetTokenList'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useProfileActions } from '@app/hooks/useProfileActions'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { DateTime, DateType, timestampToDateFormat } from '@app/utils'
import { shouldShowExtendWarning } from '@app/utils/abilities/shouldShowExtendWarning'
import { ENV_NAME } from '@app/utils/constants'
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
  width: calc(100% - 95px);
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: var(--word-color, #3f5170);
  font-family: Inter;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  padding: 0 5px 0 31px;
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

const WarningStyle = styled.div`
  width: 100%;
  background-color: rgba(255, 186, 10, 0.18);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  padding: 10px 16px;
  & .classbutton {
    height: 36px;
    width: 85px;
    font-weight: 500;
    color: #c5954f;
    background-color: #fff !important;
    border: 1px solid #f1deab !important;
    font-size: 14px !important;
    :hover {
      background-color: #f5f5f5 !important;
      color: #9f8644;
    }
  }
`

const ExpiredStyle = styled.div`
  margin-top: 20px;
  width: 382px;
  height: 68px;
  border-radius: 10px;
  padding: 8px 12px 12px 20px;
  display: grid;
  gap: 8px;
  .title {
    color: var(--word-color, #3f5170);
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    display: flex;
    gap: 4px;
  }
  .content {
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
  }
  .button {
    width: 68px;
    height: 22px;
    padding: 0 6px;
    border-radius: 4px;
    border: 1px solid var(--button-line, #97b7ef);
    background: var(--light-bg, #f8fbff);
    color: var(--button-line, #97b7ef);
    font-size: 14px;
    font-weight: 500;
  }
`
const WonderWarningSvg = styled(WonderWarningIcon)`
  cursor: pointer;
  svg {
    path {
      fill: #f0ac47;
    }
  }
`

const WonderHighSvg = styled(WonderHighIcon)`
  cursor: pointer;
  svg {
    path {
      fill: #e46767;
    }
  }
`

const ActionDropdown = ({ name, accountAddress }: { name: string; accountAddress: string }) => {
  const { address } = useAccount()
  const nameDetails = useNameDetails(name)
  const { profile, ownerData, wrapperData, expiryDate, registrationStatus } = nameDetails
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
    const items = [] as DropdownItem[]
    if (profileActions.canSetMainName) {
      items.push({
        label: 'Set as main address',
        onClick: () => handleSelectPrimaryName(),
        color: 'text',
      })
    }
    if (abilities.data.canExtend) {
      if (registrationStatus === 'available') {
        items.push({
          label: 'Register',
          onClick: () => router.push(`/${name}/register`),
          color: 'text',
        })
      } else {
        items.push({
          label: 'Extend',
          onClick: handleExtend,
          color: 'text',
        })
      }
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
  useEffect(() => {
    if (
      !profile?.address &&
      profile?.resolverAddress === '0x0000000000000000000000000000000000000000'
    ) {
      router.replace(`/${name}/register`)
    }
  }, [name, profile?.address, profile?.resolverAddress])
  return (
    <>
      <ActionDropdownStyle align="left" items={dropdownItems} label="Account" width="182px">
        <OmitButtonStyle>
          <OmitIcon />
        </OmitButtonStyle>
      </ActionDropdownStyle>
      <InformationDrawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        accountAddress={accountAddress}
        name={name}
      />
    </>
  )
}
const NameTokenCard = ({
  avatarSrc,
  accountAddress,
  nftDataLenght,
  name,
  nameOwner,
}: {
  avatarSrc: string
  accountAddress: string
  name: string
  nftDataLenght: number
  nameOwner: boolean
}) => {
  const { address } = useAccount()
  const [sendTokenOpen, setSendTokenOpen] = useState(false)
  const [sendNFTOpen, setSendNFTOpen] = useState(false)
  const chainId = useChainId()
  const { data: tokenList } = useGetTokenList({
    account: accountAddress,
    chain: chainId === 1 ? 'eth' : chainId,
  })

  const nameDetails = useNameDetails(name)
  const abilities = useAbilities(name)
  const { registrationStatus } = nameDetails

  const totalPrice = useMemo(() => {
    if (!tokenList) return 0
    const total = tokenList.reduce((a, b) => a + b.price * b.amount, 0)
    return total
  }, [tokenList])
  const actionBtn = useMemo(() => {
    if (nameOwner) {
      return [
        <div>
          <SendTokenBtn click={() => setSendTokenOpen(true)} />
        </div>,
        <div>
          <SendNFTBtn click={() => setSendNFTOpen(true)} />
        </div>,
      ]
    }
    return [
      <div>
        <SendTokenBtn disabled click={() => {}} />
      </div>,
      <div>
        <SendNFTBtn disabled click={() => {}} />
      </div>,
    ]
  }, [nameOwner])
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
          <AssetsIcon />${totalPrice.toFixed(4)}
        </AssetsItemStyle>
        <AssetsItemStyle>
          <Icon1 />
          {nftDataLenght}
        </AssetsItemStyle>
        <AssetsItemStyle>
          <SwordIcon />0
        </AssetsItemStyle>
      </div>
      {abilities.data.canExtend && registrationStatus === 'available' && (
        <WarningStyle>
          <>
            <Typography
              style={{ lineHeight: '16px', color: '#9F8644', fontSize: '13px', fontWeight: '500' }}
            >
              The current domain name has expired
            </Typography>
            <AuctionBtn
              className="classbutton"
              onClick={() => {
                router.push(`/${name}/register`)
              }}
            >
              Register
            </AuctionBtn>
          </>
        </WarningStyle>
      )}
      <div style={{ display: 'flex', gap: 5 }}>
        <ReceiveBtn accountAddress={accountAddress} />
        <Dropdown shortThrow align="left" items={actionBtn}>
          <AuctionBtn disabled={!address} prefix={<Icon3 />}>
            <AuctionTitle>Send</AuctionTitle>
          </AuctionBtn>
        </Dropdown>
        <AuctionBtn prefix={<Icon4 />} disabled>
          <AuctionTitle>Connect</AuctionTitle>
        </AuctionBtn>
      </div>

      <div>
        <TokenInfo tokenList={tokenList} accountAddress={accountAddress} />
      </div>
      <SendTokenDrawer
        address={accountAddress}
        open={sendTokenOpen}
        onClose={() => setSendTokenOpen(false)}
      />
      <SendNFTDrawer
        address={accountAddress}
        // name={name}
        open={sendNFTOpen}
        onClose={() => setSendNFTOpen(false)}
      />
    </ProFileStyle>
  )
}

enum DateStatus {
  Normal = 1,
  Warning = 2,
  High = 3,
}

const NameInfoCard = ({
  avatarSrc,
  name,
  nameOwner,
}: {
  avatarSrc: string
  name: string
  nameOwner: boolean
}) => {
  const abilities = useAbilities(name)
  const { prepareDataInput } = useTransactionFlow()
  const showExtendNamesInput = prepareDataInput('AwnsExtendNames')
  const handleExtend = () => {
    showExtendNamesInput(`extend-names-${name}`, {
      names: [name],
      isSelf: shouldShowExtendWarning(abilities.data),
    })
  }
  const nameDetails = useNameDetails(name)
  const { gracePeriodEndDate, registrationStatus } = nameDetails

  const endDate = useMemo(() => {
    if (gracePeriodEndDate) return Date.parse(gracePeriodEndDate.toString())
    return 0
  }, [gracePeriodEndDate])

  const isExpire = useMemo(() => {
    if (endDate && endDate - Date.now() <= 0) return true
    return false
  }, [endDate])

  const ExcessDays = useMemo(() => {
    if (isExpire) return -1
    return Math.ceil((endDate - Date.now()) / DateTime())
  }, [endDate, isExpire])

  const DateTxt = useMemo(() => {
    if (ExcessDays > 365) {
      return `(in ${Math.ceil(ExcessDays / 365)} years)`
    }
    if (ExcessDays > 31) {
      return `(in ${Math.ceil(ExcessDays / 31)} month)`
    }
    if (ExcessDays > 1) {
      return `(in ${ExcessDays} day)`
    }
  }, [ExcessDays])

  const isEndGracePeriod = useMemo(() => {
    if (ENV_NAME === 'env' && isExpire) {
      if (Date.now() - endDate >= 60 * 60 * 1000) {
        return true
      }
      return false
    }
    if (ENV_NAME === 'pre' && isExpire) {
      if (Date.now() - endDate >= 60 * 60 * 1000) {
        return true
      }
      return false
    }
  }, [endDate, isExpire])

  const Status = useMemo(() => {
    if (ExcessDays >= 31) {
      return DateStatus.Normal
    }
    if (ExcessDays <= 31 && ExcessDays >= 3) {
      return DateStatus.Warning
    }
    if (ExcessDays <= 3) {
      return DateStatus.High
    }
  }, [ExcessDays])

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img style={{ width: 382, height: 382, borderRadius: 8 }} src={avatarSrc} alt="default img" />
      <ExpiredStyle
        style={{
          backgroundColor: isExpire
            ? 'rgba(228, 103, 103,0.1)'
            : Status === DateStatus.High
            ? 'rgba(228, 103, 103,0.1)'
            : Status === DateStatus.Warning
            ? 'rgba(240, 172, 71,0.1)'
            : 'rgba(33, 195, 49, 0.1)',
        }}
      >
        <Typography className="title">
          Expire Date
          {Status !== DateStatus.Normal && (
            <Tooltip
              additionalGap={0}
              width={334}
              content={
                <Typography
                  style={{
                    color: ' #3F5170',
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '18px',
                  }}
                >
                  The assets in the account will be lost after the expiry date, please renew or
                  transfer the assets in time.
                </Typography>
              }
              mobilePlacement="top"
              placement="top"
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {Status === DateStatus.High ? <WonderHighSvg /> : <WonderWarningSvg />}
              </div>
            </Tooltip>
          )}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            className="content"
            style={{
              color: isExpire
                ? 'rgb(228, 103, 103)'
                : Status === DateStatus.High
                ? 'rgb(228, 103, 103)'
                : Status === DateStatus.Warning
                ? 'rgb(240, 172, 71)'
                : 'rgb(33, 195, 49)',
            }}
          >
            {timestampToDateFormat(endDate, DateType.YYMMDDHHMMSS)} {!isExpire && DateTxt}
          </Typography>

          {abilities.data.canExtend && (
            <>
              {isEndGracePeriod && registrationStatus === 'available' ? (
                <AuctionBtn
                  className="button"
                  onClick={() => {
                    router.push(`/${name}/register`)
                  }}
                >
                  Register
                </AuctionBtn>
              ) : registrationStatus === 'gracePeriod' && !nameOwner ? (
                <AuctionBtn className="button" style={{ width: 'auto' }} disabled>
                  Coming Soon
                </AuctionBtn>
              ) : (
                <AuctionBtn
                  className="button"
                  onClick={() => {
                    handleExtend()
                  }}
                >
                  Extend
                </AuctionBtn>
              )}
            </>
          )}
        </div>
      </ExpiredStyle>
      {false && (
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
      )}
    </div>
  )
}
enum Tabs {
  Token = 'Token',
  NameInfo = 'NameInfo',
}
const Page = ({
  accountAddress,
  _name,
  nftDataLenght,
  nameOwner,
}: {
  accountAddress: string
  _name: string
  nftDataLenght: number
  nameOwner: boolean
}) => {
  const { avatarSrc } = useEthInvoice(_name, false)
  const [curTab, setCurTab] = useState(Tabs.Token)
  return (
    <CenterLeftStyle>
      <HeaderStyle>
        <ActionDropdown name={_name} accountAddress={accountAddress} />
        <NameStyle>{_name.length > 15 ? shortenAddress(_name, 15, 6, 6) : _name}</NameStyle>

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
        <NameTokenCard
          nftDataLenght={nftDataLenght}
          name={_name}
          nameOwner={nameOwner}
          accountAddress={accountAddress}
          avatarSrc={avatarSrc}
        />
      )}
      {curTab === Tabs.NameInfo && (
        <NameInfoCard avatarSrc={avatarSrc} name={_name} nameOwner={nameOwner} />
      )}
    </CenterLeftStyle>
  )
}

export default Page
