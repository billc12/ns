import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Button, Dropdown } from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import DownChevron from '@app/assets/DownChevron.svg'

const DropdownStyle = styled(Dropdown)`
  width: max-content;
  height: max-content;
  background: transparent;
  border-radius: 8px;
  border: 1px solid #97b7ef;
  background: #fff;
  padding: 0;
  color: #fff;
`

const ButtonStyle = styled(Button)`
  width: max-content;
  height: max-content;
  padding: 0;
  background: #fff;
  color: #3f5170 !important;
  font-feature-settings: 'clig' off, 'liga' off;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  padding: 14px 24px;
  &:hover {
    background: #fff;
  }
`
export const Title = styled.p`
  /* font-family: Inter; */
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  cursor: pointer;
`
export const Explore = () => {
  const router = useRouter()

  const isIndex = router.asPath === '/'
  const [el, setEl] = useState<any>()
  useEffect(() => {
    const _el = (
      <DropdownStyle
        align="left"
        items={
          [
            <ButtonStyle onClick={() => router.push('/my/names')}>AW Wallet</ButtonStyle>,
          ] as DropdownItem[]
        }
      >
        <Title>
          Explore <DownChevron />
        </Title>
      </DropdownStyle>
    )
    if (!el) {
      setEl(_el)
    }
  }, [el, isIndex, router])
  return (
    <>
      {el || (
        <Title>
          Explore <DownChevron />
        </Title>
      )}
    </>
  )
}
