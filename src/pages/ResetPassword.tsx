/**
 * Package import
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useForm, Controller } from 'react-hook-form'
import classNames from 'classnames'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

/**
 * Local import
 */
import { useChangePasswordMutation, useCheckResetMutation } from '@/services/authentication'
import HomeTemplate from '@/components/HomeTemplate'
import Loading from '@/components/Loading'
import { showToast } from '@/features/utilsSlice'

/**
 * Component
 */
const ResetPassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [changePassword, { isLoading }] = useChangePasswordMutation()
  const [sendCheck, { isLoading: isLoadingCheck }] = useCheckResetMutation()

  const [isValid, setIsValid] = useState(false)

  const { userId, token, check } = useMemo(() => ({
    userId: searchParams.get('userId'),
    token: searchParams.get('token'),
    check: searchParams.get('check'),
  })
  , [searchParams])

  interface FormValues {
    password: string;
    confirmPassword: string;
  }

  type inputType = {
    name: keyof FormValues
    label: string
    required?: string
    validate?: (value: string) => boolean | string
  }

  const defaultValues = {
    password: '',
    confirmPassword: '',
  }

  const { control, handleSubmit, formState: { errors }, getValues, reset } = useForm({ defaultValues })

  const inputs: inputType[] = [
    {
      name: 'password',
      label: 'Mot de passe',
      required: 'Le mot de passe est requis',
    },
    {
      name: 'confirmPassword',
      label: 'Confirmation du mot de passe',
      required: 'La confirmation du mot de passe est requise.',
      validate: (value) => {
        const password = getValues('password')
        return password === value || 'Les mots de passe ne correspondent pas.'
      },
    },
  ]

  const onCheck = useCallback(async () => {
    try {
      const result = await sendCheck({ userId, check, token }).unwrap()

      setIsValid(result.success)
    } catch (error) {
      dispatch(showToast({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue.', life: 3000 }))
    }
  }, [sendCheck, userId, check, token, dispatch])

  useEffect(() => {
    onCheck()
  }, [userId, check, token, onCheck])

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await changePassword({
        userId,
        check,
        token,
        password: data.password,
      }).unwrap()

      if (result.success) {
        dispatch(showToast({ severity: 'success', summary: 'Succès', detail: 'Votre mot de passe a bien été modifié.', life: 3000 }))
        reset()
        navigate('/login')
      } else {
        dispatch(showToast({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue, réessayez dans quelques minutes.', life: 3000 }))
      }
    } catch (e) {
      dispatch(showToast({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue, réessayez dans quelques minutes.', life: 3000 }))
    }
  }

  const getFormErrorMessage = (name: keyof FormValues) => {
    return errors[name] && <small className='p-error' style={{ position: 'absolute', bottom: '-1.2rem', left: 0, width: '100%', fontSize: '.8rem' }}>{errors[name]?.message}</small>
  }

  const renderInput = (input: any) => (
    <Controller
      name={input.name} control={control} rules={{ required: `Le ${input.label} est requis.` }} render={({ field, fieldState }) => (
        <InputText style={{ width: '250px' }} type='password' id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} />
      )}
    />
  )

  if (isLoadingCheck) {
    return (
      <HomeTemplate disableLogo>
        <Loading />
      </HomeTemplate>
    )
  }

  if (!isLoadingCheck && !isValid) {
    return (
      <HomeTemplate>
        <Content>
          <h1>Erreur</h1>
          <p>Le lien de réinitialisation de mot de passe est invalide ou a expiré.</p>
          <NavButton className='p-button-outlined' onClick={() => navigate('/')}>
            Retour à l'accueil
          </NavButton>
        </Content>
      </HomeTemplate>
    )
  }

  return (
    <HomeTemplate>
      <>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h1>Réinitialisation du mot de passe</h1>
          {inputs.map((input) => (
            <span key={input.name} className='p-float-label' style={{ position: 'relative' }}>
              {renderInput(input)}
              <label htmlFor={input.name}>{input.label}</label>
              {getFormErrorMessage(input.name)}
            </span>
          ))}
          <ButtonStyled loading={isLoading} type='submit'>Valider</ButtonStyled>
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

  h1 {
    font-size: 1.4rem;
    font-weight: 500;
    color: #fff;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;

  p {
    text-align: center;
    margin-bottom: 2rem;
  }
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

export default ResetPassword
