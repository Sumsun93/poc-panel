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
import { useNavigate } from 'react-router-dom'

/**
 * Local import
 */
import { useResetPasswordMutation } from '@/services/authentication'
import HomeTemplate from '@/components/HomeTemplate'

/**
 * Component
 */
const WantResetPassword = () => {
  const navigate = useNavigate()
  const [reset, { isLoading }] = useResetPasswordMutation()

  const resetToast = useRef(null)

  interface FormValues {
    socialclub: string;
    email: string;
  }

  type inputType = {
    name: keyof FormValues
    label: string
    required?: string
    validate?: (value: string) => boolean | string
  }

  const defaultValues = {
    socialclub: '',
    email: '',
  }

  const { control, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  const inputs: inputType[] = [
    {
      name: 'socialclub',
      label: 'Socialclub',
      required: 'Le socialclub est requis',
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
  ]

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await reset({
        socialclub: data.socialclub,
        email: data.email,
      }).unwrap()

      if (result.success) {
        // @ts-ignore
        resetToast.current?.show({
          severity: 'success',
          summary: 'Demande envoyée',
          detail: 'Un email vous a été envoyé',
          life: 3000,
        })
      } else {
        // @ts-ignore
        resetToast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue, réessayez dans quelques minutes.', life: 3000 })
      }
    } catch (e) {
      // @ts-ignore
      resetToast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue, réessayez dans quelques minutes.', life: 3000 })
    }
  }

  const getFormErrorMessage = (name: keyof FormValues) => {
    return errors[name] && <small className='p-error' style={{ position: 'absolute', bottom: '-1.2rem', left: 0, width: '100%', fontSize: '.8rem' }}>{errors[name]?.message}</small>
  }

  const renderInput = (input: any) => (
    <Controller
      name={input.name} control={control} rules={{ required: `Le ${input.label} est requis.` }} render={({ field, fieldState }) => (
        <InputText style={{ width: '250px' }} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} />
      )}
    />
  )

  return (
    <HomeTemplate>
      <>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Toast ref={resetToast} />
          {inputs.map((input) => (
            <span key={input.name} className='p-float-label' style={{ position: 'relative' }}>
              {renderInput(input)}
              <label htmlFor={input.name}>{input.label}</label>
              {getFormErrorMessage(input.name)}
            </span>
          ))}
          <ButtonStyled loading={isLoading} type='submit'>Réinitialiser le mot de passe</ButtonStyled>
        </Form>
        <NavButton className='p-button-outlined' onClick={() => navigate('/')}>
          Retour
        </NavButton>
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

export default WantResetPassword
