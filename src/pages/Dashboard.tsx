/**
 * Package import
 */
import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import Lottie from 'react-lottie'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Local import
 */
// import { useGetCharactersQuery } from '@/services/profil'
import StatCard from '@/components/StatCard'
import working from '@/assets/animations/working.json'
import { useLazyAskWhitelistQuery, useLazyGetProfilQuery, useLazyRemoveWhitelistQuery } from '@/services/profil'
import { disconnect } from '@/features/authSlice'
import { setUser } from '@/features/userSlice'
import { showToast } from '@/features/utilsSlice'
// import { useGetServerStatusQuery } from '@/services/live'
// import Loading from '@/components/Loading'
// import CharacterCard from '@/components/CharacterCard'

/**
 * Component
 */
const Dashboard = () => {
  const dispatch = useDispatch()
  // const { data: characters, isLoading: charactersLoading } = useGetCharactersQuery('')
  const [askWhitelist, askWhitelistResult] = useLazyAskWhitelistQuery()
  const [removeWhitelist, removeWhitelistResult] = useLazyRemoveWhitelistQuery()
  // const { data: serverStatus } = useGetServerStatusQuery('')
  const [getProfil, profilResult] = useLazyGetProfilQuery()
  const { insertionTime, whitelistStatut, whitelistNumber } = useSelector((state: any) => state.user)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: working,
  }

  const handleAskWhitelist = useCallback(() => {
    askWhitelist('')
  }, [askWhitelist])

  const handleCancelWhitelist = useCallback(() => {
    removeWhitelist('')
  }, [removeWhitelist])

  useEffect(() => {
    if (askWhitelistResult.isSuccess && askWhitelistResult.data.success) {
      getProfil('')
      dispatch(showToast({ severity: 'success', summary: 'Demande envoyée', detail: 'Votre demande a bien été envoyée.', life: 3000 }))
    } else if (askWhitelistResult.isSuccess) {
      dispatch(showToast({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue, merci de contacter un membre de l\'équipe.', life: 3000 }))
    }
  }, [askWhitelistResult, dispatch, getProfil])

  useEffect(() => {
    if (removeWhitelistResult.isSuccess && removeWhitelistResult.data.success) {
      getProfil('')
      dispatch(showToast({ severity: 'success', summary: 'Demande annulée', detail: 'Votre demande a bien été annulée.', life: 3000 }))
    } else if (removeWhitelistResult.isSuccess) {
      dispatch(showToast({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue, merci de contacter un membre de l\'équipe.', life: 3000 }))
    }
  }, [dispatch, getProfil, removeWhitelistResult])

  useEffect(() => {
    if (profilResult.isSuccess) {
      if (profilResult.data.error) {
        dispatch(disconnect())
      } else {
        dispatch(setUser(profilResult.data))
      }
    }
  }, [dispatch, profilResult])

  const buttonWhitelist = useMemo(() => {
    switch (whitelistNumber) {
      case 0:
        return {
          label: 'Devenir candidat',
          icon: 'pi pi-fw pi-user-plus',
          iconBg: 'linear-gradient(195deg,rgb(255, 189, 103),rgb(255, 193, 21))',
          callback: handleAskWhitelist,
        }
      case 1:
        return {
          label: 'Annuler la demande',
          icon: 'pi pi-fw pi-user-minus',
          iconBg: 'linear-gradient(195deg,rgb(178, 120, 212),rgb(146, 92, 177))',
          callback: handleCancelWhitelist,
        }
      default: {
        return null
      }
    }
  }, [handleAskWhitelist, handleCancelWhitelist, whitelistNumber])

  return (
    <Container>
      <h1>Votre tableau de bord</h1>
      <StatsContainer>
        <StatCard
          title='État du serveur'
          value='Éteint'
          icon='pi pi-fw pi-server'
          iconBg='linear-gradient(195deg,rgb(233, 86, 86),rgb(202, 44, 44))'
          desc='En cours développement'
        />
        <StatCard
          title='Communauté'
          value='Membre'
          desc={`Depuis le ${new Date(insertionTime).toLocaleString()} (${Math.floor((Date.now() - insertionTime) / 86400000)} jours)`}
          icon='pi pi-user'
        />
        <StatCard value={whitelistStatut} title='Whitelist' icon='pi pi-users' iconBg={buttonWhitelist?.iconBg} buttonText={buttonWhitelist?.label} buttonIcon={buttonWhitelist?.icon} buttonOnClick={buttonWhitelist?.callback} />
      </StatsContainer>
      <Content>
        <Working>
          <Lottie
            options={defaultOptions}
          />
          <h2>Serveur en cours de développement.</h2>
          <h2 style={{ visibility: 'hidden', position: 'absolute' }}>Imagine ici on met une date de sortie ?</h2>
        </Working>
      </Content>
      {/* charactersLoading && <Loading /> */}
      {/* !charactersLoading && characters && (
        <div>
          {characters.list.map((character: any) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      ) */}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-basis: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1rem;

  h1 {
    margin-bottom: 2rem;
  }
`

const StatsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: flex-start;
`

const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`

const Working = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default Dashboard
