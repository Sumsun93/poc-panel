/**
 * Package import
 */
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { Dialog } from 'primereact'
import { Tooltip } from 'primereact/tooltip'
import { Rating, RatingChangeTargetOptions } from 'primereact/rating'
import { InputTextarea } from 'primereact/inputtextarea'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Local import
 */
import CustomButton from '@/components/Button'
import { useSetWhitelistMutation } from '@/services/whitelist'
import { showToast } from '@/features/utilsSlice'

/**
 * Component
 */
const WhitelistComment = forwardRef(({ id, titleName, isVisible, onHide, allComments, onSend }: {
  id: number
  titleName: string
  isVisible: boolean
  onHide: () => void
  allComments: any
  onSend: () => void
}, ref: ForwardedRef<any>) => {
  const dispatch = useDispatch()

  const { socialclubName } = useSelector((state: any) => state.user)

  const [selectedMemberRating, setSelectedMemberRating] = useState<RatingChangeTargetOptions | null | undefined>(null)
  const [selectedMemberComment, setSelectedMemberComment] = useState<string>('')

  const [setWhitelist, resultSetWhitelist] = useSetWhitelistMutation()

  useEffect(() => {
    if (resultSetWhitelist.isSuccess && resultSetWhitelist.data) {
      onSend()
      setSelectedMemberRating(null)
      setSelectedMemberComment('')

      dispatch(showToast({ severity: 'success', summary: 'Commentaire ajouté', detail: 'Le commentaire a bien été ajouté', life: 3000 }))
    } else if (resultSetWhitelist.isSuccess) {
      dispatch(showToast({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue', life: 3000 }))
    }
  }, [dispatch, onSend, resultSetWhitelist])

  const handleSetWhitelist = () => {
    setWhitelist({
      id,
      body: {
        notation: selectedMemberRating?.value || 0,
        comment: selectedMemberComment,
      },
    })
  }

  const onIconProps = (rating: number) => ({ style: { color: rating > 2 ? 'rgb(67,160,71)' : 'rgb(211 15 15)' } })

  return (
    <Dialog header={`Évaluations de ${titleName}`} visible={isVisible} onHide={onHide} dismissableMask resizable blockScroll={false} style={{ minWidth: '480px', width: '480px', height: '705px', minHeight: '705px' }}>
      <AllComments ref={ref}>
        {allComments.map((comment: any, index: number) => (
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
  )
})

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

export default WhitelistComment
