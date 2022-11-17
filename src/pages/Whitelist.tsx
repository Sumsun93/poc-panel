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
  useSetWhitelistMutation,
} from '@/services/whitelist'
import { useMemo, useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Member } from '@/services/community'
import { InputTextarea } from 'primereact/inputtextarea'
import { Rating, RatingChangeTargetOptions } from 'primereact/rating'
import { useSelector } from 'react-redux'
import { Tooltip } from 'primereact/tooltip'
import { Dialog } from 'primereact'

/**
 * Local import
 */

const dataDiscord = {
  success: true,
  name: 'Equipe 1',
  users: [
    {
      id: 69,
      discord: 'Sumsun#0656',
      socialclub: 'MrJaimeLaPatate',
      created_at: '27/11/2020',
      comments: [
        {
          comment: "Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1",
          notation: 3,
          author: 'MrJaimeLaPatate',
          created_at: 1668211527000,
        },
      ],
    },
    {
      id: 1,
      discord: 'Babooche#0001',
      socialclub: 'Sylundef',
      created_at: '10/10/2018',
      comments: [
        {
          comment: 't moche',
          notation: 1,
          author: 'Sylundef',
          created_at: 1610908379000,
        },
        {
          comment: 't moche',
          notation: 2,
          author: 'Sylundef',
          created_at: 1610908401000,
        },
        {
          comment: 'ok !',
          notation: 5,
          author: 'Sylundef',
          created_at: 1610979824000,
        },
        {
          comment: 'ok !!',
          notation: 5,
          author: 'Sylundef',
          created_at: 1610980062000,
        },
        {
          comment: 't moche',
          notation: 1,
          author: 'Sylundef',
          created_at: 1618243255000,
        },
        {
          comment: 'okk',
          notation: 5,
          author: 'Sylundef',
          created_at: 1618243269000,
        },
        {
          comment: 'trop top',
          notation: 5,
          author: 'Sylundef',
          created_at: 1635785725000,
        },
        {
          comment: 'trop nul',
          notation: 1,
          author: 'Sylundef',
          created_at: 1635785750000,
        },
        {
          comment: 'Trop top',
          notation: 5,
          author: 'Sylundef',
          created_at: 1635785761000,
        },
        {
          comment: 'top',
          notation: 5,
          author: 'Sylundef',
          created_at: 1636487783000,
        },
        {
          comment: 'nul',
          notation: 1,
          author: 'Sylundef',
          created_at: 1636487801000,
        },
        {
          comment: 'Le boss',
          notation: 5,
          author: 'MrJaimeLaPatate',
          created_at: 1655130029000,
        },
      ],
    },
  ],
}

/**
 * Component
 */
