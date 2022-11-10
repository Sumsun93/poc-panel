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

/**
 * Component
 */
const Login = () => {
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()

  const [rememberMe, setRememberMe] = useState(false)

  const loginErrorToast = useRef(null)

  const defaultValues = {
    socialclub: '',
    password: '',
  }

  const { control, handleSubmit } = useForm({ defaultValues })

  const onSubmit = async (data: any) => {
    const result = await login({
      identifier: data.socialclub,
      password: data.password,
    }).unwrap()

    if (result.success) {
      dispatch(setConnected(true))
      dispatch(setToken(result.token))

      if (rememberMe) {
        localStorage.setItem('token', result.token)
      }
    } else {
      // @ts-ignore
      loginErrorToast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Le socialclub ou le mot de passe est incorrect' })
    }
  }

  const handleRememberMe = (evt: any) => {
    setRememberMe(evt.checked)
  }

  const renderInput = (name: 'socialclub' | 'password', type: string = 'text') => (
    <Controller
      name={name} control={control} rules={{ required: `Le ${name} est requis.` }} render={({ field, fieldState }) => (
        <InputText type={type} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} />
      )}
    />
  )

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={loginErrorToast} />
      <span className='p-float-label'>
        {renderInput('socialclub')}
        <label htmlFor='socialclub'>Socialclub</label>
      </span>
      <span className='p-float-label'>
        {renderInput('password', 'password')}
        <label htmlFor='password'>Mot de passe</label>
      </span>
      <Remember>
        <Checkbox onChange={handleRememberMe} checked={rememberMe} inputId='remember' />
        <label htmlFor='remember'>Se souvenir de moi</label>
      </Remember>
      <ButtonStyled loading={isLoading} type='submit'>Se connecter</ButtonStyled>
    </Form>
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

export default Login
