/**
 * Package import
 */
import styled from 'styled-components'

/**
 * Local import
 */
import Button from './Button'

/**
 * Component
 */
const StatCard = ({ title, value, desc, icon, iconBg = 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))', buttonText, buttonOnClick, buttonBg, buttonIcon }: any) => {
  return (
    <Card>
      <IconContainer bgColor={iconBg}>
        <i className={icon} />
      </IconContainer>
      <Content>
        {title && <Title>{title}</Title>}
        {value && <Value>{value}</Value>}
        {desc && <Desc>{desc}</Desc>}
      </Content>
      {(buttonOnClick) && (
        <Button gradient={buttonBg || iconBg} onClick={buttonOnClick}>
          <>
            {buttonIcon && <i className={buttonIcon} />}
            <ButtonText>
              {buttonText}
            </ButtonText>
          </>
        </Button>
      )}
    </Card>
  )
}

const Card = styled.div`
  color: rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 16rem;
  min-height: 100px;
  overflow-wrap: break-word;
  background-color: rgb(255, 255, 255);
  background-clip: border-box;
  border: 0 solid rgba(0, 0, 0, 0.125);
  border-radius: 0.75rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0 0.125rem 0.25rem -0.0625rem;
  overflow: visible;
  justify-content: space-between;
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
  color: rgb(52, 71, 103);
  margin: 1rem;
`

const IconContainer = styled.div`
  position: absolute;
  top: -24px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 4rem;
  opacity: 1;
  background: ${({ bgColor }: { bgColor: string }) => bgColor || 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))'};
  color: rgb(255, 255, 255);
  border-radius: 0.75rem;
  box-shadow: rgb(0 0 0 / 14%) 0 0.25rem 1.25rem 0, rgb(0 0 0 / 40%) 0 0.4375rem 0.625rem -0.3125rem;

  i {
    font-size: 1.5rem;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  margin-left: 1rem;
  margin-top: .2rem;
`

const Title = styled.div`
  margin: 0;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 0.875rem;
  line-height: 1.5;
  letter-spacing: 0.02857em;
  opacity: 1;
  text-transform: none;
  vertical-align: unset;
  text-decoration: none;
  color: rgb(123, 128, 154);
  font-weight: 300;
`

const Value = styled.div`
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.375;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 0.00735em;
  opacity: 1;
  text-transform: none;
  vertical-align: unset;
  text-decoration: none;
  color: rgb(52, 71, 103);
`

const Desc = styled.div`
  padding: 0.75rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-weight: 400;
  letter-spacing: 0.02857em;
  opacity: 1;
  text-transform: none;
  vertical-align: unset;
  text-decoration: none;
  color: rgb(123, 128, 154);
`

const ButtonText = styled.span`
  width: 100%;
`

export default StatCard
