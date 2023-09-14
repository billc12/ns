import styled from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import CheckGreen from '@app/assets/check-green.svg'

interface InputType {
  value: string
  onChange?: (e: string) => void
  label: string
  placeholder?: string
  isShowIcon?: boolean
  isActive?: boolean
}
type IRemainInput = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'placeholder' | 'onChange'
>
const Column = styled.div`
  display: flex;
  flex-direction: column;
`
const ContainerStyle = styled.div<{ $isActive?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  border: ${(props) => (props.$isActive ? '1px solid #97B7EF' : '1px solid #d4d7e2')};
  background: #fff;
  padding: 14px 16px;
`
const InterText = styled(Typography)<{ $size?: string; $color?: string; $weight?: number }>`
  width: max-content;
  height: max-content;
  color: ${(props) => props.$color || '#fff'};
  font-size: ${(props) => props.$size || '20px'};
  font-style: normal;
  font-weight: ${(props) => props.$weight || 600};
  line-height: normal;
`
const AddressInput = styled.input`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: #80829f;
  margin-top: 4px;
  &::placeholder {
    color: #dae4f0;
  }
`
const LabelInput = ({
  value,
  onChange,
  label,
  placeholder = 'Please enter ETH address',
  isShowIcon,
  isActive,
  ...rest
}: IRemainInput & InputType) => {
  return (
    <ContainerStyle $isActive={!!isActive}>
      <Column style={{ flex: 1 }}>
        <InterText $color="#80829F" $size="14px" $weight={500}>
          {label}
        </InterText>
        <AddressInput
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value)
          }}
          {...rest}
          placeholder={placeholder}
        />
      </Column>
      {isShowIcon && <CheckGreen />}
    </ContainerStyle>
  )
}
export default LabelInput
