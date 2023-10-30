import {
  ChangeEventHandler,
  FocusEvent,
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
  useCallback,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import Add from '@app/assets/Add.svg'
import MinusIcon from '@app/assets/Minus.svg'
import PlusIcon from '@app/assets/Plus.svg'
import { MAX_YEAR } from '@app/components/pages/profile/[name]/registration/types'
import { useDefaultRef } from '@app/hooks/useDefaultRef'
import { createChangeEvent } from '@app/utils/syntheticEvent'

const Container = styled.div<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
    width: 112px;
    height: 32px;
    /* padding: ${$highlighted ? theme.space['4'] : theme.space['1']}; */
    padding: 3px;
    border: 1px solid ${theme.colors.border};
    /* border-radius: ${theme.radii.full}; */
    display: flex;
    align-items: center;
    gap: ${theme.space['4']};
    border-radius: 6px;
    background: #dae4f0;
  `,
)

const Button = styled.button(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 150ms ease-in-out;
    width: 24px;
    height: 25px;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;

    svg {
      display: block;
      transform: scale(0.67);
      pointer-events: none;
    }

    &:disabled {
      /* background-color: ${theme.colors.greyBright}; */
      background: #fff;
      cursor: not-allowed;
    }
  `,
)
const Minus = styled.div`
  width: 10px;
  height: 2px;
  border-radius: 3px;
  background: #97b7ef;
`
const LabelContainer = styled.div(
  ({ theme }) => css`
    position: relative;
    flex: 1;
    /* height: ${theme.space['11']}; */
    border-radius: ${theme.radii.full};
    background-color: transparent;
    transition: background-color 150ms ease-in-out;
    overflow: hidden;

    :hover {
      /* background-color: ${theme.colors.accentSurface}; */
    }

    :focus-within label {
      opacity: 0;
    }
    :focus-within input {
      opacity: 1;
    }
  `,
)

const Label = styled.label<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    /* height: ${theme.space['11']}; */
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    /* font-style: normal; */
    /* font-weight: ${theme.fontWeights.bold}; */
    /* font-size: ${$highlighted ? theme.fontSizes.headingTwo : theme.fontSizes.large}; */
    /* line-height: ${theme.space['11']}; */
    text-align: center;
    /* color: ${$highlighted ? theme.colors.accent : theme.colors.text}; */
    pointer-events: none;
    opacity: 1;
    transition: opacity 150ms ease-in-out;
    color: #3f5170;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  `,
)

const LabelInput = styled.input<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
    width: 100%;
    height: 100%;
    text-align: center;

    /* font-style: normal; */
    /* font-weight: ${theme.fontWeights.bold}; */
    /* font-size: ${$highlighted ? theme.fontSizes.headingTwo : theme.fontSizes.large}; */
    /* line-height: ${$highlighted ? theme.lineHeights.headingTwo : theme.lineHeights.large}; */
    /* color: ${$highlighted ? theme.colors.accent : theme.colors.text}; */

    opacity: 0;
    transition: opacity 150ms ease-in-out;
    /* background-color: ${theme.colors.accentSurface}; */
    background-color: transparent;
    /* stylelint-disable property-no-vendor-prefix */
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;
    /* stylelint-enable property-no-vendor-prefix */

    color: #3f5170;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  `,
)

type InputProps = InputHTMLAttributes<HTMLInputElement>
type Props = {
  highlighted?: boolean
  value?: number
  minValue?: number
  maxValue?: number
  defaultValue?: number
  unit?: string
  name?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
} & Omit<InputProps, 'value' | 'defaultValue' | 'min' | 'max'>

