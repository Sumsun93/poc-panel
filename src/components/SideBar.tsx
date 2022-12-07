/**
 * Package import
 */
import { Fragment } from 'react'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useNavigate, NavLink } from 'react-router-dom'

/**
 * Local import
 */
import { disconnect } from '@/features/authSlice'
import logo from '@/assets/images/logo.png'
import pages from '@/constants/pages'

/**
 * Component
 */
interface Category {
  title?: string;
  items: {
    route: string;
    label?: string;
    icon?: string;
    right?: string
  }[]
}

const SideBar = () => {
  const { socialclubName, rights } = useSelector((state: any) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleDisconnect = () => {
    dispatch(disconnect())
    navigate('/')
  }

  const renderCategories = ({ title, items }: Category) => {
    const authItems = items.filter((item) => !item.right || rights[item.right])
    if (authItems.length) {
      return (
        <>
          {title && <Title>{title}</Title>}
          {authItems.map((item, index) => (
            <NavButton
              onClick={() => {
                // if active page, refresh component
                if (window.location.pathname === item.route) {
                  navigate('/')
                }
              }} to={item.route} key={index} end
            >
              <i className={item.icon} />
              {item.label}
            </NavButton>
          ))}
        </>
      )
    }
  }

  return (
    <Container>
      <Logo src={logo} />
      <Divider />
      <User>
        <Avatar icon='pi pi-user' className='mr-2' shape='circle' />
        <Username>{socialclubName}</Username>
      </User>
      <Divider />

      {pages.filter((category) => !category.hide).map((category, index) => (
        <Fragment key={index}>
          {renderCategories(category)}
        </Fragment>
      ))}

      <DisconnectButton className='p-button-danger p-button-outlined' onClick={handleDisconnect}>
        <i className='pi pi-sign-out mr-2' />
        Se déconnecter
      </DisconnectButton>
      <Version>
        v0.1.0
      </Version>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 1rem;
  padding: 1rem;
  width: 250px;
  height: calc(100vh - 2rem);
  background: linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25));
  box-shadow: rgb(0 0 0 / 5%) 0 1.25rem 1.6875rem 0;
  border-radius: 0.75rem;
  font-size: 0.875rem;

  .active {
    background: rgba(255, 193, 21, 0.5);
    box-shadow: rgba(0, 0, 0, 0.1) 0 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0 0.125rem 0.25rem -0.0625rem;
  }
`

const Logo = styled.img`
  width: 100%;
  padding: 0 3rem 0 3rem;
`

const Title = styled.span`
  width: 100%;
  margin: 16px 0 8px 8px;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 0.75rem;
  line-height: 1.25;
  letter-spacing: 0.03333em;
  display: block;
  opacity: 1;
  text-transform: uppercase;
  vertical-align: unset;
  text-decoration: none;
  color: rgb(255, 255, 255);
  font-weight: 700;
`

const NavButton = styled(NavLink)`
  color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.8rem 1rem;
  margin: 0.09375rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  i {
    font-size: 1.5rem;
    margin-right: 1rem;
  }

  &:hover {
    background: rgba(255, 193, 21, 0.5);
  }
`

const DisconnectButton = styled(Button)`
  position: absolute;
  bottom: 2.5rem;
  width: calc(100% - 2rem);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`

const User = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 0 1rem;
`

const Username = styled.p`
  color: white;
  margin-left: 20px;
`

const Divider = styled.hr`
  width: 100%;
  flex-shrink: 0;
  border-top: 0 solid rgba(0, 0, 0, 0.08);
  border-right: 0 solid rgba(0, 0, 0, 0.08);
  border-left: 0 solid rgba(0, 0, 0, 0.08);
  height: 0.0625rem;
  margin: 1rem 0;
  border-bottom: none;
  opacity: 0.25;
  background-color: transparent;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgb(255, 255, 255), rgba(255, 255, 255, 0)) !important;
`

const Version = styled.p`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 1rem;
  color: #FFC115;
  font-size: 0.75rem;
  text-align: center;
`

export default SideBar
