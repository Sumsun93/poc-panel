/**
 * Package import
 */
import styled from 'styled-components'
import { Button } from 'primereact/button'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Local import
 */
import logo from '@/assets/images/logo.png'
import Login from '@/components/Login'
import Register from '@/components/Register'
import { setIsRegistering } from '@/features/authSlice'

/**
 * Component
 */
const Home = () => {
  const dispatch = useDispatch()
  const { isRegistering } = useSelector((state: any) => state.auth)

  const handleClick = () => {
    dispatch(setIsRegistering(!isRegistering))
  }

  return (
    <Container>
      <Content>
        <Logo src={logo} />
        {isRegistering
          ? (
            <Register />
            )
          : <Login />}
        <ButtonStyled className='p-button-outlined p-button-secondary' onClick={handleClick}>{isRegistering ? 'Connexion' : 'Inscription'}</ButtonStyled>
      </Content>
    </Container>
  )
}

/**
 * Styled Component
 */
const Container = styled.div`
  min-width: 100vw;
  min-height: 100vh;
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
  padding: 20px;
`

const Logo = styled.img`
  width: 256px;
`

const ButtonStyled = styled(Button)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

export default Home
