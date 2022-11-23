/**
 * Package import
 */
import styled from 'styled-components'
import StatCard from '@/components/StatCard'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { OverlayPanel } from 'primereact/overlaypanel'
import {
  useGetDiscordDataQuery, useGetStatusQuery,
  useLazyStartSessionQuery,
  useLazyStopSessionsQuery,
  useLazySyncAllMembersQuery,
  useSetWhitelistMutation,
} from '@/services/whitelist'
import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { InputText } from 'primereact/inputtext'
import { Member } from '@/services/community'
import { InputTextarea } from 'primereact/inputtextarea'
import { Rating, RatingChangeTargetOptions } from 'primereact/rating'
import { useSelector } from 'react-redux'
import { Tooltip } from 'primereact/tooltip'
import { Dialog } from 'primereact'
import { useLocation } from 'react-router-dom'
import { Toast } from 'primereact/toast'
import Lottie from 'react-lottie'
import { Button } from 'primereact/button'

/**
 * Local import
 */
import CustomButton from '@/components/Button'
import binoculars from '@/assets/animations/binoculars.json'

/* const dataDiscord2 = {
  success: true,
  name: 'Equipe 1',
  users: [
    {
      id: 69,
      discord: 'Sumsun#0656',
      socialclub: 'MrJaimeLaPatate',
      createdAt: '27/11/2020',
      comments: [
        {
          comment: "Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1 Test d'un commentaire 1",
          notation: 3,
          author: 'MrJaimeLaPatate',
          createdAt: 1668211527000,
        },
      ],
    },
    {
      id: 1,
      discord: 'Babooche#0001',
      socialclub: 'Sylundef',
      createdAt: '10/10/2018',
      comments: [
        {
          comment: 't moche',
          notation: 1,
          author: 'Sylundef',
          createdAt: 1610908379000,
        },
        {
          comment: 't moche',
          notation: 2,
          author: 'Sylundef',
          createdAt: 1610908401000,
        },
        {
          comment: 'ok !',
          notation: 5,
          author: 'Sylundef',
          createdAt: 1610979824000,
        },
        {
          comment: 'ok !!',
          notation: 5,
          author: 'Sylundef',
          createdAt: 1610980062000,
        },
        {
          comment: 't moche',
          notation: 1,
          author: 'Sylundef',
          createdAt: 1618243255000,
        },
        {
          comment: 'okk',
          notation: 5,
          author: 'Sylundef',
          createdAt: 1618243269000,
        },
        {
          comment: 'trop top',
          notation: 5,
          author: 'Sylundef',
          createdAt: 1635785725000,
        },
        {
          comment: 'trop nul',
          notation: 1,
          author: 'Sylundef',
          createdAt: 1635785750000,
        },
        {
          comment: 'Trop top',
          notation: 5,
          author: 'Sylundef',
          createdAt: 1635785761000,
        },
        {
          comment: 'top',
          notation: 5,
          author: 'Sylundef',
          createdAt: 1636487783000,
        },
        {
          comment: 'nul',
          notation: 1,
          author: 'Sylundef',
          createdAt: 1636487801000,
        },
        {
          comment: 'Le boss',
          notation: 5,
          author: 'MrJaimeLaPatate',
          createdAt: 1655130029000,
        },
      ],
    },
  ],
} */

/**
 * Component
 */
