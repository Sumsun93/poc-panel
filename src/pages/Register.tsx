/**
 * Package import
 */
import { useRef } from 'react'
import styled from 'styled-components'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

/**
 * Local import
 */
import { useRegisterMutation } from '@/services/authentication'
import { setIsRegistering } from '@/features/authSlice'
import HomeTemplate from '@/components/HomeTemplate'
import Cgu from '@/components/Cgu'

/**
 * Component
 */
interface FormValues {
  socialclub: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}

type inputType = {
  name: keyof FormValues
  label: string
  type?: string
  required?: string
  pattern?: RegExp
  validate?: (value: string) => boolean | string
}

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()

  const registerErrorToast = useRef(null)

  const defaultValues = {
    socialclub: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  }

  const { control, handleSubmit, formState: { errors }, getValues } = useForm<FormValues>({ defaultValues })

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
      // @ts-ignore
      registerErrorToast.current?.show({ severity: 'success', summary: 'Succès', detail: 'Votre compte a bien été créé et un mail vous a été envoyé.' })
    } else if (result.messages.errors) {
      const allErrors = Object.keys(result.messages.errors).map((key) => result.messages.errors[key]).join('\n')
      // @ts-ignore
      registerErrorToast.current?.show({ severity: 'error', summary: 'Erreur', detail: allErrors })
    }
  }

  const getFormErrorMessage = (name: keyof FormValues) => {
    return errors[name] && <small className='p-error' style={{ position: 'absolute', bottom: '-1.2rem', width: '100%', fontSize: '.8rem' }}>{errors[name]?.message}</small>
  }

  const renderInput = (key: number, input: inputType) => (
    <span key={key} style={{ position: 'relative', margin: '.3rem 0' }}>
      <span className='p-float-label' style={{ width: '300px' }}>
        <Controller
          name={input.name}
          control={control}
          rules={{
            required: input.required,
            pattern: input.pattern,
            validate: input.validate,
          }}
          render={({ field, fieldState }) => (
            <InputText style={{ width: '300px' }} type={input.type} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} />
          )}
        />
        <label htmlFor={input.name}>{input.label}</label>
      </span>
      {getFormErrorMessage(input.name)}
    </span>
  )

  const inputs: inputType[] = [
    {
      name: 'socialclub',
      label: 'Socialclub',
      required: 'Le socialclub est requis.',
    },
    {
      name: 'email',
      label: 'Email',
      required: 'L\'email est requis.',
      validate: (value) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        return emailRegex.test(value) || 'L\'email n\'est pas valide.'
      },
    },
    {
      name: 'confirmEmail',
      label: 'Confirmer l\'email',
      required: 'La confirmation de l\'email est requise.',
      validate: (value) => value === getValues('email') || 'Les emails ne correspondent pas.',
    },
    {
      name: 'password',
      label: 'Mot de passe',
      type: 'password',
      required: 'Le mot de passe est requis.',
      // regex 8 characters, 1 uppercase, 1 lowercase, 1 number
      validate: (value) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
        return regex.test(value) || '8 caractères, une maj., une min. et un nombre.'
      },
    },
    {
      name: 'confirmPassword',
      label: 'Confirmer le mot de passe',
      type: 'password',
      required: 'La confirmation du mot de passe est requise.',
      validate: (value) => {
        const password = getValues('password')
        return password === value || 'Les mots de passe ne correspondent pas.'
      },
    },
  ]

  return (
    <HomeTemplate>
      <>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Toast ref={registerErrorToast} />
          {inputs.map((input, index) => renderInput(index, input))}
          <ButtonStyled loading={isLoading} type='submit'>S'inscrire</ButtonStyled>
        </Form>
        <NavButton className='p-button-outlined' onClick={() => navigate('/')}>Connexion</NavButton>
        <Cgu titleButton={'S\'inscrire'} />
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

export default Register
