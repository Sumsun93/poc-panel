/**
 * Package import
 */
import styled from 'styled-components'
import StatCard from '@/components/StatCard'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { OverlayPanel } from 'primereact/overlaypanel'
import {
  useGetDiscordDataQuery,
  useLazyStartSessionQuery,
  useLazyStopSessionsQuery,
  useLazySyncAllMembersQuery,
} from '@/services/whitelist'
import { useMemo, useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Member } from '@/services/community'
import { InputTextarea } from 'primereact/inputtextarea'
import { Rating } from 'primereact/rating'
import { useSelector } from 'react-redux'

/**
 * Local import
 */

/**
 * Component
 */
const Whitelist = () => {
  const [place, setPlace] = useState('5')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedMemberRating, setSelectedMemberRating] = useState<number | null | undefined>(null)
  const { rights } = useSelector((state: any) => state.user)
  const { data: dataDiscord, isLoading: dataDiscordIsLoading, refetch: dataDiscordRefetch } = useGetDiscordDataQuery('')
  const [triggerStartSession] = useLazyStartSessionQuery()
  const [triggerStopSession] = useLazyStopSessionsQuery()
  const [triggerSyncAllMembers] = useLazySyncAllMembersQuery()

  const startRef = useRef(null)
  const ratingRef = useRef(null)

  const formatMember = (comment: string[]) => (member: any, index: number) => ({
    id: member[0],
    discordName: member[1],
    socialclub: member[2],
    dateRegister: member[3],
    comment: comment[index],
  })

  const members: any = useMemo(() => (!dataDiscordIsLoading && dataDiscord?.list && dataDiscord?.comment)
    ? dataDiscord.list.map(formatMember(dataDiscord.comment))
    : null, [dataDiscord?.comment, dataDiscord?.list, dataDiscordIsLoading])

  const handleSyncDiscord = () => {
    dataDiscordRefetch()
  }

  const handleSyncAllMembers = () => {
    triggerSyncAllMembers('')
  }

  const handleStartSession = (event: React.MouseEvent<HTMLElement>) => {
    // @ts-ignore
    startRef.current?.toggle(event)
  }

  const handleConfirmStart = () => {
    // @ts-ignore
    startRef.current?.hide()
    triggerStartSession(place)
  }

  const handleStopSessions = () => {
    triggerStopSession('')
  }

  const actionBodyTemplate = (rowData: any) => {
    return (
      <>
        <Button
          icon='pi pi-verified' className='p-button-lg p-button-rounded p-button-success p-button-text' onClick={(event) => {
            // @ts-ignore
            ratingRef.current?.toggle(event)
            setSelectedMember(rowData)
          }}
        />
      </>
    )
  }

  return (
    <Container>
      <h1>Gestion des whitelist</h1>
      <Actions>
        <StatCard title='Informations du salon' buttonText='Synchroniser' buttonOnClick={handleSyncDiscord} buttonIcon='pi pi-sync' iconBg='linear-gradient(195deg,rgb(255 189 103),rgb(205 137 3))' icon='pi pi-users' />
        <StatCard title='Rôles des membres' buttonText='Synchroniser' buttonOnClick={handleSyncAllMembers} buttonIcon='pi pi-sync' iconBg='linear-gradient(195deg,rgb(215 122 122),rgb(211 15 15))' icon='pi pi-times-circle' />
        {rights?.discordaccess && (
          <>
            <StatCard title='Sessions whitelist' buttonText='Démarrer une session' buttonOnClick={handleStartSession} buttonIcon='pi pi-play' icon='pi pi-shield' />
            <StatCard title='Sessions whitelist' buttonText='Arrêter les sessions' buttonOnClick={handleStopSessions} buttonIcon='pi pi-stop' icon='pi pi-shield' />
          </>
        )}
      </Actions>
      <MembersList>
        {members && (
          <>
            <h2>{dataDiscord.name}</h2>
            <DataTable size='small' style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: 'rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem' }} value={members} paginator rows={10} rowsPerPageOptions={[10, 20, 50]}>
              <Column field='id' header='ID' />
              <Column field='discordName' header='Pseudo Discord' />
              <Column field='socialclub' header='Socialclub' />
              <Column field='dateRegister' header="Date d'inscription" />
              <Column field='comment' header='Dernier commentaire' />
              <Column body={actionBodyTemplate} />
            </DataTable>
          </>
        )}
      </MembersList>

      <CustomOverlay ref={startRef}>
        <PanelContent>
          <h4>Nombre de place (5 par défaut)</h4>
          <CustomInput placeholder='5' type='number' onChange={(event) => setPlace(event.target.value)} value={place} />
          <Button label='Start' disabled={!place.length} onClick={handleConfirmStart} />
        </PanelContent>
      </CustomOverlay>

      <OverlayPanel ref={ratingRef}>
        <PanelContent>
          <h4>Évaluation de {selectedMember?.discordName}</h4>
          <InputTextarea rows={5} cols={30} autoResize style={{ marginBottom: '1rem' }} />
          <Rating value={selectedMemberRating || 0} onChange={(event) => setSelectedMemberRating(event.value)} cancel={false} onIcon='pi pi-heart-fill' offIcon='pi pi-heart' />
        </PanelContent>
      </OverlayPanel>
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

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  max-width: 864px;
`

const MembersList = styled.div`
  width: 100%;
  margin-top: 1rem;
`

const CustomOverlay = styled(OverlayPanel)`
  width: 16rem;
`

const PanelContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const CustomInput = styled(InputText)`
  margin-bottom: 1rem;
`

export default Whitelist
