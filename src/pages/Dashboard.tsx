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
    if (askWhitelistResult.isSuccess) {
      getProfil('')
    }
  }, [askWhitelistResult, getProfil])

  useEffect(() => {
    if (removeWhitelistResult.isSuccess) {
      getProfil('')
    }
  }, [getProfil, removeWhitelistResult])

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
          label: 'Demande de candidature',
          icon: 'pi pi-fw pi-user-plus',
          callback: handleAskWhitelist,
        }
      case 1:
        return {
          label: 'Annuler la demande',
          icon: 'pi pi-fw pi-user-minus',
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
        <StatCard value='Membre' title={`Depuis le ${insertionTime}`} icon='pi pi-user' />
        <StatCard value={whitelistStatut} title='Whitelist' iconBg='linear-gradient(195deg,rgb(255 189 103),rgb(205 137 3))' icon='pi pi-users' buttonText={buttonWhitelist?.label} buttonIcon={buttonWhitelist?.icon} buttonOnClick={buttonWhitelist?.callback} />
      </StatsContainer>
      <Content>
        <Working>
          <Lottie
            options={defaultOptions}
          />
          <h2>En cours de développement</h2>
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
`

const StatsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
`

const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Working = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;
`

export default Dashboard
