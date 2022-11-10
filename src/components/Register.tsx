/**
 * Package import
 */
import { useRef } from 'react'
import styled from 'styled-components'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useForm, Controller } from 'react-hook-form'
import classNames from 'classnames'

/**
 * Local import
 */
import { useRegisterMutation } from '@/services/authentication'
import { useDispatch } from 'react-redux'
import { setIsRegistering } from '@/features/authSlice'

/**
 * Component
 */
type inputNameType = 'socialclub' | 'email' | 'confirmEmail' | 'password' | 'confirmPassword'

type inputType = {
  name: inputNameType
  label: string
  type?: string
}

const Login = () => {
  const dispatch = useDispatch()
  const [register, { isLoading }] = useRegisterMutation()

  const registerErrorToast = useRef(null)

  const defaultValues = {
    socialclub: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  }

  const { control, handleSubmit } = useForm({ defaultValues })

  const onSubmit = async (data: any) => {
    if (data.email !== data.confirmEmail) {
      // @ts-ignore
      registerErrorToast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Les emails ne correspondent pas' })
      return
    }

    if (data.password !== data.confirmPassword) {
      // @ts-ignore
      registerErrorToast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Les mots de passe ne correspondent pas' })
      return
    }

    const result = await register({
      identifier: data.socialclub,
      email: data.email,
      password: data.password,
    }).unwrap()

    if (result.success) {
      dispatch(setIsRegistering(false))
    } else {
      // @ts-ignore
      registerErrorToast.current?.show({ severity: 'error', summary: 'Erreur', detail: result.message })
    }
  }

  const renderInput = (key: number, name: inputNameType, label: string, type: string = 'text') => (
    <span key={key} className='p-float-label'>
      <Controller
        name={name} control={control} rules={{ required: `Le ${name} est requis.` }} render={({ field, fieldState }) => (
          <InputText type={type} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} />
        )}
      />
      <label htmlFor={name}>{label}</label>
    </span>
  )

  const inputs: inputType[] = [
    {
      name: 'socialclub',
      label: 'Socialclub',
    },
    {
      name: 'email',
      label: 'Email',
    },
    {
      name: 'confirmEmail',
      label: 'Confirmer l\'email',
    },
    {
      name: 'password',
      label: 'Mot de passe',
      type: 'password',
    },
    {
      name: 'confirmPassword',
      label: 'Confirmer le mot de passe',
      type: 'password',
    },
  ]

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={registerErrorToast} />
      {inputs.map((input, index) => renderInput(index, input.name, input.label, input.type))}
      <ButtonStyled loading={isLoading} type='submit'>S'inscrire</ButtonStyled>
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

export default Login