export const PlusMinusControl = forwardRef(
  (
    {
      value,
      defaultValue,
      minValue = 1,
      // maxValue is needed to prevent exceeding NUMBER.MAX_SAFE_INTEGER
      maxValue = MAX_YEAR,
      name = 'plus-minus-control',
      unit = 'years',
      onChange,
      onBlur,
      highlighted,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const { t } = useTranslation('common')
    const inputRef = useDefaultRef<HTMLInputElement>(ref)

    const getDefaultValue = useCallback(() => {
      return value || defaultValue || minValue
    }, [value, defaultValue, minValue])

    const normalizeValue = useCallback(
      (val: number) => {
        if (Number.isNaN(val)) return getDefaultValue()
        if (val < minValue) return minValue
        if (val > maxValue) return maxValue
        return val
      },
      [minValue, maxValue, getDefaultValue],
    )

    const isValidValue = useCallback(
      (val: number) => {
        if (Number.isNaN(val)) return false
        if (val < minValue) return false
        if (val > maxValue) return false
        return true
      },
      [minValue, maxValue],
    )

    const [inputValue, setInputValue] = useState<string>(getDefaultValue().toFixed(0))
    const [focused, setFocused] = useState(false)

    const minusDisabled = typeof value === 'number' && value <= minValue
    const plusDisabled = typeof value === 'number' && value >= maxValue

    const incrementHandler = (inc: number) => () => {
      const newValue = (value || 0) + inc
      const normalizedValue = normalizeValue(newValue)
      if (normalizedValue === value) return
      setInputValue(normalizedValue.toFixed(0))
      const newEvent = createChangeEvent(normalizedValue, name)
      onChange?.(newEvent)
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      setInputValue(e.target.value)

      const newValue = parseInt(e.target.value)
      if (!isValidValue(newValue)) return
      onChange?.(e)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      const normalizedValue = normalizeValue(parseInt(e.target.value))
      setInputValue(normalizedValue.toFixed(0))

      if (normalizedValue !== value) {
        const newEvent = createChangeEvent(normalizedValue, name)
        onChange?.(newEvent)
      }

      setFocused(false)
      onBlur?.(e)
    }

    return (
      <Container $highlighted={highlighted}>
        <Button
          type="button"
          onClick={incrementHandler(-1)}
          data-testid="plus-minus-control-plus"
          disabled={focused || minusDisabled}
        >
          <Minus />
        </Button>

        <LabelContainer>
          <LabelInput
            data-testid="plus-minus-control-input"
            $highlighted={highlighted}
            type="number"
            {...props}
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            min={minValue}
            max={maxValue}
            readOnly
            inputMode="numeric"
            pattern="[0-9]*"
            onKeyDown={(e) => {
              // rely on type="number" to prevent non-numeric input
              // additionally prevent . and -
              if (['.', '-'].includes(e.key)) e.preventDefault()
            }}
            onFocus={(e) => {
              e.target.select()
              setFocused(true)
            }}
            onBlur={handleBlur}
          />
          <Label $highlighted={highlighted}>{value}</Label>
        </LabelContainer>
        <Button
          type="button"
          onClick={incrementHandler(1)}
          data-testid="plus-minus-control-minus"
          disabled={focused || plusDisabled}
        >
          <Add />
        </Button>
      </Container>
    )
    return (
      <Container $highlighted={highlighted}>
        <Button
          type="button"
          onClick={incrementHandler(-1)}
          data-testid="plus-minus-control-minus"
          disabled={focused || minusDisabled}
        >
          <MinusIcon />
        </Button>
        <LabelContainer>
          <LabelInput
            data-testid="plus-minus-control-input"
            $highlighted={highlighted}
            type="number"
            {...props}
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            min={minValue}
            max={maxValue}
            inputMode="numeric"
            pattern="[0-9]*"
            onKeyDown={(e) => {
              // rely on type="number" to prevent non-numeric input
              // additionally prevent . and -
              if (['.', '-'].includes(e.key)) e.preventDefault()
            }}
            onFocus={(e) => {
              e.target.select()
              setFocused(true)
            }}
            onBlur={handleBlur}
          />
          <Label $highlighted={highlighted}>{t(`unit.${unit}`, { count: value })}</Label>
        </LabelContainer>
        <Button
          type="button"
          onClick={incrementHandler(1)}
          data-testid="plus-minus-control-plus"
          disabled={focused || plusDisabled}
        >
          <PlusIcon />
        </Button>
      </Container>
    )
  },
)
