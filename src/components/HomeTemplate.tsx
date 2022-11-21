/**
 * Package import
 */
import styled from 'styled-components'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

/**
 * Local import
 */
import logo from '@/assets/images/logo.png'

/**
 * Component
 */
const HomeTemplate = ({ children, disableLogo }: { children: JSX.Element, disableLogo?: boolean }) => {
  return (
    <Container>
      <Content>
        {!disableLogo && <Logo src={logo} />}
        {children}
      </Content>

    </Container>
  )
}

/**
 * Styled Component
 */
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Content = styled.div`
  width: 400px;
  background: linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25));
  box-shadow: rgb(0 0 0 / 5%) 0 1.25rem 1.6875rem 0;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`

const Logo = styled.img`
  width: 256px;
`

export default HomeTemplate
