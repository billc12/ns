/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/interactive-supports-focus */
import { Dispatch, ForwardedRef, MouseEvent, SetStateAction, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Input, MagnifyingGlassSVG } from '@ensdomains/thorin'

import SearchIconSvg from '@app/assets/search-icon.svg'

const SearchInputWrapper = styled.div<{ $size: 'medium' | 'extraLarge' }>(
  ({ theme, $size }) => css`
    z-index: 1;
    /* box-shadow: ${theme.boxShadows['0.25']}; */
    /* border-radius: ${theme.radii['2.5xLarge']}; */
    /* border-color: ${theme.colors.border}; */
    width: 100%;
    position: relative;
    &,
    & div,
    & div:focus-within {
      height: 60px;
      background-color: transparent;
      border-radius: none;
      border-color: transparent;
      border-width: 0;
    }

    /* & input::placeholder {
      color: ${theme.colors.greyPrimary};
      font-weight: ${theme.fontWeights.bold};
    } */
    ${$size === 'medium' &&
    css`
      max-width: ${theme.space['96']};
      box-shadow: none;
      border-radius: ${theme.radii.full};
      /* & input::placeholder {
        color: ${theme.colors.greyPrimary};
        font-weight: ${theme.fontWeights.normal};
      } */
    `}
  `,
)

const StyledInputParent = (size: 'medium' | 'extraLarge') =>
  css(
    ({ theme }) => css`
      border-radius: ${theme.radii.full};
      background-color: ${theme.colors.backgroundSecondary};
      transition: background-color 0.35s ease-in-out;
      ${size === 'medium' &&
      css`
        & > div {
          border-radius: ${theme.radii.full};
          input {
            padding-left: ${theme.space['12']};
          }
        }
      `}/* &:focus-within {
        background-color: ${theme.colors.backgroundPrimary};
        & input::placeholder {
          color: transparent;
        }
      } */
    `,
  )

const MagnifyingGlassIcon = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)
const SearchInputStyle = styled(Input)`
  padding-left: 38px;
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border-radius: 40px;
  border: 1px solid #97b7ef;
  background: rgba(7, 17, 40, 0.5);
  backdrop-filter: blur(7px);
  caret-color: #fff;
  &::placeholder {
    color: #516c9f;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`
const SearchIconStyle = styled.div`
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
`
// const ResetButton = styled.div(
//   ({ theme }) => css`
//     display: block;
//     transition: all 0.15s ease-in-out;
//     cursor: pointer;
//     color: rgba(${theme.shadesRaw.foreground}, 0.25);
//     width: ${theme.space['7']};
//     height: ${theme.space['7']};
//     margin-right: ${theme.space['2']};
//     &:hover {
//       color: rgba(${theme.shadesRaw.foreground}, 0.3);
//       transform: translateY(-1px);
//     }
//   `,
// )

export const SearchInputBox = forwardRef(
  (
    {
      size = 'extraLarge',
      input,
      setInput,
      containerRef,
    }: {
      size?: 'medium' | 'extraLarge'
      input: string
      setInput: Dispatch<SetStateAction<string>>
      containerRef: ForwardedRef<HTMLDivElement>
    },
    ref,
  ) => {
    const { t } = useTranslation('awns_common')
    return (
      <SearchInputWrapper ref={containerRef} $size={size}>
        <SearchInputStyle
          size={size}
          label={t('search.label')}
          hideLabel
          placeholder={t('search.placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          ref={ref as any}
          // clearable
          autoComplete="off"
          autoCorrect="off"
          parentStyles={StyledInputParent(size)}
          icon={size === 'medium' ? <MagnifyingGlassIcon as={MagnifyingGlassSVG} /> : undefined}
          spellCheck="false"
          data-testid="search-input-box"
        />
        <SearchIconStyle>
          <SearchIconSvg />
        </SearchIconStyle>
      </SearchInputWrapper>
    )
  },
)

export const FakeSearchInputBox = forwardRef(
  (
    {
      size = 'extraLarge',
      onClick,
    }: {
      size?: 'medium' | 'extraLarge'
      onClick: (e: MouseEvent<HTMLInputElement>) => void
    },
    ref,
  ) => {
    const { t } = useTranslation('common')
    return (
      <SearchInputWrapper $size={size}>
        <Input
          size={size}
          label={t('search.label')}
          hideLabel
          placeholder={t('search.placeholder')}
          ref={ref as any}
          onClick={onClick}
          readOnly
          autoComplete="off"
          autoCorrect="off"
          parentStyles={StyledInputParent(size)}
          spellCheck="false"
          data-testid="search-input-box-fake"
        />
      </SearchInputWrapper>
    )
  },
)