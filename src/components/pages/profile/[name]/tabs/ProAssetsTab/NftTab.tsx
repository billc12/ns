import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, Spinner, Toast, Typography, mq } from '@ensdomains/thorin'

import NftETHIcon from '@app/assets/ETH.svg'
import NftBreakIcon from '@app/assets/NftBreakIcon.svg'
import RefreshIcon from '@app/assets/RefreshIcon.svg'
import TestImg from '@app/assets/TestImage.png'
import { EmptyData } from '@app/components/EmptyData'
import useGetUserNFT, { IRefreshParams, useRefreshNFTScan } from '@app/hooks/requst/useGetUserNFT'

const NFTsCard = styled.div(
  () => css`
    width: 100%;
    height: 100%;
    padding: 0 64px 20px;
    display: flex;
    justify-content: flex-start;
    gap: 18px;
    flex-wrap: wrap;
    padding-bottom: 20px;
    ${mq.sm.max(css`
      padding: 0;
      gap: 10px;
      justify-content: space-evenly;
    `)}
  `,
)

const NFTCardStyle = styled.div(
  () => css`
    width: 164px;
    height: 190px;
    border-radius: 8px;
    border: 1px solid var(--line, #d4d7e2);
    background: var(--light-bg, #f8fbff);
    position: relative;
    overflow: hidden;
    :hover {
      cursor: pointer;
      & svg {
        display: inline-block;
      }
      & .icons-style {
        display: flex;
      }
    }
    ${mq.sm.max(css`
      width: 40vw;
      height: 45vw;
    `)}
  `,
)

const IconsStyle = styled.div(
  () => css`
    position: absolute;
    z-index: 99;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    justify-content: space-between;
    padding: 8px;
  `,
)

const NftBgStyle = styled.img(
  () => css`
    height: 100%;
    width: 100%;
    position: absolute;
  `,
)

const Icons = styled.svg(
  () => css`
    width: 24px;
    height: 24px;
    display: none;
    :hover {
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.3);
    }
  `,
)

const BottomIconStyle = styled.svg(
  () => css`
    width: 16px;
    height: 16px;
    display: none;
  `,
)

const NftBottomStyle = styled.div(
  () => css`
    width: 100%;
    height: 27px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 99;
    background: #f8fbff;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)

const SpinnerBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export function NftTab({ name }: { name: string }) {
  const { data, isLoading } = useGetUserNFT({
    name,
  })
  const refresh = useRefreshNFTScan()
  const [refreshInfo, setRefreshInfo] = useState({
    open: false,
    message: '',
  })
  const handleRefresh = (params: IRefreshParams) => {
    refresh(params).then((res) => {
      if (res.code === 200 && res.data.status === 'SUCCESS') {
        setRefreshInfo({
          open: true,
          message: 'Refresh successful!',
        })
      } else {
        setRefreshInfo({
          open: true,
          message: 'Refresh failed!',
        })
      }
    })
  }

  if (isLoading) {
    return (
      <SpinnerBox>
        <Spinner color="accent" size="large" />
      </SpinnerBox>
    )
  }
  if (!data || !data.total) {
    return (
      <div
        style={{
          paddingBottom: 20,
          height: '100%',
        }}
      >
        <EmptyData />
      </div>
    )
  }

  return (
    <NFTsCard>
      {data.content.map((item) => (
        <NFTCardStyle key={`${item.nftscan_id}${item.name}`}>
          <NftBgStyle src={item.image_uri || TestImg.src} />
          <IconsStyle className="icons-style">
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              onClick={() =>
                handleRefresh({ contractAddress: item.contract_address, tokenId: item.token_id })
              }
            >
              <Icons as={RefreshIcon} />
            </div>
            <div>
              <Icons as={NftETHIcon} />
            </div>
          </IconsStyle>
          <NftBottomStyle>
            <Typography ellipsis>
              {item.name || item.contract_name} - #{item.token_id}
            </Typography>

            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              className="bottom-icons-style"
              onClick={() => {
                window.open(
                  `https://opensea.io/assets/ethereum/${item.contract_address}/${item.token_id}`,
                  '_blank',
                )
              }}
            >
              <BottomIconStyle as={NftBreakIcon} />
            </div>
          </NftBottomStyle>
        </NFTCardStyle>
      ))}
      <Toast
        description={refreshInfo.message}
        open={refreshInfo.open}
        title="Tip"
        variant="desktop"
        onClose={() => setRefreshInfo({ ...refreshInfo, open: false })}
      >
        <Button size="small" onClick={() => setRefreshInfo({ ...refreshInfo, open: false })}>
          Close
        </Button>
      </Toast>
    </NFTsCard>
  )
}