const Whitelist = () => {
  const [place, setPlace] = useState('5')
  const [isMounted, setIsMounted] = useState(false)
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [selectedMemberRating, setSelectedMemberRating] = useState<RatingChangeTargetOptions | null | undefined>(null)
  const [selectedMemberComment, setSelectedMemberComment] = useState<string>('')
  const [commentsVisible, setCommentsVisible] = useState(false)
  const { rights, socialclubName } = useSelector((state: any) => state.user)
  const { data: dataDiscord, isLoading: dataDiscordIsLoading, refetch: dataDiscordRefetch } = useGetDiscordDataQuery('')
  const { data: statusData, refetch: statusDataRefetch } = useGetStatusQuery('')
  const [triggerStartSession, resultStartSession] = useLazyStartSessionQuery()
  const [triggerStopSession, resultStopSession] = useLazyStopSessionsQuery()
  const [triggerSyncAllMembers] = useLazySyncAllMembersQuery()
  const [setWhitelist, resultSetWhitelist] = useSetWhitelistMutation()
  const location = useLocation()

  const dialogRef = useRef<any>(null)
  const startRef = useRef(null)
  const toastRef = useRef<any>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSyncDiscord = useCallback(() => {
    dataDiscordRefetch()
    statusDataRefetch()
  }, [dataDiscordRefetch, statusDataRefetch])

  useEffect(() => {
    if (resultStartSession.isSuccess || resultStopSession.isSuccess) {
      handleSyncDiscord()
    }
  }, [handleSyncDiscord, resultStartSession, resultStopSession])

  useEffect(() => {
    if (resultSetWhitelist.isSuccess && resultSetWhitelist.data) {
      dataDiscordRefetch()
      setSelectedMemberRating(null)
      setSelectedMemberComment('')

      // @ts-ignore
      toastRef.current.show({ severity: 'success', summary: 'Commentaire ajouté', detail: 'Le commentaire a bien été ajouté', life: 3000 })
    } else if (resultSetWhitelist.isSuccess) {
      // @ts-ignore
      toastRef.current.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue', life: 3000 })
    }
  }, [dataDiscordRefetch, resultSetWhitelist])

  useEffect(() => {
    if (isMounted) {
      dataDiscordRefetch()
    }
  }, [dataDiscordRefetch, isMounted, location])

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
    : null, [dataDiscord?.users, dataDiscordIsLoading])

  const selectedMemberData: Member = useMemo(() => members?.find((member: any) => member.id === selectedMember), [members, selectedMember])

  useEffect(() => {
    // scroll dialogRef on bottom
    setTimeout(() => {
      // @ts-ignore
      dialogRef.current?.scrollTo(0, dialogRef.current.scrollHeight)
    }, 100)
  }, [selectedMemberData?.allComments?.length])

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
    if (selectedMemberData) {
      setWhitelist({
        id: selectedMemberData.id,
        body: {
          notation: selectedMemberRating?.value || 0,
          comment: selectedMemberComment,
        },
      })
    }
  }

  const onIconProps = (rating: number) => ({ style: { color: rating > 2 ? 'rgb(67,160,71)' : 'rgb(211 15 15)' } })

  const actionBodyTemplate = (rowData: any) => {
    return (
      <>
        <CustomButton
          aloneContent
          style={{ width: 'fit-content', margin: '0' }}
          onClick={() => {
            setCommentsVisible(true)
            // scroll dialogRef on bottom
            setTimeout(() => {
              // @ts-ignore
              dialogRef.current?.scrollTo(0, dialogRef.current.scrollHeight)
            }, 100)
            setSelectedMember(rowData.id)
          }}
        >
          <i style={{ fontSize: '1rem' }} className='pi pi-comments' />
        </CustomButton>
      </>
    )
  }

  const lastCommentBodyTemplate = (rowData: any) => {
    if (rowData.lastComment) {
      return (
        <>
          <div className={`p-d-flex p-flex-column last-comment-${rowData.id}`}>
            <div className='p-d-flex p-flex-row p-jc-between'>
              <span className='p-text-bold'>De: {rowData.lastComment?.author}</span>
            </div>
            <div className='p-d-flex p-flex-row p-jc-between'>
              <span>Le: {new Date(rowData.lastComment?.created_at).toLocaleString()}</span>
            </div>
            <div className='p-d-flex p-flex-row p-jc-between'>
              <Rating value={rowData.lastComment?.notation} readOnly cancel={false} onIconProps={onIconProps(rowData.lastComment?.notation)} />
            </div>
          </div>
          <Tooltip target={`.last-comment-${rowData.id}`} mouseTrack position='top'>
            {rowData.lastComment?.comment}
          </Tooltip>
        </>
      )
    }
    return (
      <span className='p-text-bold'>Aucun commentaire</span>
    )
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: binoculars,
  }

  return (
    <Container>
      <Toast ref={toastRef} />
      <ActionsHeader>
        <h1>Gestion des whitelist</h1>
        {/* Refresh button */}
        <CustomButton onClick={handleSyncDiscord} style={{ width: 'fit-content' }} aloneContent>
          <i className='pi pi-sync' />
        </CustomButton>
      </ActionsHeader>
      <Actions>
        <StatCard title='Rôles des membres' buttonText='Synchroniser' buttonOnClick={handleSyncAllMembers} buttonIcon='pi pi-sync' iconBg='linear-gradient(195deg,rgb(233, 86, 86),rgb(202, 44, 44))' icon='pi pi-times-circle' />
        {rights?.discordaccess && statusData?.success
          ? (
            <StatCard title='Sessions whitelist' value='Lancée' buttonText='Arrêter les sessions' buttonOnClick={handleStopSessions} buttonIcon='pi pi-stop' icon='pi pi-shield' iconBg='linear-gradient(195deg,rgb(233, 86, 86),rgb(202, 44, 44))' />
            )
          : (
            <StatCard title='Sessions whitelist' value='Arrêtée' buttonText='Démarrer une session' buttonOnClick={handleStartSession} buttonIcon='pi pi-play' icon='pi pi-shield' />
            )}
      </Actions>
      <MembersList>
        <MembersListHeader>
          <h2>{dataDiscord?.name || 'Vous n\'êtes connecté dans aucun salon.'}</h2>
        </MembersListHeader>
        {members
          ? (
            <DataTable size='small' style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: 'rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem' }} value={members} paginator rows={10} rowsPerPageOptions={[10, 20, 50]}>
              <Column field='id' header='ID' />
              <Column field='discordName' header='Pseudo Discord' />
              <Column field='socialclub' header='Socialclub' />
              <Column field='dateRegister' header="Date d'inscription" />
              <Column body={lastCommentBodyTemplate} header='Dernier commentaire' />
              <Column body={actionBodyTemplate} />
            </DataTable>
            )
          : (
            <div className='p-d-flex p-flex-column p-jc-center p-ai-center' style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Lottie options={defaultOptions} height={200} width={200} />
            </div>
            )}
      </MembersList>

      <CustomOverlay ref={startRef}>
        <PanelContent>
          <h4>Nombre de place (5 par défaut)</h4>
          <CustomInput placeholder='5' type='number' onChange={(event) => setPlace(event.target.value)} value={place} />
          <Button label='Start' disabled={!place.length} onClick={handleConfirmStart} />
        </PanelContent>
      </CustomOverlay>

      <Dialog header={`Évaluations de ${selectedMemberData?.discordName}`} visible={commentsVisible} onHide={() => setCommentsVisible(false)} dismissableMask resizable blockScroll={false} style={{ minWidth: '480px', width: '480px', height: '705px', minHeight: '705px' }}>
        <AllComments ref={dialogRef}>
          {selectedMemberData?.allComments?.map((comment, index) => (
            <CommentCard key={index}>
              {comment.author === socialclubName && (
                <>
                  <Tooltip target='.mine-icon' content={'Tu es l\'auteur de cette évaluation'} />
                  <IsMeIcon className='mine-icon'>
                    <i className='pi pi-eye' />
                  </IsMeIcon>
                </>
              )}
              <CommentCardContent>
                {comment.comment}
              </CommentCardContent>
              <CommentCardFooter>
                <Rating value={comment.notation} readOnly cancel={false} onIconProps={onIconProps(comment.notation)} />
                <span className='comment-card-info'>De: {comment.author}</span>
                <span className='comment-card-info'>Le: {new Date(comment.createdAt).toLocaleString()}</span>
              </CommentCardFooter>
            </CommentCard>
          )) || (
            <CommentCard>
              <CommentCardContent>
                Aucune évaluation, sois le premier à en faire une !
              </CommentCardContent>
            </CommentCard>
          )}
        </AllComments>
        <PanelContent>
          <h4>Soumettre une Évaluation</h4>
          <InputTextarea rows={5} cols={30} autoResize style={{ marginBottom: '1rem', width: '100%' }} value={selectedMemberComment} onChange={(event) => setSelectedMemberComment(event.target.value)} />
          <Rating value={selectedMemberRating?.value || 0} onChange={(event) => setSelectedMemberRating(event.target)} cancel={false} onIconProps={onIconProps(selectedMemberRating?.value || 0)} />
          {selectedMemberRating?.value
            ? (
              <h5 style={{ color: selectedMemberRating?.value > 2 ? 'rgb(67,160,71)' : 'rgb(211 15 15)' }}>
                Le joueur
                {selectedMemberRating?.value > 2 ? ' sera ' : ' ne sera pas '}
                whitelist
              </h5>
              )
            : (
              <h5>En attente d'une note</h5>
              )}
          <CustomButton style={{ marginTop: '1rem', width: 'fit-content' }} onClick={handleSetWhitelist}>
            <>
              Valider
            </>
          </CustomButton>
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
    color: rgb(67,160,71);
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  // max-width: 864px;
`

const ActionsHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;

  h1 {
    margin-right: 1rem;
  }
`

const MembersList = styled.div`
  width: 100%;
  margin-top: 1rem;
`

const MembersListHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  h2 {
    margin-right: 1rem;
  }
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

  .p-rating .p-rating-item {
    :focus {
      border: none;
      outline: none;
      box-shadow: none;
    }

  }

  .p-rating:not(.p-disabled):not(.p-readonly) .p-rating-item:hover .p-rating-icon {
    color: rgb(255,193,21);
  }

  .p-rating .p-rating-item .p-rating-icon {
    font-size: 1rem;
    color: rgb(67,160,71);
  }

  .p-rating .p-rating-item:nth-child(1) .p-rating-icon, .p-rating-item:nth-child(2) .p-rating-icon {
    font-size: 1rem;
    color: rgb(211 15 15);
  }

  h5 {
    margin: 0;
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
  height: calc(100% - 20rem);
  overflow-y: auto;
`

const CommentCard = styled.div`
  position: relative;
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
    color: rgb(67,160,71);
  }
`

const CommentCardContent = styled.div`
  padding: 1rem;
  background-color: rgb(240, 242, 245);
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

const IsMeIcon = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  color: rgb(255,193,21);

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

export default Whitelist
