/**
 * Package import
 */
import styled from 'styled-components'
import { Button as ButtonComponent } from 'primereact/button'

/**
 * Local import
 */
import { extractColor, rgbToRgba } from '@/utils/color'

/**
 * Component
 */
const Button = ({
  children,
  onClick,
  gradient = 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
  style = {},
  aloneContent = false,
  disabled = false,
  className = '',
  tooltip,
}: {
  children: JSX.Element,
  onClick: Function,
  gradient?: string,
  style?: any,
  aloneContent?: boolean,
  disabled?: boolean,
  className?: string,
  tooltip?: string,
}) => {
  return (
    <Container bgColor={gradient} aloneContent={aloneContent}>
      {/* @ts-ignore */}
      <CustomButton onClick={onClick} color={extractColor(gradient)} style={style} disabled={disabled} className={className} tooltip={tooltip}>
        {children}
      </CustomButton>
    </Container>
  )
}

const CustomButton = styled(ButtonComponent)`
  width: calc(100% - 2rem);
  border-radius: 0.75rem;
  margin: 1rem 1rem 1rem;


  ${({ color }: { color: string }) => `
    background: transparent !important;
    border: 1px solid ${color};
    color: ${color};

    &:focus {
      box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px ${rgbToRgba(color, 0.2)}, 0 1px 2px 0 black !important;
  `}
`

const Container = styled.div(({ bgColor, aloneContent }: { bgColor: string, aloneContent: boolean }) => `
  ${CustomButton} {
    &:hover {
      background: ${bgColor} !important;
      border: 1px solid transparent !important;
    }

    i {
      font-size: 1.5em;
      margin-right: ${aloneContent ? '0' : '1rem'};
    }
  }
`)

export default Button
