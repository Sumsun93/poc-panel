/**
 * Package import
 */
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup'

/**
 * Local import
 */
import {
  useGetMemberByIdQuery,
  useGetMemberCharactersByIdQuery,
  useLazyDeleteMemberQuery,
} from '@/services/community'
import Loading from '@/components/Loading'
import StatCard from '@/components/StatCard'
import CharacterCard from '@/components/CharacterCard'
import { Character } from '@/types/user'
import { showToast } from '@/features/utilsSlice'
import { useDispatch } from 'react-redux'
import { Carousel } from 'primereact'

/**
 * Component
 */
const User = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, isLoading } = useGetMemberByIdQuery(parseInt(params.userId as string, 0))
  const { data: characters, isLoading: charactersLoading } = useGetMemberCharactersByIdQuery(parseInt(params.userId as string, 0))
  const [triggerDeleteMember, resultDeleteMember] = useLazyDeleteMemberQuery()

  useEffect(() => {
    if (data && !data.user) {
      navigate('/members')
    }
  }, [data, navigate])

  useEffect(() => {
    if (resultDeleteMember.isUninitialized) return

    if (!resultDeleteMember.isLoading) {
      if (resultDeleteMember.isSuccess && resultDeleteMember.data.success) {
        dispatch(showToast({ severity: 'success', summary: 'Succès', detail: 'L\'utilisateur a bien été supprimé.' }))
        navigate('/members')
      } else {
        dispatch(showToast({ severity: 'error', summary: 'Erreur', detail: 'Impossible de supprimer cet utilisateur.' }))
      }
    }
  }, [dispatch, navigate, resultDeleteMember])

  const handleWantDelete = (evt: React.MouseEvent<HTMLElement>) => {
    const confirm = confirmPopup({
      target: evt.currentTarget,
      message: `Voulez vous vraiment supprimer l'utilisateur ${data.user.socialclubName} ?`,
      icon: 'pi pi-exclamation-triangle',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-check',
      acceptLabel: 'Oui (IRRÉVERSIBLE FAIS PAS LE CON)',
      acceptClassName: 'p-button-danger',
      rejectClassName: 'p-button-secondary p-button-outlined',
      accept: () => {
        triggerDeleteMember(data.user.id)
      },
    })

    confirm.show()
  }

  const buttonWhitelist = useMemo(() => {
    switch (data?.user?.whitelistNumber || 2) {
      case 0:
        return {
          iconBg: 'linear-gradient(195deg,rgb(255, 189, 103),rgb(255, 193, 21))',
        }
      case 1:
        return {
          iconBg: 'linear-gradient(195deg,rgb(178, 120, 212),rgb(146, 92, 177))',
        }
      default: {
        return null
      }
    }
  }, [data?.user?.whitelistNumber])

  const characterTemplate = (character: Character) => (
    <CharacterCard
      character={character}
    />
  )

  if (isLoading || !data?.user) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  return (
    <Container>
      <h1>Fiche de {data.user.socialclubName}</h1>

      <StatsContainer>
        <StatCard title='Communauté' value='Membre' desc={`Depuis le ${new Date(data.user.insertionTime).toLocaleString()} (${Math.floor((Date.now() - data.user.insertionTime) / 86400000)} jours)`} icon='pi pi-user' />
        <StatCard value={data.user.whitelistStatut} title='Whitelist' icon='pi pi-users' iconBg={buttonWhitelist?.iconBg} />
        <StatCard
          value='Supprimer'
          icon='pi pi-trash'
          buttonText='Supprimer le compte'
          buttonIcon='pi pi-trash'
          iconBg='linear-gradient(195deg,rgb(233, 86, 86),rgb(202, 44, 44))'
          buttonOnClick={handleWantDelete}
        />
      </StatsContainer>

      <h2>Personnages</h2>
      {charactersLoading && <Loading />}
      <CharactersList>
        {(!charactersLoading && characters?.list) && <Carousel value={characters.list} numVisible={3} numScroll={1} itemTemplate={characterTemplate} />}
      </CharactersList>
      <ConfirmPopup />
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

const CharactersList = styled.div`
  width: 100%;
  margin-top: 1rem;
  padding-top: 1rem;
`

export default User
