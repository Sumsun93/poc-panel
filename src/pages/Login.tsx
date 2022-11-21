/**
 * Package import
 */
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Toast } from 'primereact/toast'
import { useForm, Controller } from 'react-hook-form'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'

/**
 * Local import
 */
import { useLoginMutation } from '@/services/authentication'
import { setConnected, setToken } from '@/features/authSlice'
import HomeTemplate from '@/components/HomeTemplate'
import Cgu from '@/components/Cgu'
import { useNavigate } from 'react-router-dom'

/**
 * Component
 */
const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()

  const [rememberMe, setRememberMe] = useState(false)

  const loginErrorToast = useRef(null)

  const defaultValues = {
    socialclub: '',
    password: '',
  }

  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  const onSubmit = async (data: any) => {
    try {
      const result = await login({
        identifier: data.socialclub,
        password: data.password,
      }).unwrap()

      if (result.success) {
        dispatch(setConnected(true))
        dispatch(setToken(result.token))

        if (rememberMe) {
          localStorage.setItem('token', result.token)
        } else {
          sessionStorage.setItem('token', result.token)
        }
      } else {
        // @ts-ignore
        loginErrorToast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Le socialclub ou le mot de passe est incorrect' })
      }
    } catch (e: any) {
      let message = 'Le socialclub ou le mot de passe est incorrect'
      if (e.data?.messages?.errors && Object.keys(e.data?.messages?.errors).length) {
        message = Object.keys(e.data?.messages?.errors).map((key) => e.data?.messages?.errors[key]).join(' ')
      }
      // @ts-ignore
      loginErrorToast.current?.show({ severity: 'error', summary: 'Erreur', detail: message })
    }
  }

  const handleRememberMe = (evt: any) => {
    setRememberMe(evt.checked)
  }

  const getFormErrorMessage = (name: 'socialclub' | 'password') => {
    return errors[name] && <small className='p-error' style={{ position: 'absolute', bottom: '-1.2rem', left: 0, width: '100%', fontSize: '.8rem' }}>{errors[name]?.message}</small>
  }

  const renderInput = (name: 'socialclub' | 'password', label: string, type: string = 'text') => (
    <Controller
      name={name} control={control} rules={{ required: `Le ${label} est requis.` }} render={({ field, fieldState }) => (
        <InputText style={{ width: '250px' }} type={type} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} />
      )}
    />
  )

  return (
    <HomeTemplate>
      <>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Toast ref={loginErrorToast} />
          <span className='p-float-label' style={{ position: 'relative' }}>
            {renderInput('socialclub', 'socialclub')}
            <label htmlFor='socialclub'>Socialclub</label>
            {getFormErrorMessage('socialclub')}
          </span>
          <span className='p-float-label' style={{ position: 'relative' }}>
            {renderInput('password', 'mot de passe', 'password')}
            <label htmlFor='password'>Mot de passe</label>
            {getFormErrorMessage('password')}
          </span>
          <Remember>
            <Checkbox onChange={handleRememberMe} checked={rememberMe} inputId='remember' />
            <label htmlFor='remember'>Se souvenir de moi</label>
          </Remember>
          <ButtonStyled loading={isLoading} type='submit'>Se connecter</ButtonStyled>
        </Form>
        <NavButton className='p-button-outlined' onClick={() => navigate('/register')}>
          S'inscrire
        </NavButton>
        <BackButton onClick={() => navigate('/reset')}>
          Mot de passe oublié ?
        </BackButton>
        <Cgu titleButton='Se connecter' />
      </>
    </HomeTemplate>
  )
}

/**
 * Styled Component
 */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 30px;
`

const ButtonStyled = styled(Button)`
  width: 100% !important;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #FFC115;
  color: #000;
  border: 1px solid #FFC115;

  &:hover {
    background-color: #FFC115 !important;
    border: 1px solid #fff !important;
  }
`

const NavButton = styled(Button)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  color: #FFC115 !important;

  &:hover {
    color: #fff !important;
    border: 1px solid #fff !important;
  }
`

const Remember = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  label {
    margin-left: 10px;
    color: white;
    cursor: pointer;
  }
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: #FFC115;
  font-size: .8rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
`

export default Login