const Whitelist = () => {
  const [place, setPlace] = useState('5')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedMemberRating, setSelectedMemberRating] = useState<RatingChangeTargetOptions | null | undefined>(null)
  const [selectedMemberComment, setSelectedMemberComment] = useState<string>('')
  const [commentsVisible, setCommentsVisible] = useState(false)
  const { rights, socialclubName } = useSelector((state: any) => state.user)
  const { isLoading: dataDiscordIsLoading, refetch: dataDiscordRefetch } = useGetDiscordDataQuery('')
  const [triggerStartSession] = useLazyStartSessionQuery()
  const [triggerStopSession] = useLazyStopSessionsQuery()
  const [triggerSyncAllMembers] = useLazySyncAllMembersQuery()
  const [setWhitelist] = useSetWhitelistMutation()

  const dialogRef = useRef<any>(null)
  const startRef = useRef(null)

  const formatMember = (member: any): Member => {
    return ({
      id: member.id,
      discordName: member.discord,
      socialclub: member.socialclub,
      dateRegister: member.createdAt,
      lastComment: member.comments?.[member.comments.length - 1],
      allComments: member.comments,
    })
  }

  const members: any = useMemo(() => (!dataDiscordIsLoading && dataDiscord?.users)
    ? dataDiscord.users.map(formatMember)
    : null, [dataDiscordIsLoading])

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

  const handleSetWhitelist = () => {
    if (selectedMember?.id) {
      setWhitelist({
        id: selectedMember.id,
        body: {
          notation: selectedMemberRating?.value || 0,
          comment: selectedMemberComment,
        },
      })
    }
  }

  const actionBodyTemplate = (rowData: any) => {
    return (
      <>
        <Button
          icon='pi pi-list' className='p-button-lg p-button-rounded p-button-success p-button-text' onClick={() => {
            setCommentsVisible(true)
            // scroll dialogRef on bottom
            setTimeout(() => {
              // @ts-ignore
              dialogRef.current?.scrollTo(0, dialogRef.current.scrollHeight)
            }, 100)
            setSelectedMember(rowData)
          }}
        />
      </>
    )
  }

  const lastCommentBodyTemplate = (rowData: any) => (
    <>
      <div className={`p-d-flex p-flex-column last-comment-${rowData.id}`}>
        <div className='p-d-flex p-flex-row p-jc-between'>
          <span className='p-text-bold'>De: {rowData.lastComment?.author}</span>
        </div>
        <div className='p-d-flex p-flex-row p-jc-between'>
          <span>Le: {new Date(rowData.lastComment?.created_at).toLocaleString()}</span>
        </div>
        <div className='p-d-flex p-flex-row p-jc-between'>
          <Rating value={rowData.lastComment?.notation} readOnly cancel={false} />
        </div>
      </div>
      <Tooltip target={`.last-comment-${rowData.id}`} mouseTrack position='top'>
        {rowData.lastComment?.comment}
      </Tooltip>
    </>
  )

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
              <Column body={lastCommentBodyTemplate} header='Dernier commentaire' />
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

      <Dialog header={`Évaluations de ${selectedMember?.discordName}`} visible={commentsVisible} onHide={() => setCommentsVisible(false)} dismissableMask resizable blockScroll={false} style={{ minWidth: '480px', width: '480px', height: '705px', minHeight: '705px' }}>
        <AllComments ref={dialogRef}>
          {selectedMember?.allComments?.map((comment, index) => (
            <CommentCard key={index}>
              <CommentCardContent isMe={comment.author === socialclubName}>
                {comment.comment}
              </CommentCardContent>
              <CommentCardFooter>
                <Rating value={comment.notation} readOnly cancel={false} />
                <span className='comment-card-info'>De: {comment.author}</span>
                <span className='comment-card-info'>Le: {new Date(comment.createdAt).toLocaleString()}</span>
              </CommentCardFooter>
            </CommentCard>
          ))}
        </AllComments>
        <PanelContent>
          <h4>Soumettre une Évaluation</h4>
          <InputTextarea rows={5} cols={30} autoResize style={{ marginBottom: '1rem', width: '100%' }} value={selectedMemberComment} onChange={(event) => setSelectedMemberComment(event.target.value)} />
          <Rating value={selectedMemberRating?.value || 0} onChange={(event) => setSelectedMemberRating(event.target)} cancel={false} />
          <CustomButton label='Valider' style={{ marginTop: '1rem' }} onClick={handleSetWhitelist} />
        </PanelContent>
      </Dialog>
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

  .p-rating {
    width: 100%;
    margin: .2rem 0;
  }

  .p-rating .p-rating-item .p-rating-icon {
    font-size: 1rem;
    color: rgb(255,193,21);
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  // max-width: 864px;
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

  .p-rating {
    width: 100%;
    margin: .2rem 0;
    justify-content: center;
  }

  .p-rating .p-rating-item .p-rating-icon {
    font-size: 1rem;
    color: rgb(255,193,21);
  }
`

const CustomInput = styled(InputText)`
  margin-bottom: 1rem;
`

const AllComments = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: calc(100% - 17rem);
  overflow-y: auto;
`

const CommentCard = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .p-rating {
    width: 100%;
    margin: .2rem 0;
  }

  .p-rating .p-rating-item .p-rating-icon {
    font-size: 1rem;
    color: rgb(255,193,21);
  }
`

const CommentCardContent = styled.div`
  padding: 1rem;
  background-color: ${({ isMe }: { isMe: boolean }) => isMe ? 'rgb(255,193,21)' : 'rgb(240, 242, 245)'};
  border-radius: 0.5rem;
  width: fit-content;
  max-width: 100%;
  max-height: 8rem;
  overflow-y: auto;
  box-shadow: rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem;

  // custom scrollbar
  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgb(107, 114, 128);
    border-radius: 0.5rem;
  }
`

const CommentCardFooter = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.75rem;

  .comment-card-info {
    margin-right: .5rem;
    color: rgb(107, 114, 128);
  }
`

const CustomButton = styled(Button)`
  margin-top: 1rem;
  background: linear-gradient(195deg,rgb(255 189 103),rgb(205 137 3));

  border: none;

  &:hover {
    background: linear-gradient(195deg,rgb(255 189 103),rgb(205 137 3)) !important;
  }
`

export default Whitelist
